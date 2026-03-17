import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { UpdateReviewDto } from './dto/update-review.dto';
import { CreateReviewDto } from './dto/create-review.dto';
import { AppLogger } from '@/common/logger/logger.service';
import { prisma } from '@/lib/prisma';
import { TransactionClient } from 'prisma/generated/internal/prismaNamespace';
import { ReviewTargetType } from './enums/review-target-type.enum';
import { CacheService } from '@/cache/cacheService.service';
import { ListingStatus } from '@/listings/enums/listing-status.enum';
import { PaginationDto } from '@/common/dto/pagintation.dto';
import { CreateReviewToUserDto } from './dto/create-review.to-user.dto';
import { S3Service } from '@/s3/s3.service';
import { RabbitmqService } from '@/rabbitmq/rabbitmq.service';
import { PrismaClient } from 'prisma/generated/client';

@Injectable()
export class ReviewsService {
  constructor(
    private readonly cacheService: CacheService,
    private readonly logger: AppLogger,
    private readonly s3Service: S3Service,
    private readonly rabbitmqService: RabbitmqService,
  ) {}


  async getUserReviews(userId: string, query: PaginationDto) {
    return await prisma.review.findMany({
      where: {
        targetUserId: userId,
        targetType: ReviewTargetType.USER,
      },
      take: query.limit,
      skip: query.offset,
    })
  }
  
  async createReviewToUser(userId: string, body: CreateReviewToUserDto) {
    // Проверяем что пользователь не пытается оставить отзыв самому себе
    if (userId === body.userId) {
      throw new ConflictException("Пользователь не может оставить себе комментарий");
    }

    // Проверяем что целевой пользователь существует
    const targetUser = await prisma.user.findFirst({
      where: {
        id: body.userId
      }
    });

    if (!targetUser) {
      throw new NotFoundException("Пользователь не найден");
    }

    return await prisma.$transaction(async (tx: PrismaClient) => {
      // Создаем отзыв
      const review = await tx.review.create({
        data: {
          targetUserId: body.userId,  // ID пользователя, которому оставляют отзыв
          targetType: ReviewTargetType.USER,
          authorId: userId,            // ID авторизованного пользователя (автор отзыва)
          content: body.text,
          rating: body.rating,
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
          const s3Key = this.s3Service.generatePhotoKey(
            review.id,
            index,
          );
          const contentType =
            this.s3Service.getContentTypeFromBase64(photoData);
          const fileSize = this.s3Service.getFileSizeFromBase64(photoData);

          return {
            reviewId: review.id,
            url: photoData, // Пока храним base64
            fileType: contentType,
            fileName,
            fileSize,
            sortOrder: index,
            s3Key,
            s3Bucket: '', // Будет заполнено после загрузки в S3
          };
        });

        // Сохраняем фото в БД
        await tx.reviewFile.createMany({
          data: photoRecords,
        });

        // Отправляем задачи в RabbitMQ для асинхронной загрузки в S3
        body.photos.forEach(async (photoData, index) => {
          const photoRecord = photoRecords[index];
          await this.rabbitmqService.sendReviewFileUpload({
            reviewId: review.id,
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

      // Обновляем рейтинг и количество отзывов пользователя, которому оставили отзыв
      const newReviewsCount = targetUser.reviewsCount + 1;
      const currentRating = targetUser.rating || 0;
      const newRating = ((currentRating * targetUser.reviewsCount) + body.rating) / newReviewsCount;

      await tx.user.update({
        where: {
          id: body.userId,
        },
        data: {
          reviewsCount: newReviewsCount,
          rating: newRating,
        },
      });

      return review;
    });
  }

  async create(authorId: string, body: CreateReviewDto) {
    // const cacheKey = `listings:${body.listingId}`;
    // let hasListing = await this.cacheService.get(cacheKey);
    const { photos, ...review } = body;

    const hasListing = await prisma.listing.findFirst({
      where: {
        id: body.listingId,
        status: ListingStatus.PUBLISHED,
      },
    });

    if (!hasListing) {
      throw new NotFoundException(
        `Объявления с id: ${body.listingId} не найдено`,
      );
    }

    try {
      return await prisma.$transaction(async (tx: TransactionClient) => {
        // Получаем текущее состояние объявления
        const currentListing = await tx.listing.findUnique({
          where: { id: review.listingId },
          select: { rating: true, reviewsCount: true },
        });

        if (!currentListing) {
          throw new NotFoundException('Объявление не найдено');
        }

        const reviewListing = await tx.review.create({
          data: {
            authorId,
            listingId: review.listingId,
            targetType: ReviewTargetType.LISTING,
            rating: review.rating,
            title: review.title,
            content: review.content,
          },
        });

        this.logger.log(`LISTING ID: ${reviewListing.id}`);
        if (photos && photos.length > 0) {
          const reviewsPhotos = photos.map((fileData, index) => ({
            reviewId: reviewListing.id,
            s3Key: '',
            s3Bucket: '3',
            url: fileData,
            fileType: 'image/jpeg',
            fileName: `photo_${index}.jpg`,
            fileSize: 0,
          }));

          await tx.reviewFile.createMany({
            data: reviewsPhotos,
          });
        }

        // Вычисляем новый средний рейтинг
        const newTotalRating = (currentListing.rating || 0) + review.rating;
        const newReviewsCount = (currentListing.reviewsCount || 0) + 1;
        const newAverageRating = newTotalRating / newReviewsCount;

        // Обновляем средний рейтинг объявления
        await tx.listing.update({
          where: {
            id: review.listingId,
          },
          data: {
            rating: newAverageRating, // Устанавливаем новый средний рейтинг
            reviewsCount: newReviewsCount, // Обновляем количество отзывов
          },
        });
        return reviewListing.id;
      });
    } catch (error) {
      this.logger.log(`Ошибка при создании комментария к объявлению: ${error}`);
      throw error;
    }
  }

  async findAll(listingId: string) {
    const cackeKey = 'reviews';

    const cachedData = await this.cacheService.get(cackeKey);
    if (cachedData) return cachedData;

    const reviews = await prisma.review.findMany({
      where: {
        listingId,
      },
      include: {
        likes: true,
      },
    });

    if (reviews && reviews.length > 0) {
      await this.cacheService.set({
        baseKey: cackeKey,
        ttl: 900,
        value: reviews,
      });
    }

    return reviews;
  }

  async findOne(id: string) {
    const cacheKey = `revies/id:${id}`;
    const cachedData = await this.cacheService.get(cacheKey);
    if (cachedData) return cachedData;

    const review = await prisma.review.findFirst({
      where: { id },
      include: {
        likes: true,
        author: true,
        files: true,
      },
    });

    if (review) {
      await this.cacheService.set({
        baseKey: cacheKey,
        ttl: 900,
        value: review,
      });
    }

    return review;
  }

  async update(id: string, updateReviewDto: UpdateReviewDto) {
    const cacheKey = `revies/id:${id}`;
    const cachedData = await this.cacheService.get(cacheKey);
    if (cachedData) return cachedData;

    return await prisma.review.update({
      where: { id },
      data: updateReviewDto,
    });
  }

  async remove(id: string) {
    const cacheKey = `reviews/id:${id}`;
    const cacheKeyList = `reviews`;

    const result = await prisma.review.delete({
      where: { id },
    });

    await this.cacheService.del(cacheKey);
    await this.cacheService.del(cacheKeyList);

    return result;
  }
}
