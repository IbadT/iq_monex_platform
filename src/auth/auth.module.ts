import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtAuthModule } from './jwt/jwt.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { HashService } from './hash.service';
import { UsersService } from '@/users/users.service';
import { CacheService } from '@/cache/cacheService.service';
import { RedisCacheModule } from '@/cache/redis.module';
import { RabbitmqModule } from '@/rabbitmq/rabbitmq.module';

@Module({
  imports: [ConfigModule, JwtAuthModule, RedisCacheModule, RabbitmqModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    HashService,
    UsersService,
    CacheService,
    ConfigService,
  ],
})
export class AuthModule {}
