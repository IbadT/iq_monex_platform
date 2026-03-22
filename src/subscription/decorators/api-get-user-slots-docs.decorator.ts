import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { HttpStatus } from '@nestjs/common';

export function ApiGetUserSlotsDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Получить все слоты пользователя',
      description: 'Возвращает все слоты пользователя (свободные и занятые)',
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Список всех слотов пользователя успешно получен',
      schema: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'ID слота',
              example: '456e7890-f12a-34b5-c678-532614174111',
            },
            userId: {
              type: 'string',
              format: 'uuid',
              description: 'ID пользователя',
              example: '123e4567-e89b-12d3-a456-426614174000',
            },
            slotIndex: {
              type: 'integer',
              description: 'Индекс слота',
              example: 1,
            },
            sourceType: {
              type: 'string',
              description: 'Тип источника слота',
              example: 'SUBSCRIPTION',
              enum: ['SUBSCRIPTION', 'SLOT_PACKAGE'],
            },
            sourceId: {
              type: 'integer',
              description: 'ID источника (ID подписки или пакета слотов)',
              example: 123,
            },
            slotPackageId: {
              type: 'integer',
              description: 'ID пакета слотов',
              example: 456,
            },
            subscriptionId: {
              type: 'integer',
              description: 'ID подписки',
              example: 789,
            },
            expiresAt: {
              type: 'string',
              format: 'date-time',
              description: 'Дата истечения срока действия слота',
              example: '2024-12-31T23:59:59.000Z',
            },
            listingSlot: {
              type: 'object',
              description: 'Связанное объявление (null если слот свободен)',
              nullable: true,
              properties: {
                id: {
                  type: 'string',
                  format: 'uuid',
                  description: 'ID связи объявления со слотом',
                  example: '789e0123-g45b-67c8-d901-642514174222',
                },
                userSlotId: {
                  type: 'string',
                  format: 'uuid',
                  description: 'ID слота',
                  example: '456e7890-f12a-34b5-c678-532614174111',
                },
                listingId: {
                  type: 'string',
                  format: 'uuid',
                  description: 'ID объявления',
                  example: '123e4567-e89b-12d3-a456-426614174000',
                },
                assignedAt: {
                  type: 'string',
                  format: 'date-time',
                  description: 'Дата назначения объявления на слот',
                  example: '2024-01-01T00:00:00.000Z',
                },
              },
              example: null,
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Дата создания слота',
              example: '2024-01-01T00:00:00.000Z',
            },
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
