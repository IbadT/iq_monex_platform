import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { HttpStatus } from '@nestjs/common';

export function ApiGetActivitiesDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Получить все сферы деятельности',
      description: 'Возвращает список всех доступных сфер деятельности из системы',
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Список сфер деятельности успешно получен',
      schema: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'Уникальный идентификатор сферы деятельности',
              example: 1
            },
            name: {
              type: 'string',
              description: 'Название сферы деятельности',
              example: 'Программирование'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Дата создания записи',
              example: '2024-01-01T00:00:00.000Z'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Дата обновления записи',
              example: '2024-01-01T00:00:00.000Z'
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
