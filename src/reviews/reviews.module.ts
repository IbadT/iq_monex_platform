import { Module } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';
import { ListingsService } from '@/listings/listings.service';
import { JwtAuthModule } from '@/auth/jwt/jwt.module';
import { RedisCacheModule } from '@/cache/redis.module';
import { CacheService } from '@/cache/cacheService.service';

@Module({
  imports: [JwtAuthModule, RedisCacheModule],
  controllers: [ReviewsController],
  providers: [ReviewsService, ListingsService, CacheService],
})
export class ReviewsModule {}
