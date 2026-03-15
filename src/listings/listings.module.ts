import { Module } from '@nestjs/common';
import { ListingsService } from './listings.service';
import { ListingsController } from './listings.controller';
import { JwtAuthModule } from '@/auth/jwt/jwt.module';
import { CacheService } from '@/cache/cacheService.service';
import { S3Service } from '@/s3/s3.service';
import { RabbitmqService } from '@/rabbitmq/rabbitmq.service';
import { SubscriptionService } from '@/subscription/subscription.service';
import { SearchModule } from '@/search/search.module';

@Module({
  imports: [JwtAuthModule, SearchModule],
  controllers: [ListingsController],
  providers: [
    CacheService,
    ListingsService,
    RabbitmqService,
    S3Service,
    SubscriptionService,
  ],
})
export class ListingsModule {}
