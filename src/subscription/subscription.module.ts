import { Module } from '@nestjs/common';
import { SubscriptionController } from './subscription.controller';
import { SubscriptionService } from './subscription.service';
import { JwtAuthModule } from '@/auth/jwt/jwt.module';

@Module({
  imports: [JwtAuthModule],
  controllers: [SubscriptionController],
  providers: [SubscriptionService],
  exports: [SubscriptionService], // Добавляем экспорт
})
export class SubscriptionServiceModule {}
