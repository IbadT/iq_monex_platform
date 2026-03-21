import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { applyDecorators } from '@nestjs/common';

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
      schema: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              example: '123e4567-e89b-12d3-a456-426614174000',
              description: 'UUID записи в избранном',
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
            listing: {
              type: 'object',
              properties: {
                id: {
                  type: 'string',
                  example: '123e4567-e89b-12d3-a456-426614174000',
                  description: 'UUID объявления',
                },
                title: {
                  type: 'string',
                  example: 'Продам iPhone 15 Pro',
                  description: 'Заголовок объявления',
                },
                description: {
                  type: 'string',
                  example: 'Отличное состояние, использовался 3 месяца',
                  description: 'Описание объявления',
                },
                price: {
                  type: 'number',
                  example: 85000,
                  description: 'Цена объявления',
                },
                status: {
                  type: 'string',
                  enum: ['DRAFT', 'PUBLISHED', 'ARCHIVED', 'TEMPLATE'],
                  example: 'PUBLISHED',
                  description: 'Статус объявления',
                },
                createdAt: {
                  type: 'string',
                  example: '2024-01-10T15:20:00Z',
                  description: 'Дата создания объявления',
                },
              },
              description: 'Информация об объявлении',
            },
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
