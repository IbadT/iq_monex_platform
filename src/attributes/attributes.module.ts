import { Module } from '@nestjs/common';
import { AttributesService } from './attributes.service';
import { AttributesController } from './attributes.controller';
import { CacheService } from '@/cache/cacheService.service';

@Module({
  controllers: [AttributesController],
  providers: [AttributesService, CacheService],
})
export class AttributesModule {}
