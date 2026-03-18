import { Module } from '@nestjs/common';
import { RedisModule } from '@nestjs-modules/ioredis';
import { ConfigService } from '@nestjs/config';
import { CacheService } from './cacheService.service';

@Module({
  imports: [
    RedisModule.forRootAsync({
      imports: [],
      useFactory: (configService: ConfigService) => ({
        type: 'single',
        url: configService.get<string>('REDIS_URL') || 'redis://redis:6379',
        options: {
          retryDelayOnFailover: 100,
          maxRetriesPerRequest: 3,
          lazyConnect: true,
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [CacheService],
  exports: [RedisModule, CacheService],
})
export class RedisCacheModule {}
