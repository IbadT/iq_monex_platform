import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { HttpStatus } from '@nestjs/common';

export function ApiGetCurrenciesDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Получить валюты',
      description: 'Возвращает список всех доступных валют с поддержкой языков',
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Список валют успешно получен',
      schema: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'ID валюты',
              example: 1
            },
            symbol: {
              type: 'string',
              description: 'Символ валюты',
              example: '$'
            },
            code: {
              type: 'string',
              description: 'Код валюты',
              example: 'USD'
            },
            name: {
              type: 'string',
              description: 'Название валюты на выбранном языке',
              example: 'Доллар США'
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
