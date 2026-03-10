import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateReviewDto } from './dto/update-review.dto';
import { CreateReviewDto } from './dto/create-review.dto';
import { AppLogger } from '@/common/logger/logger.service';
import { prisma } from '@/lib/prisma';
import { TransactionClient } from 'prisma/generated/internal/prismaNamespace';
import { ReviewTargetType } from './enums/review-target-type.enum';
import { CacheService } from '@/cache/cacheService.service';

@Injectable()
export class ReviewsService {
  constructor(
    private readonly cacheService: CacheService,
    private readonly logger: AppLogger,
  ) {}

  async create(authorId: string, body: CreateReviewDto) {
    this.logger.log(`This action adds a new review: BODY: ${body}`);
    const { photos, ...review } = body;

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

  async findByListingId(id: string) {
    return await prisma.review.findMany({
      where: {
        listingId: id,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            // TODO: аватар
            // photo
          },
        },
      },
    });
  }

  async findAll() {
    const cackeKey = 'reviews';

    const cachedData = await this.cacheService.get(cackeKey);
    if (cachedData) return cachedData;

    const reviews = await prisma.review.findMany({
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
    // TODO: добавить кэш
    return `This action updates a #${id} review, DTO: ${updateReviewDto}`;
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
