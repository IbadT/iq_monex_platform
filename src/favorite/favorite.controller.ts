import { Controller, Delete, Get, Post } from '@nestjs/common';
import { FavoriteService } from './favorite.service';
import { AppLogger } from '@/common/logger/logger.service';

@Controller('favorite')
export class FavoriteController {
  constructor(
    private readonly favoriteService: FavoriteService,
    private readonly logger: AppLogger,
  ) {}

  @Get('')
  async getFavorites() {
    this.logger.log(`Получение избранных объявлений по id: ${123}`);
    return await this.favoriteService.getById();
  }

  @Get('')
  async getList() {
    this.logger.log('Получить все объявления в избранном');
    return await this.favoriteService.getList();
  }

  @Post('')
  async createFavorite() {
    this.logger.log('Добавить объявление в избранное');
    return await this.favoriteService.create();
  }

  // удалить из избранного
  @Delete('')
  async deleteFavorite() {
    this.logger.log('Удалить объявление из избранного');
    return await this.favoriteService.delete();
  }
}
