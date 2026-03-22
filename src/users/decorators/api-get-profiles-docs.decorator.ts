import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { HttpStatus } from '@nestjs/common';

export function ApiGetProfilesDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Получить все профили',
      description: 'Возвращает список профилей с поддержкой поиска, фильтрации и пагинации',
    }),
    ApiQuery({
      name: 'limit',
      description: 'Количество профилей для возврата',
      required: false,
      example: 10,
      minimum: 1,
      maximum: 100
    }),
    ApiQuery({
      name: 'offset',
      description: 'Смещение для пагинации',
      required: false,
      example: 0,
      minimum: 0
    }),
    ApiQuery({
      name: 'query',
      description: 'Поисковый запрос для фильтрации по названию компании',
      required: false,
      example: 'Строительная компания'
    }),
    ApiQuery({
      name: 'ratingMin',
      description: 'Минимальный рейтинг компании',
      required: false,
      example: 4.5,
      minimum: 0,
      maximum: 5
    }),
    ApiQuery({
      name: 'activityIds',
      description: 'Массив ID активностей для фильтрации',
      required: false,
      example: ['123e4567-e89b-12d3-a456-426614174000'],
      isArray: true
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Список профилей успешно получен',
      schema: {
        type: 'object',
        properties: {
          rows: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: {
                  type: 'string',
                  format: 'uuid',
                  description: 'ID профиля',
                  example: '550e8400-e29b-41d4-a716-446655440000'
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
          },
          pagination: {
            type: 'object',
            properties: {
              total: {
                type: 'integer',
                description: 'Общее количество профилей',
                example: 150
              },
              limit: {
                type: 'integer',
                description: 'Лимит результатов',
                example: 10
              },
              offset: {
                type: 'integer',
                description: 'Смещение',
                example: 0
              },
              hasMore: {
                type: 'boolean',
                description: 'Есть ли еще результаты',
                example: true
              }
            }
          },
          searchMeta: {
            type: 'object',
            properties: {
              query: {
                type: 'string',
                description: 'Поисковый запрос',
                example: 'Строительная компания'
              },
              totalFound: {
                type: 'integer',
                description: 'Найдено профилей',
                example: 25
              },
              maxScore: {
                type: 'number',
                description: 'Максимальный релевантный балл',
                example: 2.5
              }
            }
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
