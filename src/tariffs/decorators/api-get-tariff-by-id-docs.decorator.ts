import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { HttpStatus } from '@nestjs/common';

export function ApiGetTariffByIdDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Получить тариф по ID',
      description: 'Возвращает информацию о тарифе по указанному идентификатору',
    }),
    ApiParam({
      name: 'id',
      description: 'UUID тарифа',
      required: true,
      example: '550e8400-e29b-41d4-a716-446655440000'
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Тариф успешно получен',
      schema: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            format: 'uuid',
            description: 'ID тарифа',
            example: '550e8400-e29b-41d4-a716-446655440000'
          },
          code: {
            type: 'string',
            description: 'Код тарифа',
            example: 'BASE',
            enum: ['BASE', 'MAIN', 'PREMIUM', 'ADDITIONAL_PACKAGE']
          },
          name: {
            type: 'string',
            description: 'Название тарифа',
            example: 'Базовая подписка'
          },
          description: {
            type: 'string',
            description: 'Описание тарифа',
            example: 'Базовая подписка с 100 слотами'
          },
          baseSlots: {
            type: 'integer',
            description: 'Количество слотов при покупке',
            example: 100
          },
          baseDays: {
            type: 'integer',
            description: 'Базовый срок действия (дней)',
            example: 30
          },
          maxTotalDays: {
            type: 'integer',
            description: 'Максимальный срок (для продлений)',
            example: 365
          },
          isExtendable: {
            type: 'boolean',
            description: 'Можно ли продлевать',
            example: true
          },
          price: {
            type: 'number',
            description: 'Цена (в базовой валюте)',
            example: 500.0
          },
          currencyCode: {
            type: 'string',
            description: 'ISO код валюты',
            example: 'RUB'
          },
          isActive: {
            type: 'boolean',
            description: 'Активен ли тариф',
            example: true
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
            description: 'Дата создания тарифа',
            example: '2024-01-01T00:00:00.000Z'
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
            description: 'Дата обновления тарифа',
            example: '2024-01-01T00:00:00.000Z'
          }
        }
      }
    }),
    ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'Тариф не найден',
      schema: {
        type: 'object',
        properties: {
          statusCode: {
            type: 'integer',
            example: 404
          },
          message: {
            type: 'string',
            example: 'Тариф не найден'
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
