import { Module } from '@nestjs/common';
import { ListingsService } from './listings.service';
import { ListingsController } from './listings.controller';
import { JwtAuthModule } from '@/auth/jwt/jwt.module';
import { CacheService } from '@/cache/cacheService.service';
import { FavoriteService } from '@/favorite/favorite.service';
import { ReviewsService } from '@/reviews/reviews.service';
import { ListingLikesService } from './listing-likes.service';
import { S3Service } from '@/s3/s3.service';
import { RabbitmqService } from '@/rabbitmq/rabbitmq.service';
import { SubscriptionService } from '@/subscription/subscription.service';

@Module({
  imports: [JwtAuthModule],
  controllers: [ListingsController],
  providers: [
    CacheService,
    ListingsService,
    FavoriteService,
    ReviewsService,
    ListingLikesService,
    RabbitmqService,
    S3Service,
    SubscriptionService,
  ],
})
export class ListingsModule {}
