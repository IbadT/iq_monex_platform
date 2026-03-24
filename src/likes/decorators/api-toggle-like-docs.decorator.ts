import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { SendLikeDto } from '../../listings/dto/request/send-like.dto';
import { LikeResponseDto } from '../dto/response/like-response.dto';

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
      type: LikeResponseDto,
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
