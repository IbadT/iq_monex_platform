import { Module } from '@nestjs/common';
import { ListingsService } from './listings.service';
import { ListingsController } from './listings.controller';
import { JwtAuthModule } from '@/auth/jwt/jwt.module';
import { CacheService } from '@/cache/cacheService.service';
import { S3Service } from '@/s3/s3.service';
import { RabbitmqModule } from '@/rabbitmq/rabbitmq.module';
import { SubscriptionService } from '@/subscription/subscription.service';
import { SearchModule } from '@/search/search.module';
import { CategoriesService } from '@/categories/categories.service';
import { MapLocationsService } from '@/map_locations/map_locations.service';

@Module({
  imports: [JwtAuthModule, SearchModule, RabbitmqModule],
  controllers: [ListingsController],
  providers: [
    CacheService,
    ListingsService,
    S3Service,
    SubscriptionService,
    CategoriesService,
    MapLocationsService,
  ],
})
export class ListingsModule {}
