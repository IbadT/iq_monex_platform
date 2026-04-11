import { AppLogger } from '@/common/logger/logger.service';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateListingDto } from './dto/request/create-listing.dto';
import { ListingQueryDto } from './dto/request/listing-query.dto';
import { prisma } from '@/lib/prisma';
import { StatusQueryDto } from './dto/request/status-query.dto';
import { ListingStatus } from './enums/listing-status.enum';
import { FileOwnerType, FileKind } from '../../prisma/generated/enums';
import {
  Decimal,
  TransactionIsolationLevel,
} from '../../prisma/generated/internal/prismaNamespace';
import { CacheService } from '@/cache/cacheService.service';
import { S3Service } from '@/s3/s3.service';
import { SubscriptionService } from '@/subscription/subscription.service';
import { ChangeListingStatusDto } from './dto/request/change-listing-status.dto';
import { UpdateListingDto } from './dto/request/update-listing.dto';
import { JwtPayload } from '@/common/interfaces/jwt-payload.interface';
import { SearchService } from '@/search/search.service';
import { ListingDocument } from '@/search/interfaces/listing.interface';
import { RabbitmqService } from '@/rabbitmq/rabbitmq.service';
import { ComplaintType } from '@/users/enums/complaint-type.enum';
import { MakeComplaintToListing } from './dto/request/make-complaint-to-listing.dto';
import { GetRecomentQueryDto } from './dto/request/get-recoment-query.dto';
import { FORBIDDEN_WORDS } from './forbidden-words/forbidden-words';
import { CategoriesService } from '@/categories/categories.service';
import { DictionariesService } from '@/dictionaries/dictionaries.service';
import { MapLocationsService } from '@/map_locations/map_locations.service';
import { IListing } from './interfaces/listing.interface';
import { Prisma } from 'prisma/generated/client';
import { ListingResposeDto } from './dto/response/listing-response.dto';
import { ListingMapper } from './mappers/listing.mapper';
import { CreateListingResponseDto } from './dto/response/create-listing-response.dto';
import { ChangeStatusResponseDto } from './dto/response/change-status-response.dto';
import { BulkRestoreResponseDto } from './dto/response/bulk-restore-response.dto';
import { CreateListingComplaintResponseDto } from './dto/response/create-listing-complaint-response.dto';
import { FileService } from '@/s3/file.service';
import { PromoParticipantService } from '@/promo/promo_participant.service';
import { NoteTargetType } from '@/notes';

@Injectable()
export class ListingsService {
  protected ARCHIVE_AUTO_DELETE_DAYS = 60;

  constructor(
    private readonly subscriptionService: SubscriptionService,
    private readonly cacheSevice: CacheService,
    private readonly s3Service: S3Service,
    private readonly searchService: SearchService,
    private readonly rabbitmqService: RabbitmqService,
    private readonly categoriesService: CategoriesService,
    private readonly dictionariesService: DictionariesService,
    private readonly mapLocationsService: MapLocationsService,
    private readonly fileService: FileService,
    private readonly promoParticipantService: PromoParticipantService,
    private readonly logger: AppLogger,
  ) {}

