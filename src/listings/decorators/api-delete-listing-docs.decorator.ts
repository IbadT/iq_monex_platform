import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { HttpStatus } from '@nestjs/common';

export function ApiDeleteListingDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Удалить объявление',
      description: 'Удаляет объявление по ID с учетом статуса',
    }),
    ApiQuery({
      name: 'status',
      description: 'Статус объявления для удаления',
      required: true,
      example: 'PUBLISHED',
      enum: ['PUBLISHED', 'DRAFT', 'ARCHIVED', 'TEMPLATE'],
    }),
    ApiResponse({
      status: HttpStatus.NO_CONTENT,
      description: 'Объявление успешно удалено',
    }),
    ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: 'Ошибка в запросе',
      schema: {
        type: 'object',
        properties: {
          statusCode: {
            type: 'integer',
            example: 400,
          },
          message: {
            type: 'string',
            example: 'Invalid status parameter',
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
      status: HttpStatus.NOT_FOUND,
      description: 'Объявление не найдено',
      schema: {
        type: 'object',
        properties: {
          statusCode: {
            type: 'integer',
            example: 404,
          },
          message: {
            type: 'string',
            example: 'Объявление с id: {id} не найдено',
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
