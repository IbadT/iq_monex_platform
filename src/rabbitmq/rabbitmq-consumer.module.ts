import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EmailConsumerService } from './email-consumer.service';
import { EmailModule } from '@/email/email.module';

@Module({
  imports: [
    ConfigModule,
    EmailModule,
  ],
  providers: [EmailConsumerService],
  exports: [EmailConsumerService],
})
export class RabbitmqConsumerModule {}
