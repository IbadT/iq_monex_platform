import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';
import { ChangeListingStatusDto } from '../dto/request/change-listing-status.dto';
import { ChangeStatusResponseDto } from '../dto/response/change-status-response.dto';

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
            listingId: '123e4567-e89b-12d3-a456-426614174000',
          },
        },
        archive: {
          summary: 'Аривирование объявления',
          description: 'Убирает объявление из публичного доступа',
          value: {
            status: 'ARCHIVED',
            listingId: '123e4567-e89b-12d3-a456-426614174000',
          },
        },
        draft: {
          summary: 'Возврат в черновик',
          description:
            'Возвращает опубликованное объявление в статус черновика',
          value: {
            status: 'DRAFT',
            listingId: '123e4567-e89b-12d3-a456-426614174000',
          },
        },
        template: {
          summary: 'Сохранение как шаблон',
          description: 'Сохраняет объявление как шаблон для будущих публикаций',
          value: {
            status: 'TEMPLATE',
            listingId: '123e4567-e89b-12d3-a456-426614174000',
          },
        },
      },
    }),
    ApiResponse({
      status: 200,
      description: 'Статус объявления успешно изменен',
      type: ChangeStatusResponseDto,
    }),
    ApiResponse({
      status: 400,
      description: 'Ошибка валидации или неверный переход статуса',
      schema: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
            example:
              'Для публикации обязательны поля: title, description, price',
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
