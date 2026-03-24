import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { ListingStatus } from '../enums/listing-status.enum';
import { ListingResposeDto } from '../dto/response/listing-response.dto';

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
      type: ListingResposeDto,
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
