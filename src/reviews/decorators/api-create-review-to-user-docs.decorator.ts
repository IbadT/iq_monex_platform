import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';
import { HttpStatus } from '@nestjs/common';
import { CreateReviewToUserDto } from '../dto/create-review.to-user.dto';

export function ApiCreateReviewToUserDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Оставить отзыв пользователю',
      description:
        'Создает отзыв для указанного пользователя с возможностью добавления фотографий',
    }),
    ApiBody({
      description: 'Данные для создания отзыва пользователю',
      type: CreateReviewToUserDto,
    }),
    ApiResponse({
      status: HttpStatus.CREATED,
      description: 'Отзыв пользователю успешно создан',
      schema: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            format: 'uuid',
            description: 'ID созданного отзыва',
            example: '550e8400-e29b-41d4-a716-446655440000',
          },
          listingId: {
            type: 'string',
            format: 'uuid',
            description: 'ID объявления (null для отзыва пользователю)',
            example: null,
          },
          title: {
            type: 'string',
            description: 'Заголовок объявления (null для отзыва пользователю)',
            example: null,
          },
          status: {
            type: 'string',
            description: 'Статус объявления (null для отзыва пользователю)',
            example: null,
          },
          likesCount: {
            type: 'integer',
            description: 'Количество лайков (null для отзыва пользователю)',
            example: null,
          },
          reportsCount: {
            type: 'integer',
            description: 'Количество жалоб (null для отзыва пользователю)',
            example: null,
          },
          replyContent: {
            type: 'string',
            description: 'Текст ответа на отзыв (null если нет ответа)',
            example: null,
          },
          replyAt: {
            type: 'string',
            format: 'date-time',
            description: 'Дата ответа на отзыв (null если нет ответа)',
            example: null,
          },
          replyAuthorId: {
            type: 'string',
            format: 'uuid',
            description: 'ID автора ответа (null если нет ответа)',
            example: null,
          },
          targetUserId: {
            type: 'string',
            format: 'uuid',
            description: 'ID пользователя, которому оставлен отзыв',
            example: '123e4567-e89b-12d3-a456-426614174001',
          },
          targetType: {
            type: 'string',
            description: 'Тип объекта отзыва',
            example: 'USER',
            enum: ['USER', 'LISTING'],
          },
          authorId: {
            type: 'string',
            format: 'uuid',
            description: 'ID автора отзыва',
            example: '123e4567-e89b-12d3-a456-426614174000',
          },
          content: {
            type: 'string',
            description: 'Текст отзыва',
            example: 'Отличный мастер, рекомендую!',
          },
          rating: {
            type: 'integer',
            description: 'Оценка от 1 до 5',
            example: 5,
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
            description: 'Дата создания отзыва',
            example: '2024-01-01T00:00:00.000Z',
          },
        },
      },
    }),
    ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: 'Ошибка в запросе',
      schema: {
        type: 'object',
        properties: {
          statusCode: {
            type: 'integer',
            example: 400,
          },
          message: {
            type: 'string',
            example: 'Пользователь не может оставить себе комментарий',
          },
        },
      },
    }),
    ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'Пользователь не найден',
      schema: {
        type: 'object',
        properties: {
          statusCode: {
            type: 'integer',
            example: 404,
          },
          message: {
            type: 'string',
            example: 'Пользователь не найден',
          },
        },
      },
    }),
    ApiResponse({
      status: HttpStatus.CONFLICT,
      description: 'Конфликт данных',
      schema: {
        type: 'object',
        properties: {
          statusCode: {
            type: 'integer',
            example: 409,
          },
          message: {
            type: 'string',
            example: 'Отзыв уже существует',
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
