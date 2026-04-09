import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { HttpStatus } from '@nestjs/common';
import { GetAllProfilesResponseDto } from '../dto/response/profile-response.dto';

export function ApiGetProfilesDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Получить все профили',
      description:
        'Возвращает список профилей с поддержкой поиска, фильтрации и пагинации',
    }),
    ApiQuery({
      name: 'limit',
      description: 'Количество профилей для возврата',
      required: false,
      example: 10,
      minimum: 1,
      maximum: 100,
    }),
    ApiQuery({
      name: 'offset',
      description: 'Смещение для пагинации',
      required: false,
      example: 0,
      minimum: 0,
    }),
    ApiQuery({
      name: 'query',
      description: 'Поисковый запрос для фильтрации по названию компании',
      required: false,
      example: 'Строительная компания',
    }),
    ApiQuery({
      name: 'ratingMin',
      description: 'Минимальный рейтинг компании',
      required: false,
      example: 4.5,
      minimum: 0,
      maximum: 5,
    }),
    ApiQuery({
      name: 'activityIds',
      description: 'Массив ID активностей для фильтрации',
      required: false,
      // example: ['123e4567-e89b-12d3-a456-426614174000'],
      example: [1],
      isArray: true,
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Список профилей успешно получен',
      type: GetAllProfilesResponseDto,
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
