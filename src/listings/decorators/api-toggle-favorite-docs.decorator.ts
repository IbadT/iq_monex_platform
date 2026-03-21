import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiProperty,
  ApiQuery,
} from '@nestjs/swagger';
import { FavoriteListingsResponseDto } from '../dto/response/favorite-listings-response.dto';
import { Favorite } from '@/favorites/entities/favorite.entity';

// DTO для ответа при добавлении в избранное
class FavoriteActionResponseDto {
  @ApiProperty({
    description: 'Действие, выполненное с избранным',
    enum: ['added', 'removed'],
    example: 'added',
  })
  action: 'added' | 'removed';

  @ApiProperty({
    description: 'ID удаленного избранного (только для action: removed)',
    required: false,
    example: 123,
  })
  favoriteId?: number;

  @ApiProperty({
    description: 'Информация о новом избранном (только для action: added)',
    required: false,
  })
  favorite?: Favorite;

  constructor(
    action: 'added' | 'removed',
    favoriteId?: number,
    favorite?: any,
  ) {
    this.action = action;
    if (favoriteId) {
      this.favoriteId = favoriteId;
    }
    this.favorite = favorite;
  }
}

// Декоратор для добавления/удаления избранного
export const ApiToggleFavoriteDocs = () => {
  return applyDecorators(
    ApiOperation({
      summary: 'Toggle favorite listing',
      description: 'Add listing to favorites or remove if already favorited',
    }),
    ApiResponse({
      status: 200,
      description: 'Listing successfully added to or removed from favorites',
      type: FavoriteActionResponseDto,
    }),
    ApiResponse({
      status: 400,
      description: 'Bad Request - Listing not found or invalid status',
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized - User not authenticated',
    }),
  );
};

// Декоратор для получения списка избранных
export const ApiGetFavoritesDocs = () => {
  return applyDecorators(
    ApiOperation({
      summary: 'Get user favorite listings',
      description: 'Retrieve paginated list of user favorite listings',
    }),
    ApiQuery({
      name: 'limit',
      description: 'Максимальное количество полученных элементов',
      required: false,
      example: 10,
      type: 'number',
    }),
    ApiQuery({
      name: 'offset',
      description: 'Количество элементов для пропуска',
      required: false,
      example: 0,
      type: 'number',
    }),
    ApiResponse({
      status: 200,
      description: 'List of favorite listings retrieved successfully',
      type: FavoriteListingsResponseDto,
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized - User not authenticated',
    }),
  );
};
