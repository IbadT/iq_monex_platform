import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';
import { ChangeListingStatusDto } from '../dto/request/change-listing-status.dto';

export function ApiChangeStatusDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Изменить статус объявления',
      description: `
Изменяет статус существующего объявления. Поддерживает переходы между всеми статусами.

**Возможные статусы и их назначение:**

📝 **DRAFT** - Черновик
- Сохраняет объявление как черновик
- Можно продолжить редактирование позже
- Не отображается в поиске

📋 **TEMPLATE** - Шаблон  
- Сохраняет как шаблон для быстрых публикаций
- Можно использовать как основу для новых объявлений
- Не отображается в поиске

🚀 **PUBLISHED** - Публикация
- Публикует объявление в общем доступе
- Отображается в поиске и каталоге
- Доступно для всех пользователей

📁 **ARCHIVED** - Архив
- Убирает объявление из публичного доступа
- Сохраняет в личном кабинете
- Авто-удаление через 60 дней

**Правила переходов:**
- Из любого статуса можно перейти в любой другой
- При публикации требуются все обязательные поля
- Архивированные объявления нельзя снова опубликовать без восстановления
      `,
    }),
    ApiBody({
      type: ChangeListingStatusDto,
      description: 'Данные для изменения статуса объявления',
      examples: {
        publish: {
          summary: 'Публикация черновика',
          description: 'Переводит черновик в статус опубликованного объявления',
          value: {
            status: 'PUBLISHED',
          },
        },
        archive: {
          summary: 'Аривирование объявления',
          description: 'Убирает объявление из публичного доступа',
          value: {
            status: 'ARCHIVED',
          },
        },
        draft: {
          summary: 'Возврат в черновик',
          description: 'Возвращает опубликованное объявление в статус черновика',
          value: {
            status: 'DRAFT',
          },
        },
        template: {
          summary: 'Сохранение как шаблон',
          description: 'Сохраняет объявление как шаблон для будущих публикаций',
          value: {
            status: 'TEMPLATE',
          },
        },
      },
    }),
    ApiResponse({
      status: 200,
      description: 'Статус объявления успешно изменен',
      schema: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            example: '123e4567-e89b-12d3-a456-426614174000',
            description: 'UUID объявления',
          },
          status: {
            type: 'string',
            enum: ['DRAFT', 'PUBLISHED', 'TEMPLATE', 'ARCHIVED'],
            example: 'PUBLISHED',
            description: 'Новый статус объявления',
          },
          publishedAt: {
            type: 'string',
            format: 'date-time',
            example: '2024-01-15T10:30:00Z',
            description: 'Дата публикации (только для PUBLISHED)',
          },
          archivedAt: {
            type: 'string',
            format: 'date-time',
            example: '2024-01-15T10:30:00Z',
            description: 'Дата архивации (только для ARCHIVED)',
          },
          autoDeleteAt: {
            type: 'string',
            format: 'date-time',
            example: '2024-03-15T10:30:00Z',
            description: 'Дата авто-удаления (только для ARCHIVED)',
          },
        },
      },
    }),
    ApiResponse({
      status: 400,
      description: 'Ошибка валидации или неверный переход статуса',
      schema: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
            example: 'Для публикации обязательны поля: title, description, price',
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
      status: 401,
      description: 'Пользователь не авторизован',
    }),
    ApiResponse({
      status: 403,
      description: 'Доступ запрещен (не владелец объявления)',
    }),
    ApiResponse({
      status: 404,
      description: 'Объявление не найдено',
    }),
    ApiResponse({
      status: 500,
      description: 'Внутренняя ошибка сервера',
    }),
  );
}
