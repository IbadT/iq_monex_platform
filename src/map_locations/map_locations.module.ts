import { Module } from '@nestjs/common';
import { MapLocationsService } from './map_locations.service';
import { MapLocationsController } from './map_locations.controller';
import { CacheService } from '@/cache/cacheService.service';
import { RedisCacheModule } from '@/cache/redis.module';

@Module({
  imports: [RedisCacheModule],
  controllers: [MapLocationsController],
  providers: [MapLocationsService, CacheService],
  exports: [MapLocationsService],
})
export class MapLocationsModule {}
