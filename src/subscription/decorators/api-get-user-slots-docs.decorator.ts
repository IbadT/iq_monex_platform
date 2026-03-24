import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { HttpStatus } from '@nestjs/common';
import { GetAvailableSlotResponseDto } from '../dto/response/get-available-slot-response.dto';

export function ApiGetUserSlotsDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Получить все слоты пользователя',
      description: 'Возвращает все слоты пользователя (свободные и занятые)',
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Список всех слотов пользователя успешно получен',
      type: GetAvailableSlotResponseDto,
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
