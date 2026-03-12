import { AppLogger } from '@/common/logger/logger.service';
import {
  BadRequestException,
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
import { RabbitmqService } from '@/rabbitmq/rabbitmq.service';
import { SubscriptionService } from '@/subscription/subscription.service';

@Injectable()
export class ListingsService {
  constructor(
    private readonly logger: AppLogger,
    private readonly cacheSevice: CacheService,
    private readonly s3Service: S3Service,
    private readonly rabbitmqService: RabbitmqService,
    private readonly subscriptionService: SubscriptionService,
  ) {}

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

  async listingPublishFromDraft(id: string) {
    const checkIfListingIsInDraft = await this.listingById(
      id,
      new StatusQueryDto(ListingStatus.DRAFT),
    );
    if (!checkIfListingIsInDraft) {
      throw new BadRequestException(
        `Объявление с id: ${id} не находится в архиве`,
      );
    }

    return await prisma.listing.update({
      where: { id },
      data: {
        status: 'PUBLISHED',
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

    if (!availableSlots || availableSlots.length === 0) {
      throw new BadRequestException(
        'Нет доступных слотов для создания объявления',
      );
    }

    // TODO: вынести логику в ресурсы для map, photos/files и там использовать cacheService

    const { map, photos, files, ...listing } = body;
    this.logger.log(`Объявление для создания: ${JSON.stringify(body)}`);

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
          const fileRecords = [];

          for (let index = 0; index < files.length; index++) {
            const fileData = files[index];
            const fileName = this.s3Service.generateFileNameFromBase64(
              fileData,
              index,
              'document',
            );
            const s3Key = this.s3Service.generateDocumentKey(
              createdListing.id,
              index,
            );
            const contentType =
              this.s3Service.getContentTypeFromBase64(fileData);
            const fileSize = this.s3Service.getFileSizeFromBase64(fileData);

            // Отправляем задачу загрузки в RabbitMQ
            this.rabbitmqService.sendFileUpload({
              listingId: createdListing.id,
              fileType: 'document',
              fileIndex: index,
              fileData,
              fileName,
              contentType,
              fileSize,
              s3Key,
            });

            fileRecords.push({
              ownerType: FileOwnerType.LISTING,
              listingId: createdListing.id,
              url: fileData, // Временно храним base64, обновится после загрузки
              fileType: contentType,
              fileName,
              fileSize,
              kind: FileKind.DOCUMENT,
              sortOrder: index,
              s3Key,
              s3Bucket: '', // Обновится после загрузки
            });
          }

          await tx.file.createMany({
            data: fileRecords,
          });
        }

        // Создаем фото если указаны
        if (photos && photos.length > 0) {
          const photoRecords = [];

          for (let index = 0; index < photos.length; index++) {
            const photoData = photos[index];
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

            // Отправляем задачу загрузки в RabbitMQ
            this.rabbitmqService.sendFileUpload({
              listingId: createdListing.id,
              fileType: 'photo',
              fileIndex: index,
              fileData: photoData,
              fileName,
              contentType,
              fileSize,
              s3Key,
            });

            photoRecords.push({
              ownerType: FileOwnerType.LISTING,
              listingId: createdListing.id,
              url: photoData, // Временно храним base64, обновится после загрузки
              fileType: contentType,
              fileName,
              fileSize,
              kind: FileKind.PHOTO,
              sortOrder: index,
              s3Key,
              s3Bucket: '', // Обновится после загрузки
            });
          }

          await tx.file.createMany({
            data: photoRecords,
          });
        }

        return createdListing;
      });
      await this.cacheSevice.del(cacheKey);

      return res;
    } catch (error) {
      this.logger.error('Ошибка создания объявления:', error);
      throw error;
    }
  }

  async editListingById(id: string) {
    return id;
  }

  async deleteListingById(id: string, status: StatusQueryDto) {
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
}
