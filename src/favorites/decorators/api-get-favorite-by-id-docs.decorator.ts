import { ApiOperation, ApiResponse, ApiTags, ApiParam } from '@nestjs/swagger';
import { applyDecorators } from '@nestjs/common';

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
      schema: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            example: '17489921-4fcd-4519-90d5-95d1a326b7be',
            description: 'UUID записи в избранном',
          },
          userId: {
            type: 'string',
            example: 'bcea00ce-0a3b-4063-9289-1fd63662cbd3',
            description: 'ID пользователя',
          },
          listing: {
            type: 'object',
            description: 'Информация об объявлении',
            properties: {
              id: {
                type: 'string',
                example: '17489921-4fcd-4519-90d5-95d1a326b7be',
                description: 'UUID объявления',
              },
              userId: {
                type: 'string',
                example: 'bcea00ce-0a3b-4063-9289-1fd63662cbd3',
                description: 'ID пользователя',
              },
              categoryId: {
                type: 'integer',
                example: 1,
                description: 'ID категории',
              },
              rating: {
                type: 'number',
                example: 0,
                description: 'Рейтинг объявления',
              },
              reviewsCount: {
                type: 'integer',
                example: 0,
                description: 'Количество отзывов',
              },
              title: {
                type: 'string',
                example: 'iPhone 13 Pro Max',
                description: 'Заголовок объявления',
              },
              description: {
                type: 'string',
                example: 'Отличное состояние, использовался 6 месяцев',
                description: 'Описание объявления',
              },
              status: {
                type: 'string',
                example: 'TEMPLATE',
                description: 'Статус объявления',
              },
              price: {
                type: 'number',
                example: 85000,
                description: 'Цена объявления',
              },
              currencyId: {
                type: 'integer',
                example: 1,
                description: 'ID валюты',
              },
              priceUnitId: {
                type: 'integer',
                example: 1,
                description: 'ID единицы измерения цены',
              },
              condition: {
                type: 'string',
                example: 'USED',
                description: 'Состояние товара',
              },
              viewsCount: {
                type: 'integer',
                example: 0,
                description: 'Количество просмотров',
              },
              favoritesCount: {
                type: 'integer',
                example: 0,
                description: 'Количество добавлений в избранное',
              },
              likesCount: {
                type: 'integer',
                example: 0,
                description: 'Количество лайков',
              },
              version: {
                type: 'integer',
                example: 0,
                description: 'Версия объявления',
              },
              publishedAt: {
                type: 'string',
                format: 'date-time',
                example: null,
                description: 'Дата публикации',
              },
              archivedAt: {
                type: 'string',
                format: 'date-time',
                example: null,
                description: 'Дата архивации',
              },
              autoDeleteAt: {
                type: 'string',
                format: 'date-time',
                example: null,
                description: 'Дата автоудаления',
              },
              lastUsedAt: {
                type: 'string',
                format: 'date-time',
                example: null,
                description: 'Дата последнего использования',
              },
              createdAt: {
                type: 'string',
                format: 'date-time',
                example: '2026-03-20T02:11:55.004Z',
                description: 'Дата создания объявления',
              },
              updatedAt: {
                type: 'string',
                format: 'date-time',
                example: '2026-03-20T02:31:17.135Z',
                description: 'Дата обновления объявления',
              },
            },
          },
        },
      },
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
