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
import { 
  ApiGetFavoritesListDocs,
  ApiCreateFavoriteDocs,
  ApiAddFavoriteToUserDocs,
  ApiDeleteFavoriteDocs,
  ApiGetFavoriteByIdDocs,
  ApiGetUserFavoritesDocs,
} from './decorators';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { FavoriteByIdResponseDto } from './dto/response/favorite-by-id-response.dto';
import { FavoriteUserProfileResponseDto } from './dto/response/favorite-user-profile-response.dto';
import { ApiTags } from '@nestjs/swagger';
import { AddFavoriteToUserDto } from './dto/add-favorite-to-user.dto';
import { CreateFavoriteResponseDto } from './dto/response/create-favorite-response.dto';

@ApiTags('Favorites')
@Controller('favorites')
export class FavoriteController {
  constructor(
    private readonly favoriteService: FavoriteService,
    private readonly logger: AppLogger,
  ) {}

  @Get(':id')
  @Protected()
  @ApiGetFavoriteByIdDocs()
  async getFavorites(@Param('id', ParseUUIDPipe) id: string): Promise<FavoriteByIdResponseDto | null> {
    this.logger.log(`Получение избранных объявлений по id: ${id}`);
    return await this.favoriteService.getById(id);
  }

  @Get('')
  @Protected()
  @ApiGetFavoritesListDocs()
  async getList(@CurrentUser() user: JwtPayload): Promise<FavoriteByIdResponseDto[]> {
    this.logger.log('Получить все объявления в избранном');
    return await this.favoriteService.getList(user.id);
  }

  @Post()
  @Protected()
  @ApiCreateFavoriteDocs()
  async createFavorite(
    @CurrentUser() user: JwtPayload,
    @Body() body: CreateFavoriteDto,
  ): Promise<CreateFavoriteResponseDto> {
    this.logger.log('Добавить объявление в избранное');
    return await this.favoriteService.create(user.id, body);
  }

  @Get("users")
  @Protected()
  @ApiGetUserFavoritesDocs()
  async favoriteUsers(@CurrentUser() user: JwtPayload): Promise<FavoriteUserProfileResponseDto[]> {
    return await this.favoriteService.favoriteUsers(user.id);
  }

  @Post('users')
  @Protected()
  @ApiAddFavoriteToUserDocs()
  async addFavoriteToUser(
    @CurrentUser() user: JwtPayload,
    @Body() body: AddFavoriteToUserDto,
  ): Promise<CreateFavoriteResponseDto> {
    return await this.favoriteService.addFavoriteToUser(user.id, body);
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
