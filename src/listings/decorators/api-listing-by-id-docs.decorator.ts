import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { ListingStatus } from '../enums/listing-status.enum';

export function ApiListingByIdDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Получить объявление по ID',
      description: `
Получает объявление по его уникальному идентификатору с возможностью фильтрации по статусу.

## Параметры запроса:

### 📍 **Path параметр:**
- **id** (string, UUID): Уникальный идентификатор объявления

### 🔍 **Query параметры:**
- **status** (enum, опционально): Фильтр по статусу объявления
  - \`DRAFT\` - Черновик
  - \`PUBLISHED\` - Опубликовано
  - \`TEMPLATE\` - Шаблон
  - \`ARCHIVED\` - Архив

## Примеры запросов:

### 📋 **Базовые запросы:**
\`\`\`bash
# Получить объявление по ID
GET /listings/123e4567-e89b-12d3-a456-426614174000

# Получить только опубликованное объявление
GET /listings/123e4567-e89b-12d3-a456-426614174000?status=PUBLISHED

# Получить только черновик
GET /listings/123e4567-e89b-12d3-a456-426614174000?status=DRAFT

# Получить только шаблон
GET /listings/123e4567-e89b-12d3-a456-426614174000?status=TEMPLATE
\`\`\`
      `,
    }),

    // Query параметр
    ApiQuery({
      name: 'status',
      required: false,
      enum: Object.values(ListingStatus),
      description: 'Фильтр по статусу объявления',
      example: 'PUBLISHED',
    }),

    // Path параметр
    ApiParam({
      name: 'id',
      required: true,
      type: 'string',
      format: 'uuid',
      description: 'UUID объявления',
      example: '123e4567-e89b-12d3-a456-426614174000',
    }),

    // Успешный ответ
    ApiResponse({
      status: 200,
      description: 'Объявление успешно получено',
      schema: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            format: 'uuid',
            example: '123e4567-e89b-12d3-a456-426614174000',
            description: 'UUID объявления',
          },
          categoryId: {
            type: 'number',
            example: 1,
            description: 'ID категории',
          },
          title: {
            type: 'string',
            example: 'iPhone 13 Pro Max',
            description: 'Заголовок объявления',
          },
          description: {
            type: 'string',
            example: 'Отличное состояние, использовался 6 месяцев',
            description: 'Описание объявления',
          },
          price: {
            type: 'number',
            example: 85000,
            description: 'Цена объявления',
          },
          condition: {
            type: 'string',
            enum: ['NEW', 'USED'],
            example: 'USED',
            description: 'Состояние товара',
          },
          status: {
            type: 'string',
            enum: ['DRAFT', 'PUBLISHED', 'TEMPLATE', 'ARCHIVED'],
            example: 'PUBLISHED',
            description: 'Статус объявления',
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
            example: '2024-01-15T10:30:00Z',
            description: 'Дата создания',
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
            example: '2024-01-15T10:30:00Z',
            description: 'Дата обновления',
          },
          viewsCount: {
            type: 'number',
            example: 150,
            description: 'Количество просмотров',
          },
          favoritesCount: {
            type: 'number',
            example: 25,
            description: 'Количество добавлений в избранное',
          },
          category: {
            type: 'object',
            properties: {
              id: { type: 'number', example: 1 },
              name: { type: 'string', example: 'Электроника' },
            },
          },
          currency: {
            type: 'object',
            properties: {
              id: { type: 'number', example: 1 },
              name: { type: 'string', example: 'RUB' },
              symbol: { type: 'string', example: '₽' },
            },
          },
          priceUnit: {
            type: 'object',
            properties: {
              id: { type: 'number', example: 1 },
              name: { type: 'string', example: 'штука' },
            },
          },
          files: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'string', example: 'file-uuid' },
                url: {
                  type: 'string',
                  example: 'https://example.com/file.pdf',
                },
                fileName: { type: 'string', example: 'document.pdf' },
                fileSize: { type: 'number', example: 1024000 },
                kind: {
                  type: 'string',
                  enum: ['DOCUMENT', 'PHOTO'],
                  example: 'DOCUMENT',
                },
              },
            },
          },
          locations: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'string', example: 'location-uuid' },
                type: {
                  type: 'string',
                  enum: [
                    'OFFICE',
                    'INDUSTRIAL',
                    'LAND',
                    'RETAIL',
                    'RESIDENTIAL',
                  ],
                  example: 'OFFICE',
                },
                latitude: { type: 'number', example: 55.7558 },
                longitude: { type: 'number', example: 37.6173 },
              },
            },
          },
          specifications: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'string', example: 'spec-uuid' },
                key: { type: 'string', example: 'brand' },
                value: { type: 'string', example: 'Apple' },
                type: {
                  type: 'string',
                  enum: ['TEXT', 'NUMBER', 'BOOLEAN'],
                  example: 'TEXT',
                },
              },
            },
          },
        },
      },
    }),

    // Ошибки
    ApiResponse({
      status: 404,
      description: 'Объявление не найдено',
      schema: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
            example: 'Объявление не найдено',
            description: 'Описание ошибки',
          },
          error: {
            type: 'string',
            example: 'Not Found',
          },
          statusCode: {
            type: 'number',
            example: 404,
          },
        },
      },
    }),
    ApiResponse({
      status: 400,
      description: 'Ошибка валидации параметров',
      schema: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
            example: 'Invalid UUID format',
            description: 'Описание ошибки валидации',
          },
          error: {
            type: 'string',
            example: 'Bad Request',
          },
          statusCode: {
            type: 'number',
            example: 400,
          },
        },
      },
    }),
    ApiResponse({
      status: 403,
      description: 'Нет прав доступа',
      schema: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
            example: 'Нет прав доступа к этому объявлению',
            description: 'Описание ошибки',
          },
          error: {
            type: 'string',
            example: 'Forbidden',
          },
          statusCode: {
            type: 'number',
            example: 403,
          },
        },
      },
    }),
  );
}
