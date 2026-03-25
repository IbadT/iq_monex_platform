import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { HttpStatus } from '@nestjs/common';

export function ApiPostSeedDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Сидировать справочники',
      description:
        'Добавляет базовые данные валют и единиц измерения в систему',
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Справочники успешно добавлены',
      schema: {
        type: 'object',
        properties: {
          statusCode: {
            type: 'integer',
            example: 200,
          },
          message: {
            type: 'string',
            example: 'OK',
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
