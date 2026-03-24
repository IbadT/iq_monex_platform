import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { HttpStatus } from '@nestjs/common';
import { TariffResponseDto } from '../dto/response/tariff-response.dto';

export function ApiGetAllTariffsDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Получить все тарифы',
      description:
        'Возвращает список всех тарифов с сортировкой по дате создания',
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Список тарифов успешно получен',
      type: TariffResponseDto,
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
