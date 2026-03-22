import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { HttpStatus } from '@nestjs/common';

export function ApiGetSubcategoriesDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Получить подкатегории',
      description:
        'Возвращает список всех подкатегорий (категорий второго уровня)',
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Список подкатегорий успешно получен',
      schema: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'ID подкатегории',
              example: 2,
            },
            name: {
              type: 'string',
              description: 'Название подкатегории',
              example: 'Телефоны',
            },
            parentId: {
              type: 'integer',
              description: 'ID родителя',
              example: 2,
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
