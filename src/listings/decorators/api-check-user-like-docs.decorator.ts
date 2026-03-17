import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

export const ApiCheckUserLikeDocs = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Проверить лайк пользователя',
      description: 'Проверяет, лайкнул ли текущий пользователь указанное объявление. Требует авторизации.',
    }),
    ApiParam({
      name: 'listingId',
      description: 'ID объявления',
      type: 'string',
      format: 'uuid',
    }),
    ApiResponse({
      status: 200,
      description: 'Статус лайка получен',
      schema: {
        example: {
          hasLiked: true,
          likeInfo: {
            id: 'uuid',
            createdAt: '2026-03-09T18:47:00.000Z',
          },
        },
      },
    }),
    ApiResponse({
      status: 200,
      description: 'Пользователь не лайкал объявление',
      schema: {
        example: {
          hasLiked: false,
          likeInfo: null,
        },
      },
    }),
    ApiResponse({
      status: 401,
      description: 'Не авторизован',
    }),
    ApiResponse({
      status: 404,
      description: 'Объявление не найдено',
    }),
    ApiResponse({
      status: 500,
      description: 'Внутренняя ошибка сервера',
    }),
  );
