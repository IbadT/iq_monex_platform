import { Module } from '@nestjs/common';
import { WorkersService } from './workers.service';
import { WorkersController } from './workers.controller';
import { S3Module } from '@/s3/s3.module';
import { JwtAuthModule } from '@/auth/jwt/jwt.module';

@Module({
  imports: [S3Module, JwtAuthModule],
  controllers: [WorkersController],
  providers: [WorkersService],
})
export class WorkersModule {}
