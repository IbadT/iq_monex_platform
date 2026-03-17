import { Module } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';
import { ListingsService } from '@/listings/listings.service';
import { JwtAuthModule } from '@/auth/jwt/jwt.module';
import { RedisCacheModule } from '@/cache/redis.module';
import { CacheService } from '@/cache/cacheService.service';
import { S3Service } from '@/s3/s3.service';
import { RabbitmqService } from '@/rabbitmq/rabbitmq.service';
import { ReviewFileUploadConsumerService } from '@/rabbitmq/review-file-upload-consumer.service';
import { SubscriptionServiceModule } from '@/subscription/subscription.module';
import { SearchModule } from '@/search/search.module';

@Module({
  imports: [JwtAuthModule, RedisCacheModule, SubscriptionServiceModule, SearchModule],
  controllers: [ReviewsController],
  providers: [ReviewsService, ListingsService, CacheService, S3Service, RabbitmqService, ReviewFileUploadConsumerService],
})
export class ReviewsModule {}
