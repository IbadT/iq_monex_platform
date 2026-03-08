import { Module } from '@nestjs/common';
import { EmailConsumerService } from './email-consumer.service';
import { EmailModule } from '@/email/email.module';

@Module({
  imports: [EmailModule],
  providers: [EmailConsumerService],
  exports: [EmailConsumerService],
})
export class RabbitmqConsumerModule {}
