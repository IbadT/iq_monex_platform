import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';
import { HttpStatus } from '@nestjs/common';
import { GetConvertValueFromAmountDto } from '../dto/request/get-convert-valut-from-amount.dto';

export function ApiPostConvertValutDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Конвертировать валюту',
      description: 'Конвертирует указанную сумму из одной валюты во все доступные валюты',
    }),
    ApiBody({
      description: 'Данные для конвертации валюты',
      type: GetConvertValueFromAmountDto
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Конвертация выполнена успешно',
      schema: {
        type: 'object',
        description: 'Объект с конвертированными значениями для всех валют',
        example: {
          RUB: { value: 90.50, symbol: '₽' },
          USD: { value: 100.00, symbol: '$' },
          EUR: { value: 98.00, symbol: '€' }
        }
      }
    }),
    ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: 'Ошибка в запросе',
      schema: {
        type: 'object',
        properties: {
          statusCode: {
            type: 'integer',
            example: 400
          },
          message: {
            type: 'string',
            example: 'Валюта USD не найдена'
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
