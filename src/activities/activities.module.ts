import { Module } from '@nestjs/common';
import { ActivitiesService } from './activities.service';
import { ActivitiesController } from './activities.controller';
import { CacheService } from '@/cache/cacheService.service';
import { RedisCacheModule } from '@/cache/redis.module';
import { JwtAuthModule } from '@/auth/jwt/jwt.module';

@Module({
  imports: [RedisCacheModule, JwtAuthModule],
  controllers: [ActivitiesController],
  providers: [ActivitiesService, CacheService],
  exports: [ActivitiesService],
})
export class ActivitiesModule {}
