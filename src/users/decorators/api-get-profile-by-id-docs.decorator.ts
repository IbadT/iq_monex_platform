import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { HttpStatus } from '@nestjs/common';

export function ApiGetProfileByIdDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Получить профиль по ID',
      description: 'Возвращает информацию о профиле по указанному идентификатору',
    }),
    ApiParam({
      name: 'id',
      description: 'UUID профиля',
      required: true,
      example: '550e8400-e29b-41d4-a716-446655440000'
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Профиль успешно получен',
      schema: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            format: 'uuid',
            description: 'ID профиля',
            example: '456e7890-f12a-34b5-c678-532614174111'
          },
          user: {
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
                example: 'company@example.com'
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
          },
          profile: {
            type: 'object',
            properties: {
              id: {
                type: 'string',
                format: 'uuid',
                description: 'ID профиля',
                example: '456e7890-f12a-34b5-c678-532614174111'
              },
              avatarUrl: {
                type: 'string',
                description: 'URL аватара',
                example: 'https://example.com/avatar.jpg'
              },
              phone: {
                type: 'string',
                description: 'Телефон компании',
                example: '+77001234567'
              },
              email: {
                type: 'string',
                description: 'Email компании',
                example: 'info@company.com'
              },
              telegram: {
                type: 'string',
                description: 'Telegram',
                example: '@company'
              },
              siteUrl: {
                type: 'string',
                description: 'Сайт компании',
                example: 'https://company.com'
              },
              description: {
                type: 'string',
                description: 'Описание компании',
                example: 'Строительная компания с 10-летним опытом'
              },
              legalEntityType: {
                type: 'object',
                properties: {
                  id: {
                    type: 'integer',
                    description: 'ID типа юрлица',
                    example: 1
                  },
                  name: {
                    type: 'string',
                    description: 'Название типа',
                    example: 'ООО'
                  }
                }
              },
              currency: {
                type: 'object',
                properties: {
                  id: {
                    type: 'integer',
                    description: 'ID валюты',
                    example: 1
                  },
                  code: {
                    type: 'string',
                    description: 'Код валюты',
                    example: 'KZT'
                  },
                  symbol: {
                    type: 'string',
                    description: 'Символ валюты',
                    example: '₸'
                  }
                }
              },
              receivedReviews: {
                type: 'array',
                description: 'Полученные отзывы',
                items: {
                  type: 'object',
                  properties: {
                    rating: {
                      type: 'integer',
                      description: 'Оценка',
                      example: 5
                    },
                    createdAt: {
                      type: 'string',
                      format: 'date-time',
                      description: 'Дата отзыва',
                      example: '2024-01-01T00:00:00.000Z'
                    }
                  }
                }
              }
            }
          },
          workers: {
            type: 'array',
            description: 'Сотрудники компании',
            items: {
              type: 'object',
              properties: {
                id: {
                  type: 'integer',
                  description: 'ID сотрудника',
                  example: 1
                },
                name: {
                  type: 'string',
                  description: 'Имя сотрудника',
                  example: 'Петр Петров'
                },
                position: {
                  type: 'string',
                  description: 'Должность',
                  example: 'Менеджер'
                }
              }
            }
          }
        }
      }
    }),
    ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'Профиль не найден',
      schema: {
        type: 'object',
        properties: {
          statusCode: {
            type: 'integer',
            example: 404
          },
          message: {
            type: 'string',
            example: 'Профиль не найден'
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
