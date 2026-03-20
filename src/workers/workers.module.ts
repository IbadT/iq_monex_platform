import { Module } from '@nestjs/common';
import { WorkersService } from './workers.service';
import { WorkersController } from './workers.controller';
import { S3Module } from '@/s3/s3.module';
import { JwtAuthModule } from '@/auth/jwt/jwt.module';
import { CacheService } from '@/cache/cacheService.service';
import { RedisCacheModule } from '@/cache/redis.module';

@Module({
  imports: [S3Module, JwtAuthModule, RedisCacheModule],
  controllers: [WorkersController],
  providers: [WorkersService, CacheService],
  exports: [WorkersService],
})
export class WorkersModule {}
