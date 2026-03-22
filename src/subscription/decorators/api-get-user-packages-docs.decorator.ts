import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { HttpStatus } from '@nestjs/common';

export function ApiGetUserPackagesDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Получить пакеты слотов пользователя',
      description: 'Возвращает все пакеты слотов, приобретенные пользователем',
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Список пакетов слотов пользователя успешно получен',
      schema: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'ID пакета слотов',
              example: '456e7890-f12a-34b5-c678-532614174111'
            },
            userId: {
              type: 'string',
              format: 'uuid',
              description: 'ID пользователя',
              example: '123e4567-e89b-12d3-a456-426614174000'
            },
            name: {
              type: 'string',
              description: 'Название пакета',
              example: 'Пакет "Бизнес"'
            },
            slotCount: {
              type: 'integer',
              description: 'Количество слотов в пакете',
              example: 10
            },
            duration: {
              type: 'integer',
              description: 'Длительность пакета в днях',
              example: 30
            },
            price: {
              type: 'number',
              description: 'Стоимость пакета',
              example: 5000
            },
            isActive: {
              type: 'boolean',
              description: 'Активен ли пакет',
              example: true
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Дата покупки пакета',
              example: '2024-01-01T00:00:00.000Z'
            },
            expiresAt: {
              type: 'string',
              format: 'date-time',
              description: 'Дата истечения срока действия пакета',
              example: '2024-01-31T23:59:59.000Z'
            }
          }
        }
      }
    }),
    ApiResponse({
      status: HttpStatus.UNAUTHORIZED,
      description: 'Требуется аутентификация',
      schema: {
        type: 'object',
        properties: {
          statusCode: {
            type: 'integer',
            example: 401
          },
          message: {
            type: 'string',
            example: 'Unauthorized'
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
