import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { HttpStatus } from '@nestjs/common';

export function ApiGetLegalEntityTypesDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Получить типы юридических лиц',
      description: 'Возвращает список типов юридических лиц для объявлений',
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Список типов юридических лиц успешно получен',
      schema: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'ID типа юридического лица',
              example: 1,
            },
            code: {
              type: 'string',
              description: 'Код',
              example: 'OOO',
            },
            name: {
              type: 'string',
              description: 'Полное название',
              example: 'Общество с ограниченной ответственностью',
            },
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
