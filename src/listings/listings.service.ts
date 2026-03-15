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
import { FileOwnerType, FileKind } from 'prisma/generated/enums';
import {
  Decimal,
  TransactionClient,
} from 'prisma/generated/internal/prismaNamespace';
import { CacheService } from '@/cache/cacheService.service';
import { S3Service } from '@/s3/s3.service';
import { SubscriptionService } from '@/subscription/subscription.service';
import { ChangeListingStatusDto } from './dto/request/change-listing-status.dto';
import { UpdateListingDto } from './dto/request/update-listing.dto';
import { JwtPayload } from '@/common/interfaces/jwt-payload.interface';
import { SearchService } from '@/search/search.service';
import { ListingDocument } from '@/search/interfaces/listing.interface';
import { RabbitmqService } from '@/rabbitmq/rabbitmq.service';
import { AddFavoriteListingDto } from './dto/request/add-favorite-listing.dto';
import { FavoriteType } from '@/favorites/enums/favorite-type.enum';
import { GetFavoritesQueryDto } from './dto/request/get-favorites-query.dto';
import { ComplaintType } from '@/users/enums/complaint-type.enum';
import { MakeComplaintToListing } from './dto/request/make-complaint-to-listing.dto';

@Injectable()
export class ListingsService {
  constructor(
    private readonly subscriptionService: SubscriptionService,
    private readonly cacheSevice: CacheService,
    private readonly s3Service: S3Service,
    private readonly searchService: SearchService,
    private readonly rabbitmqService: RabbitmqService,
    private readonly logger: AppLogger,
  ) {}

  // async searchListing(text: string) {
  //   const result = await this.listingSearchService.search(text);
  //   const ids = result.map((result = result.id));
  //   if (!ids.length) {
  //     return [];
  //   }
  //   return prisma.listing.findMany({
  //     where: {
  //       id: ids,
  //     },
  //   });
  // }

