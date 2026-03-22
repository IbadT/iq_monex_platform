import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';
import { HttpStatus } from '@nestjs/common';
import { EnterpriceQueryDto } from '../dto/request/enterprice-query.dto';

export function ApiEnterprisesDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Найти предприятия',
      description:
        'Возвращает список предприятий в радиусе от указанной точки с фильтрацией по типу и активностям',
    }),
    ApiBody({
      description: 'Параметры поиска предприятий',
      type: EnterpriceQueryDto,
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Предприятия успешно найдены',
      schema: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'ID локации',
              example: '550e8400-e29b-41d4-a716-446655440000',
            },
            type: {
              type: 'string',
              description: 'Тип локации',
              example: 'OFFICE',
              enum: ['OFFICE', 'WAREHOUSE', 'OTHER'],
            },
            latitude: {
              type: 'number',
              description: 'Широта',
              example: 55.7558,
            },
            longitude: {
              type: 'number',
              description: 'Долгота',
              example: 37.6173,
            },
            address: {
              type: 'string',
              description: 'Адрес',
              example: 'г. Алматы, ул. Абая 123',
            },
            userId: {
              type: 'string',
              description: 'ID пользователя (если привязано к пользователю)',
              example: '123e4567-e89b-12d3-a456-426614174000',
            },
            user: {
              type: 'object',
              description: 'Данные пользователя',
              properties: {
                id: {
                  type: 'string',
                  description: 'ID пользователя',
                  example: '123e4567-e89b-12d3-a456-426614174000',
                },
                email: {
                  type: 'string',
                  description: 'Email пользователя',
                  example: 'ivan.ivanov@example.com',
                },
                name: {
                  type: 'string',
                  description: 'Имя пользователя',
                  example: 'Иван Иванов',
                },
                accountNumber: {
                  type: 'string',
                  description: 'Номер счета пользователя',
                  example: 'ACC123456',
                },
                isVerified: {
                  type: 'boolean',
                  description: 'Статус верификации',
                  example: true,
                },
                rating: {
                  type: 'number',
                  description: 'Рейтинг пользователя',
                  example: 4.5,
                },
                reviewsCount: {
                  type: 'integer',
                  description: 'Количество отзывов',
                  example: 12,
                },
                roleId: {
                  type: 'integer',
                  description: 'ID роли пользователя',
                  example: 1,
                },
                createdAt: {
                  type: 'string',
                  format: 'date-time',
                  description: 'Дата создания пользователя',
                  example: '2024-01-01T00:00:00.000Z',
                },
                updatedAt: {
                  type: 'string',
                  format: 'date-time',
                  description: 'Дата обновления пользователя',
                  example: '2024-01-15T10:30:00.000Z',
                },
                profile: {
                  type: 'object',
                  description: 'Профиль пользователя или null',
                  properties: {
                    firstName: {
                      type: 'string',
                      example: 'Иван',
                    },
                    lastName: {
                      type: 'string',
                      example: 'Иванов',
                    },
                    company: {
                      type: 'string',
                      description: 'Название компании',
                      example: 'ООО "Ромашка"',
                    },
                  },
                },
                userActivities: {
                  type: 'array',
                  description: 'Активности пользователя',
                  items: {
                    type: 'object',
                    properties: {
                      id: {
                        type: 'string',
                        description: 'ID связи пользователя с активностью',
                        example: '550e8400-e29b-41d4-a716-446655440000',
                      },
                      userId: {
                        type: 'string',
                        description: 'ID пользователя',
                        example: '123e4567-e89b-12d3-a456-426614174000',
                      },
                      createdAt: {
                        type: 'string',
                        format: 'date-time',
                        description: 'Дата создания связи',
                        example: '2024-01-01T00:00:00.000Z',
                      },
                      updatedAt: {
                        type: 'string',
                        format: 'date-time',
                        description: 'Дата обновления связи',
                        example: '2024-01-15T10:30:00.000Z',
                      },
                      activityId: {
                        type: 'integer',
                        description: 'ID активности',
                        example: 1,
                      },
                      activity: {
                        type: 'object',
                        description: 'Информация об активности',
                        properties: {
                          id: {
                            type: 'integer',
                            example: 1,
                          },
                          name: {
                            type: 'string',
                            description: 'Название активности',
                            example: 'Программирование',
                          },
                          createdAt: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Дата создания активности',
                            example: '2024-01-01T00:00:00.000Z',
                          },
                          updatedAt: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Дата обновления активности',
                            example: '2024-01-15T10:30:00.000Z',
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
            distance: {
              type: 'number',
              description: 'Расстояние от центральной точки в метрах',
              example: 446.37900056601205,
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
            example: 'Invalid request parameters',
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
