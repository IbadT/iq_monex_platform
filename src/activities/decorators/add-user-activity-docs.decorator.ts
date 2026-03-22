import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';
import { HttpStatus } from '@nestjs/common';
import { AddActivityToUserDto } from '@/users/dto/add-activity-to-user.dto';

export function ApiAddUserActivityDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Добавить сферу деятельности пользователю',
      description:
        'Добавляет новую сферу деятельности пользователю или привязывает существующую',
    }),
    ApiBody({
      description: 'Данные для добавления активности пользователю',
      type: AddActivityToUserDto,
      examples: {
        'Привязка существующей активности': {
          summary: 'Привязка существующей активности по ID',
          value: {
            action: 'BIND',
            id: 1,
          },
        },
        'Создание новой активности': {
          summary: 'Создание новой активности с привязкой',
          value: {
            action: 'CREATE',
            activity: 'Программирование',
          },
        },
      },
    }),
    ApiResponse({
      status: HttpStatus.CREATED,
      description: 'Сфера деятельности успешно добавлена',
      schema: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            format: 'uuid',
            description:
              'Уникальный идентификатор связи пользователя с активностью',
            example: '550e8400-e29b-41d4-a716-446655440000',
          },
          userId: {
            type: 'string',
            format: 'uuid',
            description: 'UUID пользователя',
            example: '123e4567-e89b-12d3-a456-426614174000',
          },
          activityId: {
            type: 'integer',
            description: 'ID сферы деятельности',
            example: 1,
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
            description: 'Дата создания связи',
            example: '2024-01-01T00:00:00.000Z',
          },
          activity: {
            type: 'object',
            description: 'Информация о сфере деятельности',
            properties: {
              id: {
                type: 'integer',
                description: 'ID сферы деятельности',
                example: 1,
              },
              name: {
                type: 'string',
                description: 'Название сферы деятельности',
                example: 'Программирование',
              },
              createdAt: {
                type: 'string',
                format: 'date-time',
                description: 'Дата создания сферы деятельности',
                example: '2024-01-01T00:00:00.000Z',
              },
              updatedAt: {
                type: 'string',
                format: 'date-time',
                description: 'Дата обновления сферы деятельности',
                example: '2024-01-01T00:00:00.000Z',
              },
            },
          },
        },
      },
    }),
    ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: 'Некорректные данные запроса',
      schema: {
        type: 'object',
        properties: {
          statusCode: {
            type: 'integer',
            example: 400,
          },
          message: {
            type: 'string',
            example: 'Activity id or activity name is required',
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
      status: HttpStatus.CONFLICT,
      description: 'Конфликт данных',
      schema: {
        type: 'object',
        properties: {
          statusCode: {
            type: 'integer',
            example: 409,
          },
          message: {
            type: 'string',
            example: 'User already has this activity',
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
