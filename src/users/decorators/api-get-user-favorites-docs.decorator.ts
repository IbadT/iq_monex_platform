import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { HttpStatus } from '@nestjs/common';

export function ApiGetUserFavoritesDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Получить избранные профили',
      description: 'Возвращает список избранных профилей пользователя',
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Список избранных профилей успешно получен',
      schema: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'ID избранного элемента',
              example: '550e8400-e29b-41d4-a716-446655440000',
            },
            userId: {
              type: 'string',
              format: 'uuid',
              description: 'ID пользователя',
              example: '123e4567-e89b-12d3-a456-426614174000',
            },
            targetUserId: {
              type: 'string',
              format: 'uuid',
              description: 'ID пользователя в избранном',
              example: '456e7890-f12a-34b5-c678-532614174111',
            },
            type: {
              type: 'string',
              description: 'Тип избранного элемента',
              example: 'USER',
              enum: ['USER', 'LISTING'],
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Дата добавления в избранное',
              example: '2024-01-01T00:00:00.000Z',
            },
          },
        },
      },
    }),
    ApiResponse({
      status: HttpStatus.UNAUTHORIZED,
      description: 'Требуется аутентификация',
      schema: {
        type: 'object',
        properties: {
          statusCode: {
            type: 'integer',
            example: 401,
          },
          message: {
            type: 'string',
            example: 'Unauthorized',
          },
        },
      },
    }),
    ApiResponse({
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      description: 'Внутренняя ошибка сервера',
      schema: {
        type: 'object',
        properties: {
          statusCode: {
            type: 'integer',
            example: 500,
          },
          message: {
            type: 'string',
            example: 'Internal server error',
          },
        },
      },
    }),
  );
}
