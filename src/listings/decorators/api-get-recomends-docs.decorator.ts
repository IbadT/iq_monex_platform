import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { HttpStatus } from '@nestjs/common';

export function ApiGetRecomendsDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Получить рекомендации по объявлению',
      description: 'Возвращает похожие объявления на основе категории и цены',
    }),
    ApiQuery({
      name: 'limit',
      description: 'Лимит результатов',
      required: false,
      example: 10
    }),
    ApiQuery({
      name: 'offset',
      description: 'Смещение для пагинации',
      required: false,
      example: 0
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Рекомендации успешно получены',
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
              example: 'Смартфон iPhone 13'
            },
            price: {
              type: 'number',
              description: 'Цена',
              example: 50000
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
                  example: 'Электроника'
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
                    example: 'Новое'
                  }
                }
              }
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Дата создания',
              example: '2024-01-01T00:00:00.000Z'
            }
          }
        }
      }
    }),
    ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'Объявление не найдено',
      schema: {
        type: 'object',
        properties: {
          statusCode: {
            type: 'integer',
            example: 404
          },
          message: {
            type: 'string',
            example: 'Объявление не найдено'
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
