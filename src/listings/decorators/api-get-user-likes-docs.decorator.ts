import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

export const ApiGetUserLikesDocs = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Получить лайки пользователя',
      description:
        'Возвращает список всех объявлений, которые лайкнул указанный пользователь.',
    }),
    ApiParam({
      name: 'userId',
      description: 'ID пользователя',
      type: 'string',
      format: 'uuid',
    }),
    ApiResponse({
      status: 200,
      description: 'Список лайков пользователя получен',
      schema: {
        example: {
          userId: 'uuid',
          likesCount: 15,
          likedListings: [
            {
              id: 'uuid',
              title: 'Заголовок объявления 1',
              price: '1000.00',
              currency: { code: 'RUB', symbol: '₽' },
              category: { name: 'Электроника' },
              files: [
                {
                  id: 'uuid',
                  url: 'https://example.com/image.jpg',
                  fileType: 'image/jpeg',
                },
              ],
            },
          ],
        },
      },
    }),
    ApiResponse({
      status: 404,
      description: 'Пользователь не найден',
    }),
    ApiResponse({
      status: 500,
      description: 'Внутренняя ошибка сервера',
    }),
  );
