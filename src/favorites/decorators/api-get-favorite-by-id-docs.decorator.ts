import { ApiOperation, ApiResponse, ApiTags, ApiParam } from '@nestjs/swagger';
import { applyDecorators } from '@nestjs/common';
import { FavoriteByIdResponseDto } from '../dto/response/favorite-by-id-response.dto';

export const ApiGetFavoriteByIdDocs = () => {
  return applyDecorators(
    ApiTags('Favorites'),
    ApiOperation({
      summary: 'Получить избранный по ID',
      description:
        'Возвращает конкретную запись из избранного с полной информацией об объявлении',
    }),
    ApiParam({
      name: 'id',
      description: 'UUID записи в избранном',
      type: 'string',
      example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    ApiResponse({
      status: 200,
      description: 'Запись из избранного успешно найдена',
      type: FavoriteByIdResponseDto,
    }),
    ApiResponse({
      status: 404,
      description: 'Запись в избранном не найдена',
      schema: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: false,
          },
          message: {
            type: 'string',
            example: 'Favorite not found',
          },
          error: {
            type: 'string',
            example: 'Not Found',
          },
          statusCode: {
            type: 'number',
            example: 404,
          },
        },
      },
    }),
    ApiResponse({
      status: 401,
      description: 'Не авторизован',
      schema: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: false,
          },
          message: {
            type: 'string',
            example: 'Unauthorized',
          },
          error: {
            type: 'string',
            example: 'Unauthorized',
          },
          statusCode: {
            type: 'number',
            example: 401,
          },
        },
      },
    }),
    ApiResponse({
      status: 400,
      description: 'Некорректный UUID',
      schema: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: false,
          },
          message: {
            type: 'string',
            example: 'Invalid UUID format',
          },
          error: {
            type: 'string',
            example: 'Bad Request',
          },
          statusCode: {
            type: 'number',
            example: 400,
          },
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
