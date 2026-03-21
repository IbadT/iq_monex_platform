import { ApiOperation, ApiResponse, ApiTags, ApiParam } from '@nestjs/swagger';
import { applyDecorators } from '@nestjs/common';

export const ApiGetReviewByIdDocs = () => {
  return applyDecorators(
    ApiTags('Reviews'),
    ApiOperation({
      summary: 'Получить отзыв по ID',
      description: 'Возвращает детальную информацию об отзыве по его UUID',
    }),

    ApiParam({
      name: 'id',
      description: 'UUID отзыва',
      type: 'string',
      example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    ApiResponse({
      status: 200,
      description: 'Отзыв успешно найден',
      schema: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            example: '123e4567-e89b-12d3-a456-426614174000',
            description: 'UUID отзыва',
          },
          authorId: {
            type: 'string',
            example: '123e4567-e89b-12d3-a456-426614174000',
            description: 'ID автора отзыва',
          },
          listingId: {
            type: 'string',
            example: '123e4567-e89b-12d3-a456-426614174000',
            description: 'ID объявления',
          },
          targetType: {
            type: 'string',
            enum: ['LISTING'],
            example: 'LISTING',
            description: 'Тип цели отзыва',
          },
          title: {
            type: 'string',
            example: 'Отличное объявление',
            description: 'Заголовок отзыва',
          },
          content: {
            type: 'string',
            example:
              'Продавец очень вежливый, товар соответствует описанию. Рекомендую!',
            description: 'Содержание отзыва',
          },
          rating: {
            type: 'number',
            example: 5,
            minimum: 1,
            maximum: 5,
            description: 'Рейтинг от 1 до 5',
          },
          createdAt: {
            type: 'string',
            example: '2024-01-15T10:30:00Z',
            description: 'Дата создания отзыва',
          },
          updatedAt: {
            type: 'string',
            example: '2024-01-15T10:30:00Z',
            description: 'Дата обновления отзыва',
          },
          likes: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: {
                  type: 'string',
                  example: '123e4567-e89b-12d3-a456-426614174000',
                },
                userId: {
                  type: 'string',
                  example: '123e4567-e89b-12d3-a456-426614174000',
                },
              },
            },
            description: 'Список лайков отзыва',
          },
          author: {
            type: 'object',
            properties: {
              id: {
                type: 'string',
                example: '123e4567-e89b-12d3-a456-426614174000',
                description: 'ID пользователя',
              },
              name: {
                type: 'string',
                example: 'Иван Иванов',
                description: 'Имя пользователя',
              },
            },
            description: 'Информация об авторе отзыва',
          },
          files: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: {
                  type: 'string',
                  example: '123e4567-e89b-12d3-a456-426614174000',
                },
                url: {
                  type: 'string',
                  example: 'https://example.com/file.jpg',
                  description: 'URL файла',
                },
                fileName: {
                  type: 'string',
                  example: 'photo_0.jpg',
                  description: 'Имя файла',
                },
                fileType: {
                  type: 'string',
                  example: 'image/jpeg',
                  description: 'Тип файла',
                },
                fileSize: {
                  type: 'number',
                  example: 1024,
                  description: 'Размер файла в байтах',
                },
              },
            },
            description: 'Список прикрепленных файлов',
          },
        },
      },
    }),

    ApiResponse({
      status: 404,
      description: 'Отзыв не найден',
      schema: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          message: { type: 'string', example: 'Review not found' },
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
