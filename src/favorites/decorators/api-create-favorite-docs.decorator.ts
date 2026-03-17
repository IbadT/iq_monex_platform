import { ApiOperation, ApiResponse, ApiTags, ApiBody } from '@nestjs/swagger';
import { CreateFavoriteDto } from '../dto/create-favorite.dto';
import { applyDecorators } from '@nestjs/common';

export const ApiCreateFavoriteDocs = () => {
  return applyDecorators(
    ApiTags('Favorites'),
    ApiOperation({
      summary: 'Добавить объявление в избранное',
      description: 'Добавляет объявление в список избранных для текущего пользователя',
    }),
    ApiBody({
      type: CreateFavoriteDto,
      description: 'Данные для добавления объявления в избранное',
      examples: {
        addFavorite: {
          summary: 'Добавить в избранное',
          description: 'Добавить объявление в избранное',
          value: {
            listingId: '123e4567-e89b-12d3-a456-426614174000',
          },
        },
      },
    }),
    ApiResponse({
      status: 201,
      description: 'Объявление успешно добавлено в избранное',
      schema: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            example: '123e4567-e89b-12d3-a456-426614174000',
            description: 'UUID созданной записи в избранном',
          },
          userId: {
            type: 'string',
            example: '123e4567-e89b-12d3-a456-426614174000',
            description: 'ID пользователя',
          },
          listingId: {
            type: 'string',
            example: '123e4567-e89b-12d3-a456-426614174000',
            description: 'ID объявления',
          },
          createdAt: {
            type: 'string',
            example: '2024-01-15T10:30:00Z',
            description: 'Дата добавления в избранное',
          },
        },
      },
    }),
    ApiResponse({
      status: 400,
      description: 'Ошибка валидации или объявление уже в избранном',
      schema: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          message: { type: 'string', example: 'Listing already in favorites' },
          error: { type: 'string', example: 'Bad Request' },
          statusCode: { type: 'number', example: 400 },
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
      status: 404,
      description: 'Объявление не найдено',
      schema: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          message: { type: 'string', example: 'Listing not found' },
          error: { type: 'string', example: 'Not Found' },
          statusCode: { type: 'number', example: 404 },
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
    })
  );
};
