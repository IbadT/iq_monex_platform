import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

export const ApiGetListingLikesDocs = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Получить все лайки объявления',
      description:
        'Возвращает список всех пользователей, которые лайкнули указанное объявление.',
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
          listingId: 'bcea00ce-0a3b-4063-9289-1fd63662cbd3',
          likesCount: 42,
          likes: [
            {
              id: 'bcea00ce-0a3b-4063-9289-1fd63662cbd3',
              listingIId: 'bcea00ce-0a3b-4063-9289-1fd63662cbd3',
              userId: 'bcea00ce-0a3b-4063-9289-1fd63662cbd3',
              createdAt: '2026-03-09T18:47:00.000Z',
              user: {
                id: 'bcea00ce-0a3b-4063-9289-1fd63662cbd3',
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
