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
// import { CacheService } from '@/cache/cacheService.service';

@Injectable()
export class ListingsService {
  constructor(
    private readonly logger: AppLogger,
    private readonly cacheSevice: CacheService,
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
    const cachedKey = `listings:${id}`;
    const cachedListing = await this.cacheSevice.get(cachedKey);
    if (cachedListing) return cachedListing;

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
      },
    });

    if (listing) {
      await this.cacheSevice.set({
        baseKey: cachedKey,
        ttl: 900,
        value: listing,
      });
    }

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
    // TODO: вынести логику в ресурсы для map, photos/files и там использовать cacheService

    const { map, photos, files, ...listing } = body;
    this.logger.log(`Объявление для создания: ${JSON.stringify(body)}`);

    try {
      const res = await prisma.$transaction(async (tx: TransactionClient) => {
        // Создаем объявление
        const createdListing = await tx.listing.create({
          data: {
            ...listing, // Распространяем все остальные поля
            status: listing.status || 'DRAFT',
            // price: listing.price ? new Decimal(listing.price) : null,
            price: listing.price ? new Decimal(listing.price) : null,
            userId, // TODO: Получить из контекста пользователя
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
          const fileRecords = files.map((fileData, index) => ({
            ownerType: FileOwnerType.LISTING,
            listingId: createdListing.id,
            url: fileData,
            fileType: 'application/pdf', // TODO: Определять из base64
            fileName: `document_${index}.pdf`,
            fileSize: 0, // TODO: Получить размер из base64
            kind: FileKind.DOCUMENT,
            sortOrder: index,
            s3Key: '', // TODO: Генерировать S3 ключ
            s3Bucket: '', // TODO: Получить из конфига
          }));

          await tx.file.createMany({
            data: fileRecords,
          });
        }

        // Создаем фото если указаны
        if (photos && photos.length > 0) {
          const photoRecords = photos.map((photoData, index) => ({
            ownerType: FileOwnerType.LISTING,
            listingId: createdListing.id,
            url: photoData,
            fileType: 'image/jpeg', // TODO: Определять из base64
            fileName: `photo_${index}.jpg`,
            fileSize: 0, // TODO: Получить размер из base64
            kind: FileKind.PHOTO,
            sortOrder: index,
            s3Key: '', // TODO: Генерировать S3 ключ
            s3Bucket: '', // TODO: Получить из конфига
          }));

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
