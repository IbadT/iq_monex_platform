import { ApiOperation, ApiResponse, ApiTags, ApiParam, ApiBody } from '@nestjs/swagger';
import { UpdateReviewDto } from '../dto/update-review.dto';
import { applyDecorators } from '@nestjs/common';

export const ApiUpdateReviewDocs = () => {
  return applyDecorators(
    ApiTags('Reviews'),
    ApiOperation({
      summary: 'Обновить отзыв',
      description: 'Обновляет существующий отзыв. Только для администраторов.',
    }),

    ApiParam({
      name: 'id',
      description: 'UUID отзыва для обновления',
      type: 'string',
      example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    ApiBody({
      type: UpdateReviewDto,
      description: 'Данные для обновления отзыва',
      examples: {
        fullUpdate: {
          summary: 'Полное обновление',
          description: 'Обновление всех полей отзыва',
          value: {
            title: 'Обновленный заголовок',
            content: 'Обновленное содержание отзыва с дополнительной информацией',
            rating: 4,
          },
        },
        partialUpdate: {
          summary: 'Частичное обновление',
          description: 'Обновление только некоторых полей',
          value: {
            title: 'Новый заголовок',
          },
        },
        ratingUpdate: {
          summary: 'Обновление рейтинга',
          description: 'Изменение только рейтинга',
          value: {
            rating: 3,
          },
        },
      },
    }),

    ApiResponse({
      status: 200,
      description: 'Отзыв успешно обновлен',
      schema: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          message: { type: 'string', example: 'Review updated successfully' },
          data: {
            type: 'object',
            properties: {
              id: {
                type: 'string',
                example: '123e4567-e89b-12d3-a456-426614174000',
                description: 'UUID обновленного отзыва',
              },
              title: {
                type: 'string',
                example: 'Обновленный заголовок',
                description: 'Новый заголовок отзыва',
              },
              content: {
                type: 'string',
                example: 'Обновленное содержание отзыва с дополнительной информацией',
                description: 'Новое содержание отзыва',
              },
              rating: {
                type: 'number',
                example: 4,
                minimum: 1,
                maximum: 5,
                description: 'Новый рейтинг от 1 до 5',
              },
              updatedAt: {
                type: 'string',
                example: '2024-01-15T11:30:00Z',
                description: 'Дата обновления отзыва',
              },
            },
          },
        },
      },
    }),

    ApiResponse({
      status: 400,
      description: 'Ошибка валидации',
      schema: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          message: {
            type: 'array',
            example: ['rating must be less than or equal to 5', 'title must be a string'],
          },
          error: { type: 'string', example: 'Bad Request' },
          statusCode: { type: 'number', example: 400 },
        },
      },
    }),

    ApiResponse({
      status: 403,
      description: 'Доступ запрещен',
      schema: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          message: { type: 'string', example: 'Admin access required' },
          error: { type: 'string', example: 'Forbidden' },
          statusCode: { type: 'number', example: 403 },
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
    })
  );
};
