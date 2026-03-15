import { Module } from '@nestjs/common';
import { FileUploadController } from './file-upload.controller';
import { S3Module } from '@/s3/s3.module';
import { RabbitmqModule } from '@/rabbitmq/rabbitmq.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule, S3Module, RabbitmqModule],
  controllers: [FileUploadController],
})
export class FileUploadModule {}
