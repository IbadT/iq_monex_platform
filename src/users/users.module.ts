import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CacheService } from '@/cache/cacheService.service';
import { RedisCacheModule } from '@/cache/redis.module';
import { WorkersService } from '@/workers/workers.service';
import { ActivitiesService } from '@/activities/activities.service';
import { MapLocationsService } from '@/map_locations/map-locations.service';
import { WorkersModule } from '@/workers/workers.module';
import { ActivitiesModule } from '@/activities/activities.module';
import { MapLocationsModule } from '@/map_locations/map_locations.module';
import { JwtAuthModule } from '@/auth/jwt/jwt.module';

@Module({
  imports: [
    RedisCacheModule, 
    JwtAuthModule,
    WorkersModule,
    ActivitiesModule,
    MapLocationsModule,
  ],
  controllers: [UsersController],
  providers: [
    UsersService, 
    CacheService,
    WorkersService,
    ActivitiesService,
    MapLocationsService,
  ],
  exports: [UsersService, WorkersService, ActivitiesService, MapLocationsService],
})
export class UsersModule {}
