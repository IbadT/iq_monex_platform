import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { GetLikesResponseDto } from '../dto/response/get-likes-response.dto';

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
      type: GetLikesResponseDto,
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
