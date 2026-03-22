import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { HttpStatus } from '@nestjs/common';

export function ApiGetUserListingsDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Получить объявления пользователя',
      description: 'Возвращает все объявления указанного пользователя',
    }),
    ApiParam({
      name: 'user_id',
      description: 'UUID пользователя',
      required: true,
      example: '123e4567-e89b-12d3-a456-426614174000'
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Список объявлений пользователя успешно получен',
      schema: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'ID объявления',
              example: '123e4567-e89b-12d3-a456-426614174000'
            },
            title: {
              type: 'string',
              description: 'Заголовок объявления',
              example: 'Продам автомобиль'
            },
            description: {
              type: 'string',
              description: 'Описание объявления',
              example: 'Отличное состояние, пробег 50000 км'
            },
            price: {
              type: 'number',
              description: 'Цена',
              example: 2500000
            },
            status: {
              type: 'string',
              description: 'Статус объявления',
              example: 'PUBLISHED',
              enum: ['PUBLISHED', 'DRAFT', 'ARCHIVED', 'TEMPLATE']
            },
            category: {
              type: 'object',
              properties: {
                id: {
                  type: 'integer',
                  description: 'ID категории',
                  example: 1
                },
                name: {
                  type: 'string',
                  description: 'Название категории',
                  example: 'Транспорт'
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
            priceUnit: {
              type: 'object',
              properties: {
                id: {
                  type: 'integer',
                  description: 'ID единицы измерения',
                  example: 1
                },
                name: {
                  type: 'string',
                  description: 'Название единицы измерения',
                  example: 'Штуки'
                }
              }
            },
            photos: {
              type: 'array',
              description: 'Фотографии объявления',
              items: {
                type: 'object',
                properties: {
                  id: {
                    type: 'string',
                    description: 'ID файла'
                  },
                  url: {
                    type: 'string',
                    description: 'URL файла'
                  },
                  sortOrder: {
                    type: 'integer',
                    description: 'Порядок сортировки'
                  }
                }
              }
            },
            files: {
              type: 'array',
              description: 'Документы объявления',
              items: {
                type: 'object',
                properties: {
                  id: {
                    type: 'string',
                    description: 'ID файла'
                  },
                  url: {
                    type: 'string',
                    description: 'URL файла'
                  },
                  sortOrder: {
                    type: 'integer',
                    description: 'Порядок сортировки'
                  }
                }
              }
            },
            locations: {
              type: 'array',
              description: 'Местоположения объявления',
              items: {
                type: 'object',
                properties: {
                  id: {
                    type: 'string',
                    description: 'ID локации'
                  },
                  latitude: {
                    type: 'number',
                    description: 'Широта',
                    example: 43.2389
                  },
                  longitude: {
                    type: 'number',
                    description: 'Долгота',
                    example: 76.9097
                  },
                  address: {
                    type: 'string',
                    description: 'Адрес',
                    example: 'г. Алматы, ул. Абая 123'
                  }
                }
              }
            },
            specifications: {
              type: 'array',
              description: 'Спецификации объявления',
              items: {
                type: 'object',
                properties: {
                  id: {
                    type: 'string',
                    description: 'ID спецификации'
                  },
                  name: {
                    type: 'string',
                    description: 'Название спецификации',
                    example: 'Состояние'
                  },
                  value: {
                    type: 'string',
                    description: 'Значение',
                    example: 'Отличное'
                  }
                }
              }
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