  async makeComplaintToListing(userId: string, body: MakeComplaintToListing) {
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
    });
  }

  async getFavoritesUserListings(userId: string, query: GetFavoritesQueryDto) {
    return await prisma.favorite.findMany({
      where: {
        userId,
      },
      take: query.limit,
      skip: query.offset,
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async addListingToFavorite(userId: string, body: AddFavoriteListingDto) {
    const checkIfListingIsInDraft = await this.listingById(
      body.listingId,
      new StatusQueryDto(ListingStatus.DRAFT),
    );
    if (checkIfListingIsInDraft) {
      throw new BadRequestException(
        `Объявление с id: ${body.listingId} находится в архиве`,
      );
    }

    // Проверяем если объявление уже находится в избранном или нет
    const favorite = await prisma.favorite.findFirst({
      where: {
        userId,
        listingId: body.listingId,
        type: FavoriteType.LISTING,
      },
    });

    if (favorite) {
      // Если уже в избранном - удаляем
      await prisma.favorite.delete({
        where: {
          id: favorite.id,
        },
      });
      return { action: 'removed', favoriteId: favorite.id };
    } else {
      // Если нет в избранном - добавляем
      const newFavorite = await prisma.favorite.create({
        data: {
          userId,
          listingId: body.listingId,
          type: FavoriteType.LISTING,
        },
      });
      return { action: 'added', favorite: newFavorite };
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

    return {
      rows: listings,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
    };
  }

  async listingPublishFromDraft(body: ChangeListingStatusDto) {
    const { listingId, status } = body;
    const checkIfListingIsInDraft = await this.listingById(
      listingId,
      new StatusQueryDto(ListingStatus.DRAFT),
    );
    if (!checkIfListingIsInDraft) {
      throw new BadRequestException(
        `Объявление с id: ${listingId} не находится в архиве`,
      );
    }

    return await prisma.listing.update({
      where: { id: listingId },
      data: {
        status: status,
      },
    });
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

  async listingById(id: string, status: StatusQueryDto) {
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

    // if (listing) {
    //   await this.cacheSevice.set({
    //     baseKey: cachedKey,
    //     ttl: 900,
    //     value: listing,
    //   });
    // }

    return listing;
  }

  async listingsByUserId(userId: string) {
    const cacheKey = `listings:userId:${userId}`;
    const cachedListings = await this.cacheSevice.get(cacheKey);
    if (cachedListings) return cachedListings;

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

    if (listings && listings.length > 0) {
      await this.cacheSevice.set({
        baseKey: cacheKey,
        ttl: 900,
        value: listings,
      });
    }

    return listings;
  }

  async createListing(userId: string, body: CreateListingDto) {
    const cacheKey = 'listings';

    // TODO: проверка доступных(пустых) слотов
    const availableSlots =
      await this.subscriptionService.getUserAvailableSlots(userId);
    this.logger.log(`Доступных слотов: ${availableSlots.length}`);

    if (!availableSlots || availableSlots.length === 0) {
      throw new BadRequestException(
        'Нет доступных слотов для создания объявления',
      );
    }

    // TODO: вынести логику в ресурсы для map, photos/files и там использовать cacheService

    const { map, photos, files, ...listing } = body;
    // this.logger.log(`Объявление для создания: ${JSON.stringify(body)}`);

    // Проверяем существование категории
    if (listing.categoryId) {
      const categoryExists = await prisma.category.findUnique({
        where: { id: listing.categoryId },
      });

      if (!categoryExists) {
        throw new BadRequestException(
          `Категория с ID ${listing.categoryId} не найдена`,
        );
      }
    }

    // Проверяем существование валюты
    if (listing.currencyId) {
      const currencyExists = await prisma.currency.findUnique({
        where: { id: listing.currencyId },
      });

      if (!currencyExists) {
        throw new BadRequestException(
          `Валюта с ID ${listing.currencyId} не найдена`,
        );
      }
    }

    // Проверяем существование единицы измерения
    if (listing.priceUnitId) {
      const priceUnitExists = await prisma.unitMeasurement.findUnique({
        where: { id: listing.priceUnitId },
      });

      if (!priceUnitExists) {
        throw new BadRequestException(
          `Единица измерения с ID ${listing.priceUnitId} не найдена`,
        );
      }
    }

    try {
      const res = await prisma.$transaction(async (tx: TransactionClient) => {
        // Создаем объявление
        const createdListing = await tx.listing.create({
          data: {
            ...listing, // Распространяем все остальные поля
            status: listing.status || 'DRAFT',
            // price: listing.price ? new Decimal(listing.price) : null,
            price: listing.price ? new Decimal(listing.price) : null,
            userId,
          },
        });

        // Создаем связь объявления со слотом
        await tx.listingSlot.create({
          data: {
            listingId: createdListing.id,
            userSlotId: availableSlots[0].id,
            assignedAt: new Date(),
          },
        });

        // Создаем геолокацию если указана
        if (map) {
          await tx.mapLocation.create({
            data: {
              type: map.type,
              latitude: new Decimal(map.latitude),
              longtitude: new Decimal(map.longtitude),
              listingId: createdListing.id,
            },
          });
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
          files.forEach(async (fileData, index) => {
            const fileRecord = fileRecords[index];
            await this.rabbitmqService.sendFileUpload({
              listingId: createdListing.id,
              fileType: 'document',
              fileIndex: index,
              fileData, // base64 данные
              fileName: fileRecord.fileName,
              contentType: fileRecord.fileType,
              fileSize: fileRecord.fileSize,
              s3Key: fileRecord.s3Key,
            });
          });
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
          photos.forEach(async (photoData, index) => {
            const photoRecord = photoRecords[index];
            await this.rabbitmqService.sendFileUpload({
              listingId: createdListing.id,
              fileType: 'photo',
              fileIndex: index,
              fileData: photoData, // base64 данные
              fileName: photoRecord.fileName,
              contentType: photoRecord.fileType,
              fileSize: photoRecord.fileSize,
              s3Key: photoRecord.s3Key,
            });
          });
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
          longtitude: Number(loc.longtitude),
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
}
