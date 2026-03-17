import { applyDecorators } from '@nestjs/common';
import { ApiQuery, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ListingStatus } from '../enums/listing-status.enum';

// Enum для состояния
enum ListingCondition {
  NEW = 'NEW',
  USED = 'USED',
}

export function ApiListingQueryDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Получить список объявлений',
      description: `
Получает список объявлений с поддержкой пагинации, фильтрации и поиска.

## Параметры запроса:

### 📄 **Пагинация:**
- **limit** (number, по умолчанию 20): Количество объявлений на странице (максимум 100)
- **offset** (number, по умолчанию 0): Смещение для пагинации

### 🔍 **Фильтрация:**
- **status** (enum): Фильтр по статусу объявления
  - \`DRAFT\` - Черновик
  - \`PUBLISHED\` - Опубликовано
  - \`TEMPLATE\` - Шаблон
  - \`ARCHIVED\` - Архив

- **condition** (enum): Фильтр по состоянию товара
  - \`NEW\` - Новый
  - \`USED\` - Б/У

### 🔎 **Поиск:**
- **search** (string): Поиск по названию и описанию объявления (нечувствительный к регистру)

## Примеры запросов:

### 📋 **Базовые запросы:**
\`\`\`bash
# Получить все объявления (первые 20)
GET /listings

# Пагинация
GET /listings?limit=10&offset=20

# Фильтр по статусу
GET /listings?status=PUBLISHED

# Фильтр по состоянию
GET /listings?condition=NEW

# Поиск
GET /listings?search=iPhone
\`\`\`

### 🎯 **Комбинированные запросы:**
\`\`\`bash
# Опубликованные новые товары
GET /listings?status=PUBLISHED&condition=NEW

# Поиск с пагинацией
GET /listings?search=MacBook&limit=5&offset=10

# Шаблоны б/у товаров
GET /listings?status=TEMPLATE&condition=USED
\`\`\`

## Поля пагинации:

- **total** (number): Общее количество объявлений
- **limit** (number): Количество на странице
- **offset** (number): Текущее смещение
- **hasMore** (boolean): Есть ли еще объявления

## Сортировка:

Объявления сортируются по дате создания в обратном порядке (сначала новые).
      `,
    }),

    // Параметры пагинации
    ApiQuery({
      name: 'limit',
      required: false,
      type: Number,
      description: 'Количество объявлений на странице (1-100, по умолчанию 20)',
      example: 20,
    }),
    ApiQuery({
      name: 'offset',
      required: false,
      type: Number,
      description: 'Смещение для пагинации (по умолчанию 0)',
      example: 0,
    }),

    // Параметры фильтрации
    ApiQuery({
      name: 'status',
      required: false,
      enum: Object.values(ListingStatus),
      description: 'Фильтр по статусу объявления',
      example: 'PUBLISHED',
    }),
    ApiQuery({
      name: 'condition',
      required: false,
      enum: Object.values(ListingCondition),
      description: 'Фильтр по состоянию товара',
      example: 'USED',
    }),

    // Параметр поиска
    ApiQuery({
      name: 'search',
      required: false,
      type: String,
      description: 'Поиск по названию и описанию (нечувствительный к регистру)',
      example: 'iPhone',
    }),

    // Ответы
    ApiResponse({
      status: 200,
      description: 'Список объявлений успешно получен',
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
              },
            },
          },
          pagination: {
            type: 'object',
            properties: {
              total: {
                type: 'number',
                example: 150,
                description: 'Общее количество объявлений',
              },
              limit: {
                type: 'number',
                example: 20,
                description: 'Количество на странице',
              },
              offset: {
                type: 'number',
                example: 0,
                description: 'Текущее смещение',
              },
              hasMore: {
                type: 'boolean',
                example: true,
                description: 'Есть ли еще объявления',
              },
            },
          },
        },
      },
    }),
    ApiResponse({
      status: 400,
      description: 'Ошибка валидации параметров запроса',
      schema: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
            example: 'limit must not be greater than 100',
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
  );
}
