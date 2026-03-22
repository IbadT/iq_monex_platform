import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { HttpStatus } from '@nestjs/common';

export function ApiGetSubsubcategoriesDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Получить подподкатегории',
      description:
        'Возвращает список всех подподкатегорий (категорий третьего уровня)',
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Список подподкатегорий успешно получен',
      schema: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'ID подподкатегории',
              example: 3,
            },
            name: {
              type: 'string',
              description: 'Название подподкатегории',
              example: 'Смартфоны',
            },
            parentId: {
              type: 'integer',
              description: 'ID родителя',
              example: 1,
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
