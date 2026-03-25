import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';
import { HttpStatus } from '@nestjs/common';
import { AddFavoriteToUserDto } from '../dto/add-favorite-to-user.dto';
import { CreateFavoriteResponseDto } from '../dto/response/create-favorite-response.dto';

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
      type: CreateFavoriteResponseDto,
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
