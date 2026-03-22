import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { SendLikeDto } from '../dto/request/send-like.dto';

export const ApiToggleLikeDocs = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Переключить лайк объявления',
      description:
        'Добавляет лайк, если его нет, или удаляет, если он уже есть. Toggle функционал для лайков.',
    }),
    ApiBody({
      type: SendLikeDto,
      description: 'ID объявления для лайка',
    }),
    ApiResponse({
      status: 200,
      description: 'Лайк успешно добавлен',
      schema: {
        example: {
          message: 'Лайк успешно добавлен',
          action: 'liked',
          like: {
            id: '9d9412a4-37e2-43a1-8896-5a99bf3dfb81',
            listingId: '17489921-4fcd-4519-90d5-95d1a326b7be',
            userId: 'bcea00ce-0a3b-4063-9289-1fd63662cbd3',
            createdAt: '2026-03-22T16:11:10.310Z',
            user: {
              id: 'bcea00ce-0a3b-4063-9289-1fd63662cbd3',
              name: 'Иванов Иван Иванович',
            },
            listing: {
              id: '17489921-4fcd-4519-90d5-95d1a326b7be',
              title: 'iPhone 13 Pro Max',
              likesCount: 1,
              version: 1,
            },
          },
        },
      },
    }),
    ApiResponse({
      status: 200,
      description: 'Лайк успешно удален',
      schema: {
        example: {
          message: 'Лайк успешно удален',
          action: 'unliked',
          likesCount: 41,
          version: 16,
        },
      },
    }),
    ApiResponse({
      status: 404,
      description: 'Объявление или пользователь не найден',
    }),
    ApiResponse({
      status: 500,
      description: 'Внутренняя ошибка сервера',
    }),
  );
