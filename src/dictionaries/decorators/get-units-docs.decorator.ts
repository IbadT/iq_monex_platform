import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { HttpStatus } from '@nestjs/common';
import { UnitMeasurementResponseDto } from '../dto/response/user-measurement-response.dto';

export function ApiGetUnitsDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Получить единицы измерения',
      description:
        'Возвращает список всех доступных единиц измерения с поддержкой языков',
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Список единиц измерения успешно получен',
      type: UnitMeasurementResponseDto,
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
