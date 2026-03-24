import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';
import { HttpStatus } from '@nestjs/common';
import { CreateRoleDto } from '../dto/create-role.dto';
import { RoleResponseDto } from '../dto/response/role-response.dto';

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
      type: RoleResponseDto,
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
