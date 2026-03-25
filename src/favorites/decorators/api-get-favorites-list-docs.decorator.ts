import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { applyDecorators } from '@nestjs/common';
import { FavoriteByIdResponseDto } from '../dto/response/favorite-by-id-response.dto';

export const ApiGetFavoritesListDocs = () => {
  return applyDecorators(
    ApiTags('Favorites'),
    ApiOperation({
      summary: 'Получить список избранных объявлений',
      description:
        'Возвращает все избранные объявления текущего пользователя с полной информацией об объявлениях',
    }),
    ApiResponse({
      status: 200,
      description: 'Список избранных объявлений успешно получен',
      type: FavoriteByIdResponseDto,
      isArray: true,
    }),
    ApiResponse({
      status: 401,
      description: 'Не авторизован',
      schema: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          message: { type: 'string', example: 'Unauthorized' },
          error: { type: 'string', example: 'Unauthorized' },
          statusCode: { type: 'number', example: 401 },
        },
      },
    }),
    ApiResponse({
      status: 500,
      description: 'Внутренняя ошибка сервера',
      schema: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          message: { type: 'string', example: 'Internal Server Error' },
          error: { type: 'string', example: 'Internal Server Error' },
          statusCode: { type: 'number', example: 500 },
        },
      },
    }),
  );
};
