import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtAuthModule } from './jwt/jwt.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { HashService } from './hash.service';
import { CacheService } from '@/cache/cacheService.service';
import { RedisCacheModule } from '@/cache/redis.module';
import { RabbitmqModule } from '@/rabbitmq/rabbitmq.module';
import { EmailModule } from '@/email/email.module';
import { UsersModule } from '@/users/users.module';
import { LoggerModule } from '@/common/logger/logger.module';
import { PromoModule } from '@/promo/promo.module';

@Module({
  imports: [
    ConfigModule,
    JwtAuthModule,
    RedisCacheModule,
    RabbitmqModule,
    EmailModule,
    LoggerModule,
    UsersModule,
    PromoModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, HashService, CacheService, ConfigService],
})
export class AuthModule {}
