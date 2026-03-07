import { Module } from '@nestjs/common';
import { DictionariesService } from './dictionaries.service';
import { DictionariesController } from './dictionaries.controller';
import { CacheService } from '@/cache/cacheService.service';

@Module({
  controllers: [DictionariesController],
  providers: [DictionariesService, CacheService],
})
export class DictionariesModule {}
