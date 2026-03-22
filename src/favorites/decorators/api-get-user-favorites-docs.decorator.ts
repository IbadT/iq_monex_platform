import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { HttpStatus } from '@nestjs/common';

export const ApiGetUserFavoritesDocs = () => {
  return applyDecorators(
    ApiOperation({
      summary: 'Получить избранные профили пользователей',
      description:
        'Возвращает список избранных профилей пользователей с полной информацией о каждом профиле',
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
              description: 'UUID записи в избранном',
              example: '885eb360-9337-4f7c-923c-2180fb886634',
            },
            userId: {
              type: 'string',
              format: 'uuid',
              description: 'UUID пользователя',
              example: 'bcea00ce-0a3b-4063-9289-1fd63662cbd3',
            },
            type: {
              type: 'string',
              example: 'USER',
              description: 'Тип избранного',
              enum: ['LISTING', 'USER'],
            },
            targetUserId: {
              type: 'string',
              format: 'uuid',
              description: 'UUID целевого пользователя',
              example: 'target-user-uuid-123',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Дата создания записи',
              example: '2026-03-22T15:52:13.768Z',
            },
            user: {
              type: 'object',
              description: 'Информация о пользователе',
              properties: {
                id: {
                  type: 'string',
                  format: 'uuid',
                  description: 'UUID пользователя',
                  example: 'bcea00ce-0a3b-4063-9289-1fd63662cbd3',
                },
                profile: {
                  type: 'object',
                  description: 'Профиль пользователя',
                  properties: {
                    id: {
                      type: 'string',
                      format: 'uuid',
                      description: 'UUID профиля',
                      example: 'profile-uuid-123',
                    },
                    userId: {
                      type: 'string',
                      format: 'uuid',
                      description: 'UUID пользователя',
                      example: 'bcea00ce-0a3b-4063-9289-1fd63662cbd3',
                    },
                    name: {
                      type: 'string',
                      description: 'Имя пользователя',
                      example: 'Иван Иванов',
                    },
                    description: {
                      type: 'string',
                      description: 'Описание профиля',
                      example: 'Опытный специалист в своей области',
                    },
                    avatar: {
                      type: 'string',
                      description: 'URL аватара',
                      example: 'https://example.com/avatar.jpg',
                    },
                    rating: {
                      type: 'number',
                      description: 'Рейтинг профиля',
                      example: 4.5,
                    },
                    reviewsCount: {
                      type: 'integer',
                      description: 'Количество отзывов',
                      example: 12,
                    },
                    createdAt: {
                      type: 'string',
                      format: 'date-time',
                      description: 'Дата создания профиля',
                      example: '2026-03-20T02:11:55.004Z',
                    },
                    updatedAt: {
                      type: 'string',
                      format: 'date-time',
                      description: 'Дата обновления профиля',
                      example: '2026-03-20T02:31:17.135Z',
                    },
                  },
                },
              },
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
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      description: 'Внутренняя ошибка сервера',
      schema: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: false,
          },
          message: {
            type: 'string',
            example: 'Internal server error',
          },
          error: {
            type: 'string',
            example: 'Server Error',
          },
          statusCode: {
            type: 'number',
            example: 500,
          },
        },
      },
    }),
  );
};
