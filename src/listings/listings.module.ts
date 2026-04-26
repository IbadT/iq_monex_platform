import { Module } from '@nestjs/common';
import { ListingsService } from './listings.service';
import { ListingsController } from './listings.controller';
import { JwtAuthModule } from '@/auth/jwt/jwt.module';
import { GuardsModule } from '@/common/guards/guards.module';
import { CacheService } from '@/cache/cacheService.service';
import { S3Service } from '@/s3/s3.service';
import { RabbitmqModule } from '@/rabbitmq/rabbitmq.module';
import { SubscriptionService } from '@/subscription/subscription.service';
import { SearchModule } from '@/search/search.module';
import { CategoriesService } from '@/categories/categories.service';
import { MapLocationsService } from '@/map_locations/map_locations.service';
import { DictionariesService } from '@/dictionaries/dictionaries.service';
import { FileService } from '@/s3/file.service';
import { PromoModule } from '@/promo/promo.module';
import { ViewTrackerModule } from '@/view-tracker/view-tracker.module';

@Module({
  imports: [
    JwtAuthModule,
    GuardsModule,
    SearchModule,
    RabbitmqModule,
    PromoModule,
    ViewTrackerModule,
  ],
  controllers: [ListingsController],
  providers: [
    CacheService,
    ListingsService,
    S3Service,
    SubscriptionService,
    CategoriesService,
    MapLocationsService,
    DictionariesService,
    FileService,
  ],
})
export class ListingsModule {}
