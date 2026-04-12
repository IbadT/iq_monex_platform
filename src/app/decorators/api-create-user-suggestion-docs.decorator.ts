import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';
import { HttpStatus } from '@nestjs/common';
import { CreateUserSuggestionDto } from '../dto/create-user-suggestion.dto';

export function ApiCreateUserSuggestionDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Создание нового предложения пользователя',
      description:
        'Создает предложение пользователя с текстом и опциональными фотографиями (до 3 шт.)',
    }),
    ApiBody({
      description: 'Данные для создания предложения',
      type: CreateUserSuggestionDto,
    }),
    ApiResponse({
      status: HttpStatus.CREATED,
      description: 'Предложение успешно создано',
      schema: {
        type: 'object',
        properties: {
          id: {
            type: 'integer',
            example: 1,
          },
          text: {
            type: 'string',
            example: 'Добавьте возможность фильтрации по цене',
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
          },
        },
      },
    }),
    ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: 'Некорректные данные',
      schema: {
        type: 'object',
        properties: {
          statusCode: {
            type: 'integer',
            example: 400,
          },
          message: {
            type: 'string',
            example: 'Текст предложения обязателен',
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
