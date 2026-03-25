import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { HttpStatus } from '@nestjs/common';

export function ApiSeedRolesDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Создать роли пользователей',
      description:
        'Создает или обновляет роли пользователей на основе предустановленных данных',
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Роли успешно созданы/обновлены',
      schema: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
            description: 'Статус операции',
            example: 'Роли успешно обработаны',
          },
          processed: {
            type: 'integer',
            description: 'Количество обработанных ролей',
            example: 3,
          },
          created: {
            type: 'integer',
            description: 'Количество созданных ролей',
            example: 2,
          },
          updated: {
            type: 'integer',
            description: 'Количество обновленных ролей',
            example: 1,
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
