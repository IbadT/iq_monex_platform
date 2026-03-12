import { Module } from '@nestjs/common';
import { S3Service } from './s3.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [S3Service, ConfigService],
  exports: [S3Service],
})
export class S3Module {}
