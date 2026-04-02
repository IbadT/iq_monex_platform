import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CacheService } from '@/cache/cacheService.service';
import { RedisCacheModule } from '@/cache/redis.module';
import { WorkersService } from '@/workers/workers.service';
import { ActivitiesService } from '@/activities/activities.service';
import { MapLocationsService } from '@/map_locations/map_locations.service';
import { WorkersModule } from '@/workers/workers.module';
import { ActivitiesModule } from '@/activities/activities.module';
import { MapLocationsModule } from '@/map_locations/map_locations.module';
import { JwtAuthModule } from '@/auth/jwt/jwt.module';
import { SearchModule } from '@/search/search.module';
import { S3Module } from '@/s3/s3.module';
import { RabbitmqModule } from '@/rabbitmq/rabbitmq.module';
import { UserCoreService } from './user-core.service';
import { ProfileService } from './profile.service';
import { FileService } from '@/s3/file.service';

@Module({
  imports: [
    RedisCacheModule,
    JwtAuthModule,
    WorkersModule,
    ActivitiesModule,
    MapLocationsModule,
    SearchModule,
    S3Module,
    RabbitmqModule,
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    CacheService,
    WorkersService,
    ActivitiesService,
    MapLocationsService,
    UserCoreService,
    ProfileService,
    FileService,
  ],
  exports: [
    UsersService,
    WorkersService,
    ActivitiesService,
    MapLocationsService,
  ],
})
export class UsersModule {}
