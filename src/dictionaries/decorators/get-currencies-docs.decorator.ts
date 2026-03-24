import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { HttpStatus } from '@nestjs/common';
import { CurrenciesResponseDto } from '../dto/response/currencies-response.dto';

export function ApiGetCurrenciesDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Получить валюты',
      description: 'Возвращает список всех доступных валют с поддержкой языков',
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Список валют успешно получен',
      type: CurrenciesResponseDto,
      isArray: true,
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
