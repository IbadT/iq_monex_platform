import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { HttpStatus } from '@nestjs/common';

export function ApiPostLegalEntitySeedDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Сидировать типы юридических лиц',
      description: 'Добавляет базовые типы юридических лиц в систему',
    }),
    ApiResponse({
      status: HttpStatus.CREATED,
      description: 'Типы юридических лиц успешно добавлены',
      schema: {
        type: 'object',
        properties: {
          statusCode: {
            type: 'integer',
            example: 201
          },
          message: {
            type: 'string',
            example: 'Legal entity types seeded successfully'
          }
        }
      }
    }),
    ApiResponse({
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      description: 'Внутренняя ошибка сервера',
      schema: {
        type: 'object',
        properties: {
          statusCode: {
            type: 'integer',
            example: 500
          },
          message: {
            type: 'string',
            example: 'Internal server error'
          }
        }
      }
    })
  );
}
