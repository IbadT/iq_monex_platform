import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { HttpStatus } from '@nestjs/common';

export function ApiGetRolesDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Получить все роли сотрудников',
      description: 'Возвращает список всех доступных ролей для сотрудников',
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Список ролей успешно получен',
      schema: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id: {
              type: 'uuid',
              description: 'ID роли',
              example: '931d9cff-cd32-4543-aa5a-f138830e455f',
            },
            role: {
              type: 'string',
              description: 'Название роли',
              example: 'Менеджер',
            },
            // code: {
            //   type: 'string',
            //   description: 'Код роли',
            //   example: 'MANAGER',
            // },
            // type: {
            //   type: 'string',
            //   description: 'Тип роли',
            //   example: 'WORKER',
            //   enum: ['USER', 'WORKER'],
            // },
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
