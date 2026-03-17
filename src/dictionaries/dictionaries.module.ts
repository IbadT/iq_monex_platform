import { Module } from '@nestjs/common';
import { DictionariesService } from './dictionaries.service';
import { DictionariesController } from './dictionaries.controller';
import { CacheService } from '@/cache/cacheService.service';
import { ConfigService } from '@nestjs/config';

@Module({
  controllers: [DictionariesController],
  providers: [DictionariesService, CacheService, ConfigService],
})
export class DictionariesModule {}
