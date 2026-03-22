import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { HttpStatus } from '@nestjs/common';

export function CategoriesApiDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Получить категории',
      description: 'Возвращает список всех категорий (категорий первого уровня)',
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Список категорий успешно получен',
      schema: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'ID категории',
              example: 1
            },
            name: {
              type: 'string',
              description: 'Название категории',
              example: 'Электроника'
            }
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
