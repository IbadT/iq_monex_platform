import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { HttpStatus } from '@nestjs/common';
import { GetAvailableSlotResponseDto } from '../dto/response/get-available-slot-response.dto';

export function ApiGetAvailableSlotsDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Получить доступные слоты',
      description:
        'Возвращает список свободных слотов пользователя для создания объявлений',
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Список доступных слотов успешно получен',
      type: GetAvailableSlotResponseDto,
      isArray: true,
    }),
    ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'Нет доступных слотов',
      schema: {
        type: 'object',
        properties: {
          statusCode: {
            type: 'integer',
            example: 404,
          },
          message: {
            type: 'string',
            example: 'Нет доступных слотов для создания объявления',
          },
        },
      },
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
