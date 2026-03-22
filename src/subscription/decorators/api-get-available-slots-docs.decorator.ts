import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { HttpStatus } from '@nestjs/common';

export function ApiGetAvailableSlotsDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Получить доступные слоты',
      description:
        'Возвращает список свободных слотов пользователя для создания объявлений',
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Список доступных слотов успешно получен',
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
            sourceId: {},
            slotPackageid: {},
            subscriptionId: {},
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
      status: HttpStatus.NOT_FOUND,
      description: 'Нет доступных слотов',
      schema: {
        type: 'object',
        properties: {
          statusCode: {
            type: 'integer',
            example: 404,
          },
          message: {
            type: 'string',
            example: 'Нет доступных слотов для создания объявления',
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
