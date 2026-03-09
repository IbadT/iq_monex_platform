import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

export const ApiGetListingLikesDocs = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Получить все лайки объявления',
      description: 'Возвращает список всех пользователей, которые лайкнули указанное объявление.',
    }),
    ApiParam({
      name: 'listingId',
      description: 'ID объявления',
      type: 'string',
      format: 'uuid',
    }),
    ApiResponse({
      status: 200,
      description: 'Список лайков получен',
      schema: {
        example: {
          listingId: 'uuid',
          likesCount: 42,
          likes: [
            {
              id: 'uuid',
              createdAt: '2026-03-09T18:47:00.000Z',
              user: {
                id: 'uuid',
                name: 'Имя пользователя',
                email: 'user@example.com',
              },
            },
          ],
        },
      },
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
