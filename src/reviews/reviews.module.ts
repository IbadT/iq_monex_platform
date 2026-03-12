import { Module } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';
import { ListingsService } from '@/listings/listings.service';
import { JwtAuthModule } from '@/auth/jwt/jwt.module';
import { RedisCacheModule } from '@/cache/redis.module';
import { CacheService } from '@/cache/cacheService.service';
import { S3Service } from '@/s3/s3.service';
import { RabbitmqService } from '@/rabbitmq/rabbitmq.service';
import { SubscriptionServiceModule } from '@/subscription/subscription.module';

@Module({
  imports: [JwtAuthModule, RedisCacheModule, SubscriptionServiceModule],
  controllers: [ReviewsController],
  providers: [ReviewsService, ListingsService, CacheService, S3Service, RabbitmqService],
})
export class ReviewsModule {}
