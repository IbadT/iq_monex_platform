import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';
import { HttpStatus } from '@nestjs/common';
import { ChangeWorkerStatus } from '../dto/change-worker-status.dto';
import { ChangeWorkerStatusResponseDto } from '../dto/response/change-status.dto';

export function ApiChangeWorkerStatusDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Изменить статус сотрудника',
      description: 'Деактивирует указанного сотрудника',
    }),
    ApiBody({
      description: 'ID сотрудника для деактивации',
      type: ChangeWorkerStatus,
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Статус сотрудника успешно изменен',
      type: ChangeWorkerStatusResponseDto,
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
            example: 'Worker not found or access denied',
          },
        },
      },
    }),
    ApiResponse({
      status: HttpStatus.UNAUTHORIZED,
      description: 'Требуется аутентификация',
      schema: {
        type: 'object',
        properties: {
          statusCode: {
            type: 'integer',
            example: 401,
          },
          message: {
            type: 'string',
            example: 'Unauthorized',
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
