import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { HttpStatus } from '@nestjs/common';
import { FullProfileResponseDto } from '../dto/response/full-profile-response.dto';

export function ApiGetProfileByIdDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Получить профиль по ID пользователя',
      description:
        'Возвращает информацию о профиле по указанному идентификатору',
    }),
    ApiParam({
      name: 'id',
      description: 'UUID пользователя',
      required: true,
      example: '550e8400-e29b-41d4-a716-446655440000',
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Профиль успешно получен',
      type: FullProfileResponseDto,
    }),
    ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'Профиль не найден',
      schema: {
        type: 'object',
        properties: {
          statusCode: {
            type: 'integer',
            example: 404,
          },
          message: {
            type: 'string',
            example: 'Профиль не найден',
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
