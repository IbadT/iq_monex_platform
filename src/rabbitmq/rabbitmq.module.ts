import { Module } from '@nestjs/common';
import { RabbitmqService } from './rabbitmq.service';
import { RabbitmqConsumerModule } from './rabbitmq-consumer.module';

@Module({
  imports: [RabbitmqConsumerModule],
  providers: [RabbitmqService],
  exports: [RabbitmqService],
})
export class RabbitmqModule {}
