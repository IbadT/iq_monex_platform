import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { HttpStatus } from '@nestjs/common';
import { CurrencyRateResponseDto } from '../dto/response/currency-rate-response.dto';

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
      type: CurrencyRateResponseDto,
      isArray: true,
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
