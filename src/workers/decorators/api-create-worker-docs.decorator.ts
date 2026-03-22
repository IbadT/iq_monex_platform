import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';
import { HttpStatus } from '@nestjs/common';
import { CreateWorkersDto } from '../dto/create-workers.dto';

export function ApiCreateWorkerDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Создать сотрудников',
      description: 'Создает, обновляет или удаляет сотрудников на основе указанных действий',
    }),
    ApiBody({
      description: 'Массив сотрудников для обработки',
      type: CreateWorkersDto
    }),
    ApiResponse({
      status: HttpStatus.CREATED,
      description: 'Сотрудники успешно обработаны',
      schema: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'ID сотрудника',
              example: '550e8400-e29b-41d4-a716-446655440000'
            },
            name: {
              type: 'string',
              description: 'Имя сотрудника',
              example: 'Иванов Иван Иванович'
            },
            email: {
              type: 'string',
              description: 'Email сотрудника',
              example: 'ivanov@example.com'
            },
            phone: {
              type: 'string',
              description: 'Телефон сотрудника',
              example: '+79991234567'
            },
            roleId: {
              type: 'string',
              format: 'uuid',
              description: 'ID роли сотрудника',
              example: '123e4567-e89b-12d3-a456-426614174000'
            },
            userId: {
              type: 'string',
              format: 'uuid',
              description: 'ID пользователя',
              example: '456e7890-f12a-34b5-c678-532614174111'
            },
            isAcitve: {
              type: 'boolean',
              description: 'Активен ли сотрудник',
              example: true
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Дата создания',
              example: '2024-01-01T00:00:00.000Z'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Дата обновления',
              example: '2024-01-01T00:00:00.000Z'
            },
            role: {
              type: 'object',
              properties: {
                id: {
                  type: 'integer',
                  description: 'ID роли',
                  example: 1
                },
                code: {
                  type: 'string',
                  description: 'Код роли',
                  example: 'MANAGER'
                },
                role: {
                  type: 'string',
                  description: 'Название роли',
                  example: 'Менеджер'
                },
                type: {
                  type: 'string',
                  description: 'Тип роли',
                  example: 'WORKER',
                  enum: ['USER', 'WORKER']
                }
              }
            }
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
            example: 'Invalid worker action'
          }
        }
      }
    }),
    ApiResponse({
      status: HttpStatus.CONFLICT,
      description: 'Конфликт данных',
      schema: {
        type: 'object',
        properties: {
          statusCode: {
            type: 'integer',
            example: 409
          },
          message: {
            type: 'string',
            example: 'Worker with email ivanov@example.com already exists'
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
