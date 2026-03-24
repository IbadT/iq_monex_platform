import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { HttpStatus } from '@nestjs/common';
import { RoleBriefResponseDto } from '../dto/response/role-response.dto';

export function ApiGetRolesDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Получить все роли сотрудников',
      description: 'Возвращает список всех доступных ролей для сотрудников',
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Список ролей успешно получен',
      type: RoleBriefResponseDto,
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
