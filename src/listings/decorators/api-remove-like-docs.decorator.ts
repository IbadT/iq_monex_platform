import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

export const ApiRemoveLikeDocs = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Удалить лайк объявления',
      description: 'Принудительно удаляет лайк пользователя с объявления. Требует авторизации.',
    }),
    ApiParam({
      name: 'listingId',
      description: 'ID объявления',
      type: 'string',
      format: 'uuid',
    }),
    ApiResponse({
      status: 200,
      description: 'Лайк успешно удален',
      schema: {
        example: {
          message: 'Лайк успешно удален',
        },
      },
    }),
    ApiResponse({
      status: 400,
      description: 'Лайк не найден',
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
