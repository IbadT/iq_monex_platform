import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { HttpStatus } from '@nestjs/common';

export function ApiBulkRestoreDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Массово восстановить объявления',
      description: 'Восстанавливает все архивированные объявления пользователя в статус PUBLISHED',
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Объявления успешно восстановлены',
      schema: {
        type: 'object',
        properties: {
          restored: {
            type: 'integer',
            description: 'Количество восстановленных объявлений',
            example: 5
          },
          slotsUsed: {
            type: 'integer',
            description: 'Количество использованных слотов',
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
            example: 'Нет архивированных объявлений для восстановления'
          }
        }
      }
    }),
    ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: 'Недостаточно слотов',
      schema: {
        type: 'object',
        properties: {
          statusCode: {
            type: 'integer',
            example: 400
          },
          message: {
            type: 'string',
            example: 'Не хватает доступных слотов: 3 для перемещения объявлений из архива: 5'
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
