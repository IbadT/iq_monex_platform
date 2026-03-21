import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { CacheService } from '@/cache/cacheService.service';
import { JwtAuthModule } from '@/auth/jwt/jwt.module';
import { SubscriptionService } from '@/subscription/subscription.service';
import { TariffsModule } from '@/tariffs/tariffs.module';

@Module({
  imports: [JwtAuthModule, TariffsModule],
  controllers: [PaymentsController],
  providers: [PaymentsService, CacheService, SubscriptionService],
})
export class PaymentsModule {}
