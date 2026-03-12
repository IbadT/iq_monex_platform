import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { FavoriteService } from './favorites.service';
import { AppLogger } from '@/common/logger/logger.service';
import { Protected } from '@/common/decorators';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { JwtPayload } from '@/common/interfaces/jwt-payload.interface';
import { ApiCreateFavoriteDocs } from './decorators/api-create-favorite-docs.decorator';
import { ApiDeleteFavoriteDocs } from './decorators/api-delete-favorite-docs.decorator';
import { ApiGetFavoriteByIdDocs } from './decorators/api-get-favorite-by-id-docs.decorator';
import { ApiGetFavoritesListDocs } from './decorators/api-get-favorites-list-docs.decorator';
import { CreateFavoriteDto } from './dto/create-favorite.dto';

@Controller('favorite')
export class FavoriteController {
  constructor(
    private readonly favoriteService: FavoriteService,
    private readonly logger: AppLogger,
  ) {}

  @Get(':id')
  @Protected()
  @ApiGetFavoriteByIdDocs()
  async getFavorites(@Param('id', ParseUUIDPipe) id: string) {
    this.logger.log(`Получение избранных объявлений по id: ${id}`);
    return await this.favoriteService.getById(id);
  }

  @Get('')
  @Protected()
  @ApiGetFavoritesListDocs()
  async getList(@CurrentUser() user: JwtPayload) {
    this.logger.log('Получить все объявления в избранном');
    return await this.favoriteService.getList(user.id);
  }

  @Post('')
  @Protected()
  @ApiCreateFavoriteDocs()
  async createFavorite(
    @CurrentUser() user: JwtPayload,
    @Body() body: CreateFavoriteDto,
  ) {
    this.logger.log('Добавить объявление в избранное');
    return await this.favoriteService.create(user.id, body);
  }

  // удалить из избранного
  @Delete(':id')
  @Protected()
  @ApiDeleteFavoriteDocs()
  async deleteFavorite(@Param('id', ParseUUIDPipe) id: string) {
    this.logger.log(`Удалить объявление из избранного по id: ${id}`);
    return await this.favoriteService.delete(id);
  }
}
