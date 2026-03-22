import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';
import { HttpStatus } from '@nestjs/common';
import { CreateRoleDto } from '../dto/create-role.dto';

export function ApiCreateRoleDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Создать роль сотрудника',
      description: 'Создает новую роль для сотрудников',
    }),
    ApiBody({
      description: 'Данные для создания роли',
      type: CreateRoleDto,
    }),
    ApiResponse({
      status: HttpStatus.CREATED,
      description: 'Роль успешно создана',
      schema: {
        type: 'object',
        properties: {
          id: {
            type: 'uuid',
            description: 'ID созданной роли',
            example: '550e8400-e29b-41d4-a716-446655440000',
          },
          role: {
            type: 'string',
            description: 'Название роли',
            example: 'Менеджер',
          },
          code: {
            type: 'string',
            description: 'Код роли',
            example: 'MANAGER',
          },
          type: {
            type: 'string',
            description: 'Тип роли',
            example: 'WORKER',
            enum: ['USER', 'WORKER'],
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
            description: 'Дата создания',
            example: '2024-01-01T00:00:00.000Z',
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
            description: 'Дата обновления',
            example: '2024-01-01T00:00:00.000Z',
          },
        },
      },
    }),
    ApiResponse({
      status: HttpStatus.CONFLICT,
      description: 'Роль уже существует',
      schema: {
        type: 'object',
        properties: {
          statusCode: {
            type: 'integer',
            example: 409,
          },
          message: {
            type: 'string',
            example: 'Роль с названием Менеджер уже существует',
          },
        },
      },
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
            example: 'Invalid role data',
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
