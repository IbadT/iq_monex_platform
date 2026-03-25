import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';
import { HttpStatus } from '@nestjs/common';
import { UpdateListingDto } from '../dto/request/update-listing.dto';

export function ApiEditListingDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Редактировать объявление',
      description: 'Обновляет данные существующего объявления',
    }),
    ApiBody({
      description: 'Данные для редактирования объявления',
      type: UpdateListingDto,
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Данные для редактирования получены',
      schema: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'ID объявления',
            example: '123e4567-e89b-12d3-a456-426614174000',
          },
          user: {
            type: 'object',
            description: 'Данные пользователя',
            example: {
              id: '123e4567-e89b-12d3-a456-426614174000',
              email: 'user@example.com',
            },
          },
          body: {
            type: 'object',
            description: 'Данные для обновления',
            example: {
              title: 'Обновленный заголовок',
              description: 'Обновленное описание',
            },
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
            example: 'Invalid request data',
          },
        },
      },
    }),
    ApiResponse({
      status: HttpStatus.UNAUTHORIZED,
      description: 'Требуется аутентификация',
      schema: {
        type: 'object',
        properties: {
          statusCode: {
            type: 'integer',
            example: 401,
          },
          message: {
            type: 'string',
            example: 'Unauthorized',
          },
        },
      },
    }),
    ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'Объявление не найдено',
      schema: {
        type: 'object',
        properties: {
          statusCode: {
            type: 'integer',
            example: 404,
          },
          message: {
            type: 'string',
            example: 'Listing not found',
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
