import { Module } from '@nestjs/common';
import { WorkersService } from './workers.service';
import { WorkersController } from './workers.controller';
import { S3Module } from '@/s3/s3.module';

@Module({
  imports: [S3Module],
  controllers: [WorkersController],
  providers: [WorkersService],
})
export class WorkersModule {}
