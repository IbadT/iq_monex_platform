import { Module } from '@nestjs/common';
import { FileUploadController } from './file-upload.controller';
import { S3Module } from '@/s3/s3.module';
import { RabbitmqModule } from '@/rabbitmq/rabbitmq.module';
import { WorkersModule } from './workers.module';

@Module({
  imports: [S3Module, RabbitmqModule, WorkersModule],
  controllers: [FileUploadController],
})
export class FileUploadModule {}
