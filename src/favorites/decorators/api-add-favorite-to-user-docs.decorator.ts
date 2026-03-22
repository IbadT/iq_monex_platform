import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';
import { HttpStatus } from '@nestjs/common';
import { AddFavoriteToUserDto } from '../dto/add-favorite-to-user.dto';

export function ApiAddFavoriteToUserDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Добавить пользователя в избранное',
      description: 'Добавляет указанного пользователя в список избранных для текущего пользователя',
    }),
    ApiBody({
      description: 'Данные для добавления пользователя в избранное',
      type: AddFavoriteToUserDto
    }),
    ApiResponse({
      status: HttpStatus.CREATED,
      description: 'Пользователь успешно добавлен в избранное',
      schema: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            format: 'uuid',
            description: 'ID записи избранного',
            example: '550e8400-e29b-41d4-a716-446655440000'
          },
          userId: {
            type: 'string',
            format: 'uuid',
            description: 'ID текущего пользователя',
            example: '123e4567-e89b-12d3-a456-426614174000'
          },
          targetUserId: {
            type: 'string',
            format: 'uuid',
            description: 'ID добавленного пользователя',
            example: '123e4567-e89b-12d3-a456-426614174000'
          },
          type: {
            type: 'string',
            description: 'Тип избранного',
            example: 'USER',
            enum: ['LISTING', 'USER']
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
            description: 'Дата добавления',
            example: '2024-01-01T00:00:00.000Z'
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
            example: 'Пользователь не может добавить в избранное сам себя'
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
