import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EmailConsumerService } from './email-consumer.service';
import { EmailModule } from '@/email/email.module';
import { FileUploadConsumerService } from './file-upload-consumer.service';
import { S3Module } from '@/s3/s3.module';
import { SearchModule } from '@/search/search.module';
import { RedisCacheModule } from '@/cache/redis.module';

@Module({
  imports: [
    ConfigModule,
    EmailModule,
    S3Module,
    SearchModule,
    RedisCacheModule,
  ],
  providers: [EmailConsumerService, FileUploadConsumerService],
  exports: [EmailConsumerService, FileUploadConsumerService],
})
export class RabbitmqConsumerModule {}
