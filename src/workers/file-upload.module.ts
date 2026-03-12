import { Module } from '@nestjs/common';
import { FileUploadController } from './file-upload.controller';
import { S3Module } from '@/s3/s3.module';
import { RabbitmqModule } from '@/rabbitmq/rabbitmq.module';

@Module({
  imports: [S3Module, RabbitmqModule],
  controllers: [FileUploadController],
})
export class FileUploadModule {}
