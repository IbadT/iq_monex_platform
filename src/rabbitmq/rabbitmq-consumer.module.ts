import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EmailConsumerService } from './email-consumer.service';
import { EmailModule } from '@/email/email.module';
import { FileUploadConsumerService } from './file-upload-consumer.service';
import { S3Module } from '@/s3/s3.module';

@Module({
  imports: [
    ConfigModule,
    EmailModule,
    S3Module,
  ],
  providers: [EmailConsumerService, FileUploadConsumerService],
  exports: [EmailConsumerService, FileUploadConsumerService],
})
export class RabbitmqConsumerModule {}
