import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';
import { HttpStatus } from '@nestjs/common';
import { EnterpriceQueryDto } from '../dto/request/enterprice-query.dto';
import { MapLocationResponseDto } from '../dto/response/map-enterprice.response.dto';

export function ApiEnterprisesDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Найти предприятия',
      description:
        'Возвращает список предприятий в радиусе от указанной точки с фильтрацией по типу и активностям',
    }),
    ApiBody({
      description: 'Параметры поиска предприятий',
      type: EnterpriceQueryDto,
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Предприятия успешно найдены',
      type: MapLocationResponseDto,
      isArray: true,
    }),
    ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: 'Ошибка в запросе',
      schema: {
        type: 'object',
        properties: {
          statusCode: {
            type: 'integer',
            example: 400,
          },
          message: {
            type: 'string',
            example: 'Invalid request parameters',
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
