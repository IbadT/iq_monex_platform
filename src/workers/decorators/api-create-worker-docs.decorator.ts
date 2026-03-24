import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';
import { HttpStatus } from '@nestjs/common';
import { CreateWorkersDto } from '../dto/create-workers.dto';
import { CreateWorkerResponseDto } from '../dto/response/create-worker.dto';

export function ApiCreateWorkerDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Создать сотрудников',
      description:
        'Создает, обновляет или удаляет сотрудников на основе указанных действий',
    }),
    ApiBody({
      description: 'Массив сотрудников для обработки',
      type: CreateWorkersDto,
    }),
    ApiResponse({
      status: HttpStatus.CREATED,
      description: 'Сотрудники успешно обработаны',
      type: CreateWorkerResponseDto,
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
            example: 'Invalid worker action',
          },
        },
      },
    }),
    ApiResponse({
      status: HttpStatus.CONFLICT,
      description: 'Конфликт данных',
      schema: {
        type: 'object',
        properties: {
          statusCode: {
            type: 'integer',
            example: 409,
          },
          message: {
            type: 'string',
            example: 'Worker with email ivanov@example.com already exists',
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
