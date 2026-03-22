import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { HttpStatus } from '@nestjs/common';

export function ApiGetUserByAccountNumberDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Получить пользователя по номеру счета',
      description: 'Возвращает информацию о пользователе по указанному номеру счета',
    }),
    ApiParam({
      name: 'account_number',
      description: 'Номер счета пользователя',
      required: true,
      example: '1234567890'
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Пользователь успешно получен',
      schema: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            format: 'uuid',
            description: 'ID пользователя',
            example: '123e4567-e89b-12d3-a456-426614174000'
          },
          email: {
            type: 'string',
            description: 'Email пользователя',
            example: 'user@example.com'
          },
          name: {
            type: 'string',
            description: 'Имя пользователя',
            example: 'Иван Иванов'
          },
          accountNumber: {
            type: 'string',
            description: 'Номер счета',
            example: '1234567890'
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
                example: 'USER'
              },
              role: {
                type: 'string',
                description: 'Название роли',
                example: 'Пользователь'
              }
            }
          },
          isVerified: {
            type: 'boolean',
            description: 'Верифицирован ли пользователь',
            example: true
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
            description: 'Дата создания',
            example: '2024-01-01T00:00:00.000Z'
          }
        }
      }
    }),
    ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'Пользователь не найден',
      schema: {
        type: 'object',
        properties: {
          statusCode: {
            type: 'integer',
            example: 404
          },
          message: {
            type: 'string',
            example: 'Пользователь не найден'
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
