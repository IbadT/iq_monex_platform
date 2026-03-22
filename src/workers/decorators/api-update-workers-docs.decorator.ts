import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';
import { HttpStatus } from '@nestjs/common';
import { UpdateWorkerDto } from '../dto/update-worker.dto';

export function ApiUpdateWorkersDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Обновить сотрудников',
      description: 'Массово обновляет данные сотрудников текущего пользователя',
    }),
    ApiBody({
      description: 'Данные для обновления сотрудников',
      type: UpdateWorkerDto
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Сотрудники успешно обновлены',
      schema: {
        type: 'object',
        properties: {
          count: {
            type: 'integer',
            description: 'Количество обновленных сотрудников',
            example: 5
          }
        }
      }
    }),
    ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: 'Ошибка в запросе',
      schema: {
        type: 'object',
        properties: {
          statusCode: {
            type: 'integer',
            example: 400
          },
          message: {
            type: 'string',
            example: 'Invalid update data'
          }
        }
      }
    }),
    ApiResponse({
      status: HttpStatus.UNAUTHORIZED,
      description: 'Требуется аутентификация',
      schema: {
        type: 'object',
        properties: {
          statusCode: {
            type: 'integer',
            example: 401
          },
          message: {
            type: 'string',
            example: 'Unauthorized'
          }
        }
      }
    }),
    ApiResponse({
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      description: 'Внутренняя ошибка сервера',
      schema: {
        type: 'object',
        properties: {
          statusCode: {
            type: 'integer',
            example: 500
          },
          message: {
            type: 'string',
            example: 'Internal server error'
          }
        }
      }
    })
  );
}
