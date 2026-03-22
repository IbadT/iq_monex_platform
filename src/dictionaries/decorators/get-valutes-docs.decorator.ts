import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { HttpStatus } from '@nestjs/common';

export function ApiGetValutesDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Получить курсы валют',
      description:
        'Возвращает актуальные курсы валют из API ЦентроБанка (фронтом не используется)',
      deprecated: true,
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Курсы валют успешно получены',
      schema: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'ID записи курса',
              example: 1,
            },
            code: {
              type: 'string',
              description: 'Код валюты',
              example: 'USD',
            },
            nominal: {
              type: 'integer',
              description: 'Номинал валюты',
              example: 1,
            },
            rate: {
              type: 'number',
              description: 'Курс валюты к рублю',
              example: 90.5,
            },
            date: {
              type: 'string',
              format: 'date-time',
              description: 'Дата курса',
              example: '2024-01-01T00:00:00.000Z',
            },
          },
        },
      },
    }),
    ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'Курсы валют не найдены',
      schema: {
        type: 'object',
        properties: {
          statusCode: {
            type: 'integer',
            example: 404,
          },
          message: {
            type: 'string',
            example: 'Нет данных о курсах валют',
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
