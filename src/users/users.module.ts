import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CacheService } from '@/cache/cacheService.service';
import { RedisCacheModule } from '@/cache/redis.module';
import { JwtAuthModule } from '@/auth/jwt/jwt.module';

@Module({
  imports: [RedisCacheModule, JwtAuthModule],
  controllers: [UsersController],
  providers: [UsersService, CacheService],
})
export class UsersModule {}
