import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { HttpStatus } from '@nestjs/common';
import { SlotPackageResponseDto } from '../dto/response/slot-package-response.dto';

export function ApiGetUserPackagesDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Получить пакеты слотов пользователя',
      description: 'Возвращает все пакеты слотов, приобретенные пользователем',
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Список пакетов слотов пользователя успешно получен',
      type: SlotPackageResponseDto,
      isArray: true,
    }),
    ApiResponse({
      status: HttpStatus.UNAUTHORIZED,
      description: 'Требуется аутентификация',
      schema: {
        type: 'object',
        properties: {
          statusCode: {
            type: 'integer',
            example: 401,
          },
          message: {
            type: 'string',
            example: 'Unauthorized',
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
