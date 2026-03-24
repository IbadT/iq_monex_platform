import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { HttpStatus } from '@nestjs/common';
import { LegalEntityResponseDto } from '../dto/response/legal-entity.response.dto';

export function ApiGetLegalEntityTypesDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Получить типы юридических лиц',
      description: 'Возвращает список типов юридических лиц для объявлений',
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Список типов юридических лиц успешно получен',
      type: LegalEntityResponseDto,
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
