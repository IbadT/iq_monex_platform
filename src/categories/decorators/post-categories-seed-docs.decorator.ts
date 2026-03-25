import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { HttpStatus } from '@nestjs/common';

export function ApiPostCategoriesSeedDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Сидировать категории',
      description:
        'Добавляет базовые категории, подкатегории и подподкатегории в систему',
    }),
    ApiResponse({
      status: HttpStatus.CREATED,
      description: 'Категории успешно добавлены',
      schema: {
        type: 'object',
        properties: {
          statusCode: {
            type: 'integer',
            example: 201,
          },
          message: {
            type: 'string',
            example: 'Categories seeded successfully',
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
