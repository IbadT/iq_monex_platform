import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { HttpStatus } from '@nestjs/common';

export function ApiSeedTariffsDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Создать тарифы из дефолтных данных',
      description:
        'Создает или обновляет тарифы на основе предустановленных данных',
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Обработка тарифов завершена',
      schema: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
            description: 'Статус операции',
            example: 'Обработка тарифов завершена',
          },
          data: {
            type: 'object',
            properties: {
              created: {
                type: 'integer',
                description: 'Количество созданных тарифов',
                example: 3,
              },
              updated: {
                type: 'integer',
                description: 'Количество обновленных тарифов',
                example: 2,
              },
              errors: {
                type: 'integer',
                description: 'Количество ошибок',
                example: 0,
              },
              total: {
                type: 'integer',
                description: 'Общее количество обработанных тарифов',
                example: 5,
              },
              results: {
                type: 'array',
                description: 'Результаты обработки каждого тарифа',
                items: {
                  type: 'object',
                  properties: {
                    code: {
                      type: 'string',
                      description: 'Код тарифа',
                      example: 'BASE',
                    },
                    action: {
                      type: 'string',
                      description: 'Действие с тарифом',
                      example: 'created',
                      enum: ['created', 'updated', 'error'],
                    },
                    id: {
                      type: 'string',
                      format: 'uuid',
                      description: 'ID тарифа (для созданных/обновленных)',
                      example: '550e8400-e29b-41d4-a716-446655440000',
                    },
                    error: {
                      type: 'string',
                      description: 'Текст ошибки (если есть)',
                      example: null,
                    },
                  },
                },
                example: [
                  {
                    code: 'BASE',
                    action: 'created',
                    id: '550e8400-e29b-41d4-a716-446655440000',
                  },
                  {
                    code: 'MAIN',
                    action: 'updated',
                    id: '456e7890-f12a-34b5-c678-532614174111',
                  },
                ],
              },
            },
          },
        },
      },
    }),
    ApiResponse({
      status: HttpStatus.UNAUTHORIZED,
      description: 'Требуются права администратора',
      schema: {
        type: 'object',
        properties: {
          statusCode: {
            type: 'integer',
            example: 401,
          },
          message: {
            type: 'string',
            example: 'Admin access required',
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
