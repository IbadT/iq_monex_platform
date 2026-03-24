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
import {
  ListingEntityWithFiles,
  ListingWhereCondition,
} from './entities/listing.entity';
import { FORBIDDEN_WORDS } from './forbidden-words/forbidden-words';
import { CategoriesService } from '@/categories/categories.service';
import { DictionariesService } from '@/dictionaries/dictionaries.service';
import { MapLocationsService } from '@/map_locations/map_locations.service';
import { IListing } from './interfaces/listing.interface';
import { PrismaClient } from 'prisma/generated/client';
import { ListingResposeDto } from './dto/response/listing-response.dto';
import { ListingMapper } from './mappers/listing.mapper';
import { CreateListingResponseDto } from './dto/response/create-listing-response.dto';
import { ChangeStatusResponseDto } from './dto/response/change-status-response.dto';
import { BulkRestoreResponseDto } from './dto/response/bulk-restore-response.dto';
import { CreateListingComplaintResponseDto } from './dto/response/create-listing-complaint-response.dto';

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

    const whereCondition: ListingWhereCondition = {
      // Исключаем текущее объявление
      id: {
        not: listingId,
      },
      status: ListingStatus.PUBLISHED,
      categoryId: listing.categoryId, // Та же категория
    };

    // Добавляем фильтр по цене только если она существует
    if (listing.price) {
      whereCondition.price = {
        gte: minPrice,
        lte: maxPrice,
      };
    }

    const listings = await prisma.listing.findMany({
      where: whereCondition,
      take: query.limit,
      skip: query.offset,
      include: {
        category: true,
        currency: true,
        priceUnit: true,
        files: true,
        locations: true,
        specifications: true,
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

    // Используем статический метод для разделения файлов
    const processedListings = listings.map((listing: any) =>
      ListingEntityWithFiles.fromPrismaWithFiles(listing),
    );

    return processedListings;
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

    return await prisma.complaint.create({
      data: {
        type: body.type,
        text: body.text,
        complaintType: ComplaintType.LISTING,
        authorId: userId,
      },
      select: {
        id: true,
      },
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
    } = query;

    this.logger.log(
      `🔍 Search request: ${JSON.stringify({ search, status, condition, minPrice, maxPrice, categoryId, limit, offset })}`,
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

      if (condition) {
        esQuery.query.bool.filter.push({
          term: { 'condition.keyword': condition },
        });
        this.logger.log(`🎯 Condition filter applied: ${condition}`);
      }

      if (categoryId) {
        esQuery.query.bool.filter.push({
          term: { categoryId: parseInt(categoryId) },
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
          currency: true,
          priceUnit: true,
          files: true,
          locations: true,
          specifications: true,
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

      // Разделяем файлы на фотографии и документы
      const processedListings = listings.map((listing: any) => ({
        ...listing,
        photos: listing.files.filter(
          (file: any) => file.kind === FileKind.PHOTO,
        ),
        files: listing.files.filter(
          (file: any) => file.kind === FileKind.DOCUMENT,
        ),
      }));

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
        searchMeta: {
          query: search,
          totalFound: result.hits.total.value,
          maxScore: Math.max(...result.hits.hits.map((hit) => hit._score)),
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
    const { limit = 20, offset = 0, status, condition, search } = query;

    // Создаем условия фильтрации
    const where: any = {};

    if (status) {
      where.status = status;
    }

    if (condition) {
      where.condition = condition;
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
        specifications: true,
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

    // Разделяем файлы на фотографии и документы
    const processedListings = listings.map((listing: any) => ({
      ...listing,
      photos: listing.files.filter((file: any) => file.kind === FileKind.PHOTO),
      files: listing.files.filter(
        (file: any) => file.kind === FileKind.DOCUMENT,
      ),
    }));

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

    return await prisma.$transaction(async (tx: PrismaClient) => {
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
    });
  }

  // async changeListingStatus(
  //   userId: string,
  //   body: ChangeListingStatusDto,
  // ): Promise<ChangeStatusResponseDto> {
  //   const { listingId, status } = body;

  //   const checkIfListingExist = await prisma.listing.findFirst({
  //     where: {
  //       id: listingId,
  //     },
  //   });

  //   if (!checkIfListingExist) {
  //     throw new BadRequestException(`Объявление с id: ${listingId} не найдено`);
  //   }

  //   return await prisma.$transaction(async (tx: PrismaClient) => {
  //     // проверка активных объявлений для PUBLISHED
  //     if (status === ListingStatus.PUBLISHED) {
  //       const availableSlots =
  //         await this.subscriptionService.getUserAvailableSlots(userId);
  //       this.logger.log(`Доступных слотов: ${availableSlots.length}`);

  //       if (availableSlots.length === 0) {
  //         throw new BadRequestException(
  //           'Нет доступных слотов для создания объявления',
  //         );
  //       }

  //       if (checkIfListingExist.status === ListingStatus.ARCHIVED) {
  //         await tx.listing.create({
  //           data: {
  //             ...checkIfListingExist,
  //             status: ListingStatus.PUBLISHED,
  //           },
  //         });
  //       }

  //       await tx.listing.update({
  //         where: { id: listingId },
  //         data: {
  //           status: status,
  //           autoDeleteAt: null,
  //         },
  //       });

  //       // Создаем связь объявления со слотом
  //       return await tx.listingSlot.create({
  //         data: {
  //           listingId,
  //           userSlotId: availableSlots[0].id,
  //           assignedAt: new Date(),
  //         },
  //       });
  //     }

  //     // если статус НЕ PUBLISHED, то освобождаем слоты
  //     if (checkIfListingExist.status === ListingStatus.PUBLISHED) {
  //       // await tx.listingSlot.deleteMany({
  //       await tx.listingSlot.delete({
  //         where: {
  //           listingId,
  //         },
  //       });

  //       this.logger.log(`Освобожден слот для объявления ${listingId}`);
  //     }

  //     if (status === ListingStatus.ARCHIVED) {
  //       await tx.listing.update({
  //         where: {
  //           id: listingId,
  //         },
  //         data: {
  //           status,
  //           archivedAt: new Date(),
  //           autoDeleteAt: this.calculateAutoDeleteDate(),
  //         },
  //       });
  //     }

  //     // Остальные статусы (DRAFT, TEMPLATE)
  //     updatedListing = await tx.listing.update({
  //       where: { id: listingId },
  //       data: {
  //         status: status,
  //       },
  //     });
  //   });
  // }

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
      async (tx: PrismaClient) => {
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
  ): Promise<ListingResposeDto> {
    // const cachedKey = `listings:${id}`;
    // const cachedListing = await this.cacheSevice.get(cachedKey);
    // if (cachedListing) return cachedListing;

    this.logger.log(`Listing ID: ${id}, Status: ${status.status}`);
    const listing = await prisma.listing.findFirst({
      where: { id, status: status.status },
      include: {
        category: true,
        currency: true,
        priceUnit: true,
        files: true,
        locations: true,
        specifications: true,
        listingSlot: {
          include: {
            userSlot: true,
          },
        },
      },
    });

    // Разделяем файлы на фотографии и документы
    // if (listing) {
    //   const processedListing = {
    //     ...listing,
    //     photos: listing.files.filter(
    //       (file: any) => file.kind === FileKind.PHOTO,
    //     ),
    //     files: listing.files.filter(
    //       (file: any) => file.kind === FileKind.DOCUMENT,
    //     ),
    //   };
    //   return processedListing;
    // }

    // if (listing) {
    //   await this.cacheSevice.set({
    //     baseKey: cachedKey,
    //     ttl: 900,
    //     value: listing,
    //   });
    // }

    // return listing;
    return ListingMapper.toResponse(listing);
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
        currency: true,
        priceUnit: true,
        files: true,
        locations: true,
        specifications: true,
        listingSlot: {
          include: {
            userSlot: true,
          },
        },
      },
    });

    // Разделяем файлы на фотографии и документы
    // const processedListings = listings.map((listing: any) => ({
    //   ...listing,
    //   photos: listing.files.filter((file: any) => file.kind === FileKind.PHOTO),
    //   files: listing.files.filter(
    //     (file: any) => file.kind === FileKind.DOCUMENT,
    //   ),
    // }));

    // if (processedListings && processedListings.length > 0) {
    //   await this.cacheSevice.set({
    //     baseKey: cacheKey,
    //     ttl: 900,
    //     value: processedListings,
    //   });
    // }

    // return processedListings;
    return ListingMapper.toResponseList(listings);
  }

  async createListing(
    userId: string,
    body: CreateListingDto,
  ): Promise<CreateListingResponseDto> {
    // Проверка текста на запрещенные слова
    if (body.title) {
      this.validateText(body.title);
    }
    if (body.description) {
      this.validateText(body.description);
    }

    const cacheKey = 'listings';

    // TODO: вынести логику в ресурсы для map, photos/files и там использовать cacheService

    const { maps, photos, files, ...listing } = body;
    // this.logger.log(`Объявление для создания: ${JSON.stringify(body)}`);

    // Проверяем существование категории
    if (listing.categoryId) {
      await this.categoriesService.checkCategoryById(listing.categoryId);
    }

    // Проверяем существование валюты
    if (listing.currencyId) {
      await this.dictionariesService.chechCurrencyById(listing.currencyId);
    }

    // Проверяем существование единицы измерения
    if (listing.priceUnitId) {
      await this.dictionariesService.checkUnitMeasurement(listing.priceUnitId);
    }

    try {
      const res = await prisma.$transaction(async (tx: PrismaClient) => {
        let createdListing;

        if (listing.status === ListingStatus.PUBLISHED) {
          const availableSlots =
            await this.subscriptionService.getUserAvailableSlots(userId);
          this.logger.log(`Доступных слотов: ${availableSlots.length}`);

          if (availableSlots.length === 0) {
            throw new BadRequestException(
              'Нет доступных слотов для создания объявления',
            );
          }

          createdListing = await this.createListingByStatus(userId, listing);

          // Создаем связь объявления со слотом
          await tx.listingSlot.create({
            data: {
              listingId: createdListing.id,
              userSlotId: availableSlots[0].id,
              assignedAt: new Date(),
            },
          });

          // if (maps && maps.length > 0) {
          //   await this.mapLocationsService.createMapLocationsForListing(
          //     tx,
          //     maps,
          //     createdListing.id,
          //   );
          // }
        }

        createdListing = await this.createListingByStatus(userId, listing);

        // Создаем геолокацию если указана
        if (maps && maps.length > 0) {
          await this.mapLocationsService.createMapLocationsForListing(
            tx,
            maps,
            createdListing.id,
          );
        }

        // Создаем файлы если указаны
        if (files && files.length > 0) {
          // Сначала создаем записи в БД с base64 данными
          const fileRecords = files.map((fileData, index) => {
            const fileName = this.s3Service.generateFileNameFromBase64(
              fileData,
              index,
              'file',
            );
            const s3Key = this.s3Service.generateDocumentKey(
              createdListing.id,
              index,
            );
            const contentType =
              this.s3Service.getContentTypeFromBase64(fileData);
            const fileSize = this.s3Service.getFileSizeFromBase64(fileData);

            return {
              ownerType: FileOwnerType.LISTING,
              listingId: createdListing.id,
              url: fileData, // Пока храним base64
              fileType: contentType,
              fileName,
              fileSize,
              kind: FileKind.DOCUMENT,
              sortOrder: index,
              s3Key,
              s3Bucket: '', // Будет заполнено после загрузки в S3
              uploadStatus: 'pending', // Статус ожидания загрузки
            };
          });

          // Сохраняем файлы в БД
          await tx.file.createMany({
            data: fileRecords,
          });

          // Отправляем задачи в RabbitMQ для асинхронной загрузки в S3
          // files.forEach(async (fileData, index) => {
          //   const fileRecord = fileRecords[index];
          //   await this.rabbitmqService.sendFileUpload({
          //     listingId: createdListing.id,
          //     fileType: 'document',
          //     fileIndex: index,
          //     fileData, // base64 данные
          //     fileName: fileRecord.fileName,
          //     contentType: fileRecord.fileType,
          //     fileSize: fileRecord.fileSize,
          //     s3Key: fileRecord.s3Key,
          //   });
          // });
          await Promise.all(
            files.map(async (fileData, index) => {
              const fileRecord = fileRecords[index];
              return this.rabbitmqService.sendFileUpload({
                listingId: createdListing.id,
                fileType: 'document',
                fileIndex: index,
                fileData,
                fileName: fileRecord.fileName,
                contentType: fileRecord.fileType,
                fileSize: fileRecord.fileSize,
                s3Key: fileRecord.s3Key,
              });
            }),
          );
        }

        // Создаем фото если указаны
        if (photos && photos.length > 0) {
          // Сначала создаем записи в БД с base64 данными
          const photoRecords = photos.map((photoData, index) => {
            const fileName = this.s3Service.generateFileNameFromBase64(
              photoData,
              index,
              'photo',
            );
            const s3Key = this.s3Service.generatePhotoKey(
              createdListing.id,
              index,
            );
            const contentType =
              this.s3Service.getContentTypeFromBase64(photoData);
            const fileSize = this.s3Service.getFileSizeFromBase64(photoData);

            return {
              ownerType: FileOwnerType.LISTING,
              listingId: createdListing.id,
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
          // photos.forEach(async (photoData, index) => {
          //   const photoRecord = photoRecords[index];
          //   await this.rabbitmqService.sendFileUpload({
          //     listingId: createdListing.id,
          //     fileType: 'photo',
          //     fileIndex: index,
          //     fileData: photoData, // base64 данные
          //     fileName: photoRecord.fileName,
          //     contentType: photoRecord.fileType,
          //     fileSize: photoRecord.fileSize,
          //     s3Key: photoRecord.s3Key,
          //   });
          // });
          await Promise.all(
            photos.map(async (photoData, index) => {
              const photoRecord = photoRecords[index];
              return this.rabbitmqService.sendFileUpload({
                listingId: createdListing.id,
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

        // записываем в elasticSearch
        // await this.indexListingInElasticsearch(createdListing);

        return createdListing;
      });
      await this.cacheSevice.del(cacheKey);

      // Индексируем в Elasticsearch после успешной транзакции
      await this.indexListingInElasticsearch(res);

      return res;
    } catch (error) {
      this.logger.error('Ошибка создания объявления:', error);
      throw error;
    }
  }

  async editListingById(id: string, user: JwtPayload, body: UpdateListingDto) {
    return { id, user, body };
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

    return prisma.listing.create({
      data: {
        ...listing,
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

      // Преобразуем данные для Elasticsearch
      const document: ListingDocument = {
        ...listingWithRelations,
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
}
