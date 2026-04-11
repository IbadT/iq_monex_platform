import { ApiOperation, ApiResponse, ApiTags, ApiParam } from '@nestjs/swagger';
import { applyDecorators } from '@nestjs/common';

export const ApiDeleteListingFavoriteDocs = () => {
  return applyDecorators(
    ApiTags('Favorites'),
    ApiOperation({
      summary: 'Удалить объявление из избранного',
      description:
        'Удаляет объявление из списка избранных для текущего пользователя по ID объявления',
    }),
    ApiParam({
      name: 'id',
      description: 'UUID объявления для удаления из избранного',
      type: 'string',
      example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    ApiResponse({
      status: 204,
      description: 'Объявление успешно удалено из избранного (No Content)',
    }),
    ApiResponse({
      status: 404,
      description: 'Объявление не найдено в избранном',
      schema: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          message: { type: 'string', example: 'Объявление не найдено в избранном' },
          error: { type: 'string', example: 'Not Found' },
          statusCode: { type: 'number', example: 404 },
        },
      },
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
      status: 400,
      description: 'Некорректный UUID',
      schema: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          message: { type: 'string', example: 'Invalid UUID format' },
          error: { type: 'string', example: 'Bad Request' },
          statusCode: { type: 'number', example: 400 },
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
