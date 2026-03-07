import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { CacheService } from '@/cache/cacheService.service';

@Module({
  controllers: [CategoriesController],
  providers: [CategoriesService, CacheService],
})
export class CategoriesModule {}