  async getRecomendsByListingId(listingId: string, query: GetRecomentQueryDto) {
    const listing = await prisma.listing.findUnique({
      where: {
        id: listingId,
      },
    });

    if (!listing) {
      throw new NotFoundException('Объявление не найдено');
    }

    let minPrice: number;
    let maxPrice: number;

    if (!listing.price) {
      minPrice = 0;
      maxPrice = 0;
    } else {
      // Вычисляем диапазон цен: ±25% от текущей цены
      const price = Number(listing.price);
      minPrice = price * 0.75; // 25% меньше
      maxPrice = price * 1.25; // 25% больше
    }

    // Формируем условия поиска с учётом трёх уровней категорий
    // Приоритет: subsubcategoryId → subcategoryId → categoryId
    const baseWhere = {
      // Исключаем текущее объявление
      id: {
        not: listingId,
      },
      status: ListingStatus.PUBLISHED,
    };

    // Определяем фильтр по категории с приоритетом
    let categoryFilter = {};
    if (listing.subsubcategoryId) {
      // Если есть subsubcategory — ищем по ней (самый точный уровень)
      categoryFilter = { subsubcategoryId: listing.subsubcategoryId };
    } else if (listing.subcategoryId) {
      // Иначе ищем по subcategory
      categoryFilter = { subcategoryId: listing.subcategoryId };
    } else if (listing.categoryId) {
      // Иначе ищем по category
      categoryFilter = { categoryId: listing.categoryId };
    }

    // Добавляем фильтр по цене только если она существует
    let priceFilter = {};
    if (listing.price) {
      priceFilter = {
        price: {
          gte: minPrice,
          lte: maxPrice,
        },
      };
    }

    const whereCondition = {
      ...baseWhere,
      ...categoryFilter,
      ...priceFilter,
    };

    const listings = await prisma.listing.findMany({
      where: whereCondition,
      take: query.limit,
      skip: query.offset,
      include: {
        category: true,
        subcategory: true,
        subsubcategory: true,
        currency: true,
        priceUnit: true,
        files: true,
        locations: true,
        specifications: true,
        user: {
          select: {
            id: true,
            name: true,
            files: {
              where: { kind: 'AVATAR' },
              select: { url: true },
            },
            profile: {
              select: {
                legalEntityType: {
                  select: {
                    id: true,
                    data: true,
                  },
                },
              },
            },
          },
        },
        listingSlot: {
          include: {
            userSlot: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Загружаем контакты для всех объявлений (batch запросы)
    const contactDataMap = await this.getContactsForListings(listings);

    // Загружаем promo данные для всех пользователей (batch запрос)
    const promoDataMap = await this.getPromoDataForUsers(listings);

    return listings.map((listing) =>
      ListingMapper.toResponse(
        listing,
        contactDataMap.get(listing.id) || null,
        promoDataMap.get(listing.userId) || null,
      ),
    );
  }

  async makeComplaintToListing(
    userId: string,
    body: MakeComplaintToListing,
  ): Promise<CreateListingComplaintResponseDto> {
    const hasComplaint = await prisma.complaint.findFirst({
      where: {
        authorId: userId,
        listingId: body.listingId,
        complaintType: ComplaintType.LISTING,
      },
    });

    if (hasComplaint) {
      throw new ConflictException('Вы уже подали жалобу на это объявление');
    }

    return await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      // Создаем жалобу
      const createdComplaint = await tx.complaint.create({
        data: {
          type: body.type,
          text: body.text,
          complaintType: ComplaintType.LISTING,
          authorId: userId,
          listingId: body.listingId,
        },
        select: {
          id: true,
        },
      });

      // Создаем фото если указаны
      if (body.photos && body.photos.length > 0) {
        // Сначала создаем записи в БД с base64 данными
        const photoRecords = body.photos.map((photoData, index) => {
          const fileName = this.s3Service.generateFileNameFromBase64(
            photoData,
            index,
            'photo',
          );
          const s3Key = this.s3Service.generateComplaintPhotoKey(
            createdComplaint.id,
            index,
          );
          const contentType =
            this.s3Service.getContentTypeFromBase64(photoData);
          const fileSize = this.s3Service.getFileSizeFromBase64(photoData);

          return {
            ownerType: FileOwnerType.COMPLAINT,
            complaintId: createdComplaint.id,
            url: photoData, // Пока храним base64
            fileType: contentType,
            fileName,
            fileSize,
            kind: FileKind.PHOTO,
            sortOrder: index,
            s3Key,
            s3Bucket: '', // Будет заполнено после загрузки в S3
            uploadStatus: 'pending', // Статус ожидания загрузки
          };
        });

        // Сохраняем фото в БД
        await tx.file.createMany({
          data: photoRecords,
        });

        // Отправляем задачи в RabbitMQ для асинхронной загрузки в S3
        await Promise.all(
          body.photos.map(async (photoData, index) => {
            const photoRecord = photoRecords[index];
            return this.rabbitmqService.sendFileUpload({
              complaintId: createdComplaint.id,
              fileType: 'photo',
              fileIndex: index,
              fileData: photoData,
              fileName: photoRecord.fileName,
              contentType: photoRecord.fileType,
              fileSize: photoRecord.fileSize,
              s3Key: photoRecord.s3Key,
            });
          }),
        );
      }

      return new CreateListingComplaintResponseDto(createdComplaint.id);
    });
  }

  /**
   * Поиск объявлений через Elasticsearch
   */
  async searchListings(query: ListingQueryDto) {
    const startTime = Date.now();
    const {
      limit = 20,
      offset = 0,
      search,
      status,
      condition,
      minPrice,
      maxPrice,
      categoryId,
      subcategoryId,
    } = query;

    this.logger.log(
      `🔍 Search request: ${JSON.stringify({ search, status, condition, minPrice, maxPrice, categoryId, subcategoryId, limit, offset })}`,
    );

    // Если нет поискового запроса, используем обычный поиск из БД
    if (!search) {
      this.logger.log('📄 No search query provided, using database search');
      return await this.listingList(query);
    }

    try {
      this.logger.log(`🚀 Starting Elasticsearch search for: "${search}"`);

      // Строим Elasticsearch query
      const esQuery: any = {
        query: {
          bool: {
            must: [],
            filter: [],
          },
        },
        from: offset,
        size: limit,
        sort: [{ createdAt: { order: 'desc' } }, { _score: { order: 'desc' } }],
      };

      // Добавляем полнотекстовый поиск
      if (search) {
        esQuery.query.bool.must.push({
          multi_match: {
            query: search,
            fields: ['title^3', 'description^2', 'category.name^1.5'],
            type: 'best_fields',
            fuzziness: 'AUTO',
            operator: 'and',
          },
        });
        this.logger.log(
          `📝 Multi-match query configured for fields: title^3, description^2, category.name^1.5`,
        );
      }

      // Добавляем фильтры
      if (status) {
        esQuery.query.bool.filter.push({
          term: { 'status.keyword': status },
        });
        this.logger.log(`🎯 Status filter applied: ${status}`);
      }

      if (subcategoryId) {
        esQuery.query.bool.filter.push({
          term: { subcategoryId: subcategoryId },
        });
        this.logger.log(`🎯 Subcategory filter applied: ${subcategoryId}`);
      } else if (categoryId) {
        esQuery.query.bool.filter.push({
          term: { subcategoryId: categoryId },
        });
        this.logger.log(`🎯 Category filter applied: ${categoryId}`);
      }

      // Фильтр по цене
      if (minPrice || maxPrice) {
        const priceRange: any = {};
        if (minPrice) priceRange.gte = minPrice;
        if (maxPrice) priceRange.lte = maxPrice;

        esQuery.query.bool.filter.push({
          range: { price: priceRange },
        });
        this.logger.log(
          `💰 Price filter applied: ${JSON.stringify(priceRange)}`,
        );
      }

      // Если нет must условий, но есть поиск, заменяем на match_all
      if (esQuery.query.bool.must.length === 0 && search) {
        esQuery.query.bool.must.push({ match_all: {} });
      }

      this.logger.log(`🔍 Elasticsearch query: ${JSON.stringify(esQuery)}`);

      // Выполняем поиск в Elasticsearch
      const esStartTime = Date.now();
      const result = await this.searchService.search<ListingDocument>(
        'listings',
        esQuery,
      );
      const esDuration = Date.now() - esStartTime;

      this.logger.log(
        `⚡ Elasticsearch search completed in ${esDuration}ms, found ${result.hits.total.value} documents`,
      );

      // Получаем ID найденных документов
      const listingIds = result.hits.hits.map((hit) => hit._source.id);

      if (!listingIds.length) {
        const totalDuration = Date.now() - startTime;
        this.logger.log(`📭 No results found in ${totalDuration}ms`);

        return {
          rows: [],
          pagination: {
            total: 0,
            limit,
            offset,
            hasMore: false,
          },
        };
      }

      this.logger.log(
        `📋 Found ${listingIds.length} listing IDs: ${listingIds.slice(0, 5).join(', ')}${listingIds.length > 5 ? '...' : ''}`,
      );

      // Получаем полные данные из Prisma для найденных ID с сортировкой
      const dbStartTime = Date.now();
      const listings = await prisma.listing.findMany({
        where: {
          id: { in: listingIds },
        },
        include: {
          category: true,
          subcategory: true,
          subsubcategory: true,
          currency: true,
          priceUnit: true,
          files: true,
          locations: true,
          specifications: true,
          user: {
            select: {
              id: true,
              name: true,
              files: {
                where: { kind: 'AVATAR' },
                select: { url: true },
              },
              profile: {
                select: {
                  legalEntityType: {
                    select: {
                      id: true,
                      data: true,
                    },
                  },
                },
              },
            },
          },
          listingSlot: {
            include: {
              userSlot: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
      const dbDuration = Date.now() - dbStartTime;

      this.logger.log(
        `🗄️ Database query completed in ${dbDuration}ms, retrieved ${listings.length} full listings`,
      );

      // Разделяем файлы на фотографии и документы и мапим через ListingMapper
      const processedListings = await Promise.all(
        listings.map(async (listing: any) => {
          // Разделяем файлы
          const listingWithSeparatedFiles = {
            ...listing,
            photos: listing.files.filter(
              (file: any) => file.kind === FileKind.PHOTO,
            ),
            files: listing.files.filter(
              (file: any) => file.kind === FileKind.DOCUMENT,
            ),
          };

          // Получаем данные контакта и подписки как в listingById
          const contactData = await this.getContactData(
            listing.contactId,
            listing.contactType,
          );
          const promoData = await this.getPromoData(listing.userId);

          return ListingMapper.toResponse(
            listingWithSeparatedFiles,
            contactData,
            promoData,
          );
        }),
      );

      const totalDuration = Date.now() - startTime;
      this.logger.log(
        `✅ Search completed successfully in ${totalDuration}ms (ES: ${esDuration}ms, DB: ${dbDuration}ms)`,
      );

      return {
        rows: processedListings,
        pagination: {
          total: result.hits.total.value,
          limit,
          offset,
          hasMore: offset + limit < result.hits.total.value,
        },
      };
    } catch (error) {
      const totalDuration = Date.now() - startTime;
      this.logger.error(
        `❌ Elasticsearch search error after ${totalDuration}ms:`,
        error,
      );

      // В случае ошибки Elasticsearch, fallback к обычному поиску в БД
      this.logger.warn(
        '🔄 Falling back to database search due to Elasticsearch error',
      );
      return await this.listingList(query);
    }
  }

  async listingList(query: ListingQueryDto) {
    const {
      limit = 20,
      offset = 0,
      status,
      condition,
      search,
      categoryId,
      subcategoryId,
    } = query;

    // Создаем условия фильтрации
    const where: any = {};

    if (status) {
      where.status = status;
    }

    if (condition) {
      where.condition = condition;
    }

    // Приоритет subcategoryId над categoryId
    if (subcategoryId) {
      where.subcategoryId = subcategoryId;
    } else if (categoryId) {
      where.subcategoryId = categoryId;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Получаем общее количество записей для пагинации
    const total = await prisma.listing.count({ where });

    // Получаем объявления с пагинацией и фильтрацией
    const listings = await prisma.listing.findMany({
      where,
      include: {
        category: true,
        currency: true,
        priceUnit: true,
        files: true,
        locations: true,
        specifications: {
          include: {
            specification: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            files: {
              where: { kind: 'AVATAR' },
              select: { url: true },
            },
            profile: {
              select: {
                legalEntityType: {
                  select: {
                    id: true,
                    data: true,
                  },
                },
              },
            },
          },
        },
        listingSlot: {
          include: {
            userSlot: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
      skip: offset,
    });

    // Разделяем файлы на фотографии и документы и мапим через ListingMapper
    const processedListings = await Promise.all(
      listings.map(async (listing: any) => {
        const listingWithSeparatedFiles = {
          ...listing,
          photos: listing.files.filter(
            (file: any) => file.kind === FileKind.PHOTO,
          ),
          files: listing.files.filter(
            (file: any) => file.kind === FileKind.DOCUMENT,
          ),
        };

        // Получаем данные контакта и подписки как в listingById
        const contactData = await this.getContactData(
          listing.contactId,
          listing.contactType,
        );
        const promoData = await this.getPromoData(listing.userId);

        return ListingMapper.toResponse(
          listingWithSeparatedFiles,
          contactData,
          promoData,
        );
      }),
    );

    return {
      rows: processedListings,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
    };
  }

  async changeListingStatus(
    userId: string,
    body: ChangeListingStatusDto,
  ): Promise<ChangeStatusResponseDto> {
    const { listingId, status } = body;

    const checkIfListingExist = await prisma.listing.findFirst({
      where: {
        id: listingId,
        userId, // Добавляем проверку владельца
      },
    });

    if (!checkIfListingExist) {
      throw new BadRequestException(`Объявление с id: ${listingId} не найдено`);
    }

    const result = await prisma.$transaction(
      async (tx: Prisma.TransactionClient) => {
        let updatedListing: any;

        // проверка активных объявлений для PUBLISHED
        if (status === ListingStatus.PUBLISHED) {
          const availableSlots =
            await this.subscriptionService.getUserAvailableSlots(userId);
          this.logger.log(`Доступных слотов: ${availableSlots.length}`);

          if (availableSlots.length === 0) {
            throw new BadRequestException(
              'Нет доступных слотов для создания объявления',
            );
          }

          // Обновляем статус объявления
          updatedListing = await tx.listing.update({
            where: { id: listingId },
            data: {
              status: status,
              publishedAt: new Date(),
              autoDeleteAt: null,
              archivedAt: null,
            },
          });

          // Создаем связь объявления со слотом
          await tx.listingSlot.create({
            data: {
              listingId,
              userSlotId: availableSlots[0].id,
              assignedAt: new Date(),
            },
          });

          return new ChangeStatusResponseDto(
            updatedListing.id,
            updatedListing.status,
            updatedListing.publishedAt,
            updatedListing.archivedAt,
            updatedListing.autoDeleteAt,
          );
        }

        // если статус НЕ PUBLISHED, то освобождаем слоты
        if (checkIfListingExist.status === ListingStatus.PUBLISHED) {
          await tx.listingSlot.delete({
            where: {
              listingId,
            },
          });
          this.logger.log(`Освобожден слот для объявления ${listingId}`);
        }

        // Обработка ARCHIVED
        if (status === ListingStatus.ARCHIVED) {
          updatedListing = await tx.listing.update({
            where: { id: listingId },
            data: {
              status,
              archivedAt: new Date(),
              autoDeleteAt: this.calculateAutoDeleteDate(),
              publishedAt: null,
            },
          });
        }
        // Остальные статусы (DRAFT, TEMPLATE)
        else {
          updatedListing = await tx.listing.update({
            where: { id: listingId },
            data: {
              status: status,
              publishedAt: null,
              archivedAt: null,
              autoDeleteAt: null,
            },
          });
        }

        return new ChangeStatusResponseDto(
          updatedListing.id,
          updatedListing.status,
          updatedListing.publishedAt,
          updatedListing.archivedAt,
          updatedListing.autoDeleteAt,
        );
      },
    );

    // Проверяем условия акции после изменения статуса (асинхронно)
    this.promoParticipantService.checkUserConditions(userId).catch((err) => {
      this.logger.warn(
        `Failed to check promo conditions after status change: ${err.message}`,
      );
    });

    return result;
  }

  async bulkRestore(userId: string): Promise<BulkRestoreResponseDto> {
    const [archivedListings, availableSlots] = await Promise.all([
      // получаем все архивные объявления
      prisma.listing.findMany({
        where: {
          userId,
          status: ListingStatus.ARCHIVED,
        },
        select: {
          id: true,
        },
      }),
      // получаем свободные слоты
      this.subscriptionService.getUserAvailableSlots(userId),
    ]);

    this.logger.log(
      `Пользователь ${userId}: архивных=${archivedListings.length}, слотов=${availableSlots.length}`,
    );

    if (archivedListings.length === 0) {
      throw new BadRequestException(
        'Нет архивированных объявлений для восстановления',
      );
    }

    // Проверяем, что свободных слотов хватит для всех архивированных объявлений
    if (availableSlots.length === 0) {
      throw new BadRequestException(
        'Нет доступных слотов для создания объявления',
      );
    }

    if (archivedListings.length > availableSlots.length) {
      throw new BadRequestException(
        `Не хватает доступных слотов: ${availableSlots.length} для перемещения объявлений из архива: ${archivedListings.length}`,
      );
    }

    // изменение статуса у объявлений и создание слотов для перемещенных объявлений
    const listingIds = archivedListings.map((l) => l.id);
    const now = new Date();

    const result = await prisma.$transaction(
      async (tx: Prisma.TransactionClient) => {
        const updateResult = await tx.listing.updateMany({
          where: {
            id: {
              in: listingIds,
            },
            userId,
            status: ListingStatus.ARCHIVED,
          },
          data: {
            status: ListingStatus.PUBLISHED,
            publishedAt: now,
            archivedAt: null,
            autoDeleteAt: null,
          },
        });

        // Создаем связи со слотами
        const slotData = archivedListings.map((listing, index) => ({
          listingId: listing.id,
          userSlotId: availableSlots[index].id,
          assignedAt: now,
        }));

        await tx.listingSlot.createMany({
          data: slotData,
          skipDuplicates: true,
        });

        return {
          restored: updateResult.count,
          slotsUsed: archivedListings.length,
        };
      },
      {
        maxWait: 5000,
        timeout: 10000,
        // isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
        isolationLevel: TransactionIsolationLevel.Serializable,
      },
    );

    this.logger.log(
      `Восстановлено ${result.restored} объявлений для пользователя ${userId}`,
    );

    return result;
  }

  async hasListing(id: string, status: StatusQueryDto): Promise<boolean> {
    const cacheKey = `listings:${id}`;
    const cachedListing = await this.cacheSevice.get(cacheKey);
    if (cachedListing) return !!cachedListing;

    const listing = await prisma.listing.findFirst({
      where: { id, status: status.status },
    });

    return !!listing;
  }

  async listingById(
    id: string,
    status: StatusQueryDto,
    userId?: string,
  ): Promise<ListingResposeDto> {
    // const cachedKey = `listings:${id}`;
    // const cachedListing = await this.cacheSevice.get(cachedKey);
    // if (cachedListing) return cachedListing;

    this.logger.log(
      `Listing ID: ${id}, Status: ${status.status}, UserID: ${userId || 'undefined (anonymous)'}`,
    );
    const listing = await prisma.listing.findFirst({
      where: { id, status: status.status },
      include: {
        category: true,
        subcategory: true,
        subsubcategory: true,
        currency: true,
        priceUnit: true,
        files: true,
        locations: true,
        specifications: {
          include: {
            specification: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            files: {
              where: { kind: 'AVATAR' },
              select: { url: true },
            },
            profile: {
              select: {
                legalEntityType: {
                  select: {
                    id: true,
                    data: true,
                  }
                }
              }
            }
          },
        },
        listingSlot: {
          include: {
            userSlot: true,
          },
        },
      },
    });

    if (!listing) {
      throw new NotFoundException(
        `Listing with id ${id} and status ${status?.status || 'any'} not found`,
      );
    }

    // Получаем данные контакта если указаны
    const contactData = await this.getContactData(
      listing.contactId,
      listing.contactType,
    );

    // Получаем данные о подписке пользователя
    const promoData = await this.getPromoData(listing.userId);

    // Проверяем, добавлено ли объявление в избранное (если userId предоставлен)
    let isFavorite = false;
    let isUserFavorite = false;
    let note
    // Определяем, является ли объявление собственностью текущего пользователя
    const mine = userId ? listing.userId === userId : false;
    if (userId) {
      const favorite = await prisma.favorite.findFirst({
        where: {
          userId,
          listingId: id,
        },
      });
      isFavorite = !!favorite;

      // Проверяем, находится ли владелец объявления в избранном пользователя
      const userFavorite = await prisma.favorite.findFirst({
        where: {
          userId,
          targetUserId: listing.userId,
          type: 'USER',
        },
      });
      isUserFavorite = !!userFavorite;

      // Получаем заметку пользователя об объявлении
      this.logger.log(`[DEBUG] Looking for note: authorId=${userId}, targetListingId=${id}`);
      const userNote = await prisma.userNote.findFirst({
        where: {
          authorId: userId,
          targetType: 'LISTING',
          targetListingId: id,
        },
      });
      this.logger.log(`[DEBUG] Found note: ${userNote ? userNote.id : 'null'}`);
      note = userNote
        ? ListingMapper.buildNoteEmbeddedDto(userNote.id, NoteTargetType.LISTING, id)
        : null;
    }

    return ListingMapper.toResponse(
      listing,
      contactData,
      promoData,
      isFavorite,
      note,
      isUserFavorite,
      mine,
    );
  }

  async listingsByUserId(userId: string): Promise<ListingResposeDto[]> {
    // const cacheKey = `listings:userId:${userId}`;
    // const cachedListings = await this.cacheSevice.get<ListingResposeDto[]>(cacheKey);
    // if (cachedListings) return cachedListings;

    this.logger.log(`User ID: ${userId}`);

    const listings = await prisma.listing.findMany({
      where: { userId },
      include: {
        category: true,
        subcategory: true,
        subsubcategory: true,
        currency: true,
        priceUnit: true,
        files: true,
        locations: true,
        specifications: {
          include: {
            specification: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            files: {
              where: { kind: 'AVATAR' },
              select: { url: true },
            },
            profile: {
              select: {
                legalEntityType: {
                  select: {
                    id: true,
                    data: true,
                  },
                },
              },
            },
          },
        },
        listingSlot: {
          include: {
            userSlot: true,
          },
        },
      },
    });

    // Загружаем контакты для всех объявлений (batch запросы)
    const contactDataMap = await this.getContactsForListings(listings);

    return listings.map((listing) =>
      ListingMapper.toResponse(listing, contactDataMap.get(listing.id) || null),
    );
  }

  async createListing(
    userId: string,
    body: CreateListingDto,
  ): Promise<CreateListingResponseDto> {
    // Проверка текста
    if (body.title) this.validateText(body.title);
    if (body.description) this.validateText(body.description);

    const { maps, photos, files, specifications, ...listing } = body;

    // Проверки справочников
    if (listing.categoryId) {
      await this.categoriesService.checkCategoryById(listing.categoryId);
    }
    if (listing.subcategoryId) {
      await this.categoriesService.checkCategoryById(listing.subcategoryId);
    }
    if (listing.subsubcategoryId) {
      await this.categoriesService.checkCategoryById(listing.subsubcategoryId);
    }
    if (listing.currencyId) {
      await this.dictionariesService.chechCurrencyById(listing.currencyId);
    }
    if (listing.priceUnitId) {
      await this.dictionariesService.checkUnitMeasurement(listing.priceUnitId);
    }

    // Проверка существования specificationId если переданы спецификации
    if (specifications?.length) {
      const specIds = specifications.map((s) => s.specificationId);
      const existingSpecs = await prisma.specification.findMany({
        where: { id: { in: specIds } },
        select: { id: true },
      });
      const existingIds = new Set(existingSpecs.map((s) => s.id));
      const invalidIds = specIds.filter((id) => !existingIds.has(id));
      if (invalidIds.length) {
        throw new BadRequestException(
          `Характеристики с ID [${invalidIds.join(', ')}] не найдены`,
        );
      }
    }

    const createdListing = await prisma.$transaction(
      async (tx: Prisma.TransactionClient) => {
        // Проверка слотов при публикации
        if (listing.status === ListingStatus.PUBLISHED) {
          const availableSlots =
            await this.subscriptionService.getUserAvailableSlots(userId);
          if (availableSlots.length === 0) {
            throw new BadRequestException(
              'Нет доступных слотов для создания объявления',
            );
          }
        }

        // Создаём объявление
        const newListing = await this.createListingByStatus(userId, listing);

        // Привязка слота
        if (listing.status === ListingStatus.PUBLISHED) {
          const availableSlots =
            await this.subscriptionService.getUserAvailableSlots(userId);
          await tx.listingSlot.create({
            data: {
              listingId: newListing.id,
              userSlotId: availableSlots[0].id,
              assignedAt: new Date(),
            },
          });
        }

        // Геолокации
        if (maps?.length) {
          await this.mapLocationsService.createMapLocationsForListing(
            tx,
            maps,
            newListing.id,
          );
        }

        // Файлы (DOCUMENT)
        const createdFiles = files?.length
          ? await this.fileService.replaceListingFilesArray(
              newListing.id,
              files,
              FileKind.DOCUMENT,
              tx,
            )
          : [];

        // Фото (PHOTO)
        const createdPhotos = photos?.length
          ? await this.fileService.replaceListingFilesArray(
              newListing.id,
              photos,
              FileKind.PHOTO,
              tx,
            )
          : [];

        // Спецификации (характеристики)
        if (specifications?.length) {
          await tx.listingSpecification.createMany({
            data: specifications.map((spec) => ({
              listingId: newListing.id,
              specificationId: spec.specificationId,
              value: spec.value,
            })),
          });
        }

        return {
          listing: newListing,
          createdFiles,
          createdPhotos,
        };
      },
    );

    // ВНЕ транзакции — асинхронная загрузка в S3
    await Promise.all([
      this.fileService.enqueueFilesUpload(createdListing.createdFiles),
      this.fileService.enqueueFilesUpload(createdListing.createdPhotos),
    ]);

    // Инвалидируем кэш
    await this.cacheSevice.del('listings');

    // Индексация в Elasticsearch
    await this.indexListingInElasticsearch(createdListing.listing);

    // Проверяем условия акции для пользователя (10 активных объявлений)
    // Запускаем асинхронно, чтобы не блокировать ответ
    this.promoParticipantService.checkUserConditions(userId).catch((err) => {
      this.logger.warn(
        `Failed to check promo conditions for user ${userId}: ${err.message}`,
      );
    });

    return createdListing.listing;
  }

  async archiveListingByIdWithReason(
    listingId: string,
    reason: string,
  ): Promise<{ message: string }> {
    await prisma.listing.update({
      where: { id: listingId },
      data: {
        status: ListingStatus.ARCHIVED,
        archivedAt: new Date(),
        autoDeleteAt: this.calculateAutoDeleteDate(),
        archivedReason: reason,
      },
    });

    // Освобождаем слот
    await prisma.listingSlot.delete({
      where: {
        listingId,
      },
    });

    // Инвалидируем кэш
    await this.cacheSevice.del('listings');

    // Удаляем из Elasticsearch
    // await this.searchService.deleteDocument('listings', listingId);
    return {
      message: `Объявление ${listingId} было перемещено в архив по причине: ${reason}`,
    };
  }

  async editListingById(
    id: string,
    user: JwtPayload,
    body: UpdateListingDto,
  ): Promise<ListingResposeDto> {
    // Проверка текста
    if (body.title) this.validateText(body.title);
    if (body.description) this.validateText(body.description);

    const {
      maps,
      photos,
      files,
      specifications,
      status,
      contacts,
      ...listingData
    } = body;

    // Проверяем существование объявления и права доступа
    const existingListing = await prisma.listing.findFirst({
      where: { id, userId: user.id },
    });

    if (!existingListing) {
      throw new NotFoundException(
        `Объявление с id ${id} не найдено или у вас нет прав на его редактирование`,
      );
    }

    // Проверка существования specificationId если переданы спецификации
    if (specifications?.length) {
      const specIds = specifications.map((s) => s.specificationId);
      const existingSpecs = await prisma.specification.findMany({
        where: { id: { in: specIds } },
        select: { id: true },
      });
      const existingIds = new Set(existingSpecs.map((s) => s.id));
      const invalidIds = specIds.filter((id) => !existingIds.has(id));
      if (invalidIds.length) {
        throw new BadRequestException(
          `Характеристики с ID [${invalidIds.join(', ')}] не найдены`,
        );
      }
    }

    const updatedListing = await prisma.$transaction(
      async (tx: Prisma.TransactionClient) => {
        // Формируем данные для обновления
        const updateData: any = {};
        if (listingData.categoryId !== undefined)
          updateData.categoryId = listingData.categoryId;
        if (listingData.subcategoryId !== undefined)
          updateData.subcategoryId = listingData.subcategoryId;
        if (listingData.subsubcategoryId !== undefined)
          updateData.subsubcategoryId = listingData.subsubcategoryId;
        if (listingData.title !== undefined)
          updateData.title = listingData.title;
        if (listingData.description !== undefined)
          updateData.description = listingData.description;
        if (listingData.price !== undefined)
          updateData.price = new Decimal(listingData.price);
        if (listingData.currencyId !== undefined)
          updateData.currencyId = listingData.currencyId;
        if (listingData.priceUnitId !== undefined)
          updateData.priceUnitId = listingData.priceUnitId;
        if (listingData.condition !== undefined)
          updateData.condition = listingData.condition;
        if (status !== undefined) updateData.status = status;

        // Обновляем основные поля объявления
        const updated = await tx.listing.update({
          where: { id },
          data: updateData,
          include: {
            category: true,
            subcategory: true,
            subsubcategory: true,
            currency: true,
            priceUnit: true,
            files: true,
            locations: true,
            specifications: true,
            user: {
              select: {
                id: true,
                name: true,
                files: {
                  where: { kind: 'AVATAR' },
                  select: { url: true },
                },
              },
            },
            listingSlot: {
              include: {
                userSlot: true,
              },
            },
          },
        });

        // Обновляем геолокации если переданы
        if (maps !== undefined) {
          // Удаляем старые
          await tx.mapLocation.deleteMany({
            where: { listingId: id },
          });
          // Создаем новые
          if (maps.length) {
            await this.mapLocationsService.createMapLocationsForListing(
              tx,
              maps,
              id,
            );
          }
        }

        // Обновляем файлы если переданы
        if (files !== undefined) {
          await this.fileService.replaceListingFilesArray(
            id,
            files,
            FileKind.DOCUMENT,
            tx,
          );
        }

        // Обновляем фото если переданы
        if (photos !== undefined) {
          await this.fileService.replaceListingFilesArray(
            id,
            photos,
            FileKind.PHOTO,
            tx,
          );
        }

        // Обновляем спецификации если переданы
        if (specifications !== undefined) {
          // Удаляем старые
          await tx.listingSpecification.deleteMany({
            where: { listingId: id },
          });
          // Создаем новые
          if (specifications.length) {
            await tx.listingSpecification.createMany({
              data: specifications.map((spec) => ({
                listingId: id,
                specificationId: spec.specificationId,
                value: spec.value,
              })),
            });
          }
        }

        return updated;
      },
    );

    // Инвалидируем кэш
    await this.cacheSevice.del('listings');
    await this.cacheSevice.del(`listings:${id}`);

    // Обновляем в Elasticsearch
    await this.indexListingInElasticsearch(updatedListing);

    // Получаем данные контакта
    const contactData = await this.getContactData(
      updatedListing.contactId,
      updatedListing.contactType,
    );

    // Получаем данные о подписке
    const promoData = await this.getPromoData(updatedListing.userId);

    return ListingMapper.toResponse(updatedListing, contactData, promoData);
  }

  async createListingByStatus(userId: string, listing: IListing) {
    let status: ListingStatus;

    if (listing.status === ListingStatus.TEMPLATE) {
      status = ListingStatus.TEMPLATE;
    } else if (listing.status === ListingStatus.PUBLISHED) {
      status = ListingStatus.PUBLISHED;
    } else if (listing.status === ListingStatus.ARCHIVED) {
      status = ListingStatus.ARCHIVED;
    } else {
      status = ListingStatus.DRAFT; // default
    }

    // проверяем, есть ли у пользователя уже созданных 10 штук(шаблоны, черновики)
    if (status === ListingStatus.TEMPLATE) {
      const existingCount = await prisma.listing.count({
        where: {
          userId,
          status: ListingStatus.TEMPLATE,
        },
      });

      if (existingCount >= 10) {
        throw new ConflictException(
          `У пользователя уже ${existingCount} шаблонов (максимум 10)`,
        );
      }
    }

    if (status === ListingStatus.DRAFT) {
      const existingCount = await prisma.listing.count({
        where: {
          userId,
          status: ListingStatus.DRAFT,
        },
      });

      if (existingCount >= 10) {
        throw new ConflictException(
          `У пользователя уже ${existingCount} черновиков (максимум 10)`,
        );
      }
    }

    const {
      subcategoryId,
      categoryId,
      subsubcategoryId,
      contacts,
      ...listingData
    } = listing;

    return prisma.listing.create({
      data: {
        ...listingData,
        subcategoryId: subcategoryId ?? null,
        categoryId: categoryId ?? null,
        subsubcategoryId: subsubcategoryId ?? null,
        contactId: contacts?.id ?? null,
        contactType: contacts?.type ?? null,
        status,
        price: listing.price ? new Decimal(listing.price) : null,
        userId,
        ...(status === ListingStatus.ARCHIVED && {
          archivedAt: new Date(),
          autoDeleteAt: this.calculateAutoDeleteDate(),
        }),
      },
    });
  }

  async deleteListingById(
    id: string,
    user: JwtPayload,
    status: StatusQueryDto,
  ) {
    this.logger.log(
      `Удаление объявления с параметрами id: ${id}, user: ${user}, status: ${status.status}`,
    );
    const cacheKey = 'listings';
    const cackeKeyId = `listings:${id}`;
    const hasListing = await this.listingById(id, status);
    if (!hasListing) {
      throw new NotFoundException(`Объявление с id: ${id} не найдено`);
    }
    const deleted = await prisma.listing.delete({
      where: {
        id,
        status: status.status,
      },
    });

    if (deleted) {
      await this.cacheSevice.del(cacheKey);
      await this.cacheSevice.del(cackeKeyId);

      // Проверяем условия акции после удаления (может повлиять на 10 активных объявлений)
      this.promoParticipantService.checkUserConditions(user.id).catch((err) => {
        this.logger.warn(
          `Failed to check promo conditions after delete: ${err.message}`,
        );
      });
    }

    return deleted;
  }

  /**
   * Индексация объявления в Elasticsearch
   */
  private async indexListingInElasticsearch(listing: any) {
    try {
      // Получаем связанные данные для полноты индекса
      const listingWithRelations = await prisma.listing.findUnique({
        where: { id: listing.id },
        include: {
          category: true,
          currency: true,
          priceUnit: true,
          locations: true,
          specifications: true,
        },
      });

      if (!listingWithRelations) {
        this.logger.error(`Listing not found for indexing: ${listing.id}`);
        return;
      }

      // Получаем данные контакта для индексации
      const contactData = await this.getContactData(
        listingWithRelations.contactId,
        listingWithRelations.contactType,
      );

      // Преобразуем данные для Elasticsearch
      const document: ListingDocument = {
        ...listingWithRelations,
        categoryId: listingWithRelations.categoryId ?? null,
        subcategoryId: listingWithRelations.subcategoryId ?? null,
        subsubcategoryId: listingWithRelations.subsubcategoryId ?? null,
        price: listingWithRelations.price
          ? Number(listingWithRelations.price)
          : null,
        rating: listingWithRelations.rating
          ? Number(listingWithRelations.rating)
          : null,
        locations: listingWithRelations.locations.map((loc: any) => ({
          ...loc,
          latitude: Number(loc.latitude),
          longitude: Number(loc.longitude),
        })),
        contacts:
          listingWithRelations.contactId && listingWithRelations.contactType
            ? {
                id: listingWithRelations.contactId,
                phone: contactData?.phone ?? null,
                email: contactData?.email ?? null,
                type: listingWithRelations.contactType,
              }
            : null,
      };

      // Индексируем в Elasticsearch
      await this.searchService.indexDocument<ListingDocument>(
        'listings',
        listing.id,
        document,
      );

      this.logger.log(`Listing indexed in Elasticsearch: ${listing.id}`);
    } catch (error) {
      this.logger.error(`Error indexing listing ${listing.id}:`, error);
      // Не прерываем создание объявления из-за ошибки индексации
    }
  }

  /**
   * Проверяет текст на наличие запрещенных слов
   * @param text Текст для проверки
   * @throws BadRequestException если найдены запрещенные слова
   */
  private validateText(text: string): void {
    if (!text) return;

    const lowerText = text.toLowerCase();
    const foundWords: string[] = [];

    // Проверка простых слов
    for (const word of FORBIDDEN_WORDS) {
      if (lowerText.includes(word)) {
        foundWords.push(word);
      }
    }

    // Если найдены запрещенные слова, выбрасываем ошибку
    if (foundWords.length > 0) {
      throw new BadRequestException(
        `Объявление содержит запрещенные слова: ${foundWords.join(', ')}. Пожалуйста, удалите их и попробуйте снова.`,
      );
    }
  }

  private calculateAutoDeleteDate(): Date {
    return new Date(
      Date.now() + this.ARCHIVE_AUTO_DELETE_DAYS * 24 * 60 * 60 * 1000,
    );
  }

  /**
   * Получает данные контакта (phone, email) для объявления
   * @param contactId ID контакта
   * @param contactType тип контакта (USER или WORKER)
   * @returns Объект с phone и email или null
   */
  private async getContactData(
    contactId: string | null,
    contactType: string | null,
  ): Promise<{ phone: string | null; email: string | null } | null> {
    if (!contactId || !contactType) {
      return null;
    }

    try {
      if (contactType === 'WORKER') {
        const worker = await prisma.worker.findUnique({
          where: { id: contactId },
          select: { phone: true, email: true },
        });
        if (worker) {
          return { phone: worker.phone, email: worker.email };
        }
      } else if (contactType === 'USER') {
        const user = await prisma.user.findUnique({
          where: { id: contactId },
          include: { profile: { select: { phone: true } } },
        });
        if (user) {
          return {
            phone: user.profile?.phone || null,
            email: user.email,
          };
        }
      }
    } catch (error) {
      this.logger.error(
        `Error fetching contact data for ${contactType} ${contactId}:`,
        error,
      );
    }

    return null;
  }

  /**
   * Получает данные о Promo кампании пользователя
   * @param userId ID пользователя
   * @returns Объект с датой начала подписки и датой окончания акции
   */
  private async getPromoData(
    userId: string,
  ): Promise<{
    subscriptionStartDate: Date | null;
    promoEndDate: Date | null;
  }> {
    try {
      const promoParticipant = await prisma.promoCampaignParticipant.findFirst({
        where: { userId },
        orderBy: { joinedAt: 'desc' },
        include: {
          campaign: {
            select: { endAt: true },
          },
        },
      });

      if (promoParticipant) {
        return {
          subscriptionStartDate: promoParticipant.joinedAt,
          promoEndDate: promoParticipant.campaign?.endAt || null,
        };
      }
    } catch (error) {
      this.logger.error(`Error fetching promo data for user ${userId}:`, error);
    }

    return { subscriptionStartDate: null, promoEndDate: null };
  }

  /**
   * Batch-загрузка promo данных для пользователей объявлений
   * @param listings Список объявлений
   * @returns Map с promo данными по ID пользователя
   */
  private async getPromoDataForUsers(
    listings: any[],
  ): Promise<
    Map<
      string,
      { subscriptionStartDate: Date | null; promoEndDate: Date | null }
    >
  > {
    const promoDataMap = new Map<
      string,
      { subscriptionStartDate: Date | null; promoEndDate: Date | null }
    >();

    // Собираем уникальные userId
    const userIds = [...new Set(listings.map((l) => l.userId).filter(Boolean))];

    if (userIds.length === 0) {
      return promoDataMap;
    }

    try {
      // Batch-запрос для всех promo участников
      const promoParticipants = await prisma.promoCampaignParticipant.findMany({
        where: {
          userId: { in: userIds },
        },
        orderBy: { joinedAt: 'desc' },
        distinct: ['userId'],
        include: {
          campaign: {
            select: { endAt: true },
          },
        },
      });

      for (const participant of promoParticipants) {
        promoDataMap.set(participant.userId, {
          subscriptionStartDate: participant.joinedAt,
          promoEndDate: participant.campaign?.endAt || null,
        });
      }
    } catch (error) {
      this.logger.error('Error batch fetching promo data:', error);
    }

    return promoDataMap;
  }

  /**
   * Batch-загрузка контактов для списка объявлений
   * @param listings Список объявлений
   * @returns Map с данными контактов по ID объявления
   */
  private async getContactsForListings(
    listings: any[],
  ): Promise<Map<string, { phone: string | null; email: string | null }>> {
    const contactDataMap = new Map<
      string,
      { phone: string | null; email: string | null }
    >();

    // Собираем уникальные ID контактов по типам
    const workerIds: string[] = [];
    const userIds: string[] = [];
    const listingContactMap = new Map<
      string,
      { contactId: string; contactType: string }
    >();

    for (const listing of listings) {
      if (listing.contactId && listing.contactType) {
        listingContactMap.set(listing.id, {
          contactId: listing.contactId,
          contactType: listing.contactType,
        });

        if (listing.contactType === 'WORKER') {
          workerIds.push(listing.contactId);
        } else if (listing.contactType === 'USER') {
          userIds.push(listing.contactId);
        }
      }
    }

    // Если нет контактов — возвращаем пустой Map
    if (workerIds.length === 0 && userIds.length === 0) {
      return contactDataMap;
    }

    // Batch-запрос для WORKER
    if (workerIds.length > 0) {
      try {
        const workers = await prisma.worker.findMany({
          where: { id: { in: workerIds } },
          select: { id: true, phone: true, email: true },
        });

        const workerMap = new Map(workers.map((w) => [w.id, w]));

        for (const [listingId, contactInfo] of listingContactMap) {
          if (contactInfo.contactType === 'WORKER') {
            const worker = workerMap.get(contactInfo.contactId);
            if (worker) {
              contactDataMap.set(listingId, {
                phone: worker.phone,
                email: worker.email,
              });
            }
          }
        }
      } catch (error) {
        this.logger.error('Error batch fetching workers:', error);
      }
    }

    // Batch-запрос для USER
    if (userIds.length > 0) {
      try {
        const users = await prisma.user.findMany({
          where: { id: { in: userIds } },
          include: { profile: { select: { phone: true } } },
        });

        const userMap = new Map(users.map((u) => [u.id, u]));

        for (const [listingId, contactInfo] of listingContactMap) {
          if (contactInfo.contactType === 'USER') {
            const user = userMap.get(contactInfo.contactId);
            if (user) {
              contactDataMap.set(listingId, {
                phone: user.profile?.phone || null,
                email: user.email,
              });
            }
          }
        }
      } catch (error) {
        this.logger.error('Error batch fetching users:', error);
      }
    }

    return contactDataMap;
  }
}
