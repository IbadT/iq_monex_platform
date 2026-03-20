import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

/**
 * Документация для эндпоинта отправки письма для сброса пароля
 *
 * Этот эндпоинт используется для отправки письма со ссылкой на сброс пароля.
 * Ссылка содержит уникальный токен, действительный 1 час.
 *
 * @returns Декораторы Swagger для документации
 */
export const ApiSendPasswordResetOperation = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Отправить письмо для сброса пароля',
      description: `
Отправляет письмо со ссылкой для сброса пароля пользователя.

**Назначение:**
- Восстановление доступа к аккаунту
- Сброс забытого пароля
- Принудительная смена пароля (администратором)

**Процесс сброса пароля:**
1. Пользователь запрашивает сброс пароля
2. Генерируется уникальный токен (UUID)
3. Токен сохраняется в базе данных со сроком жизни 1 час
4. Отправляется письмо со ссылкой на сброс пароля
5. Пользователь переходит по ссылке и вводит новый пароль
6. Токен аннулируется после использования

**Безопасность:**
- Токен действителен 1 час
- Уникальный токен для каждого запроса
- Автоматическая очистка просроченных токенов
- Ограничение частоты отправки (rate limiting)
- Ссылка содержит только токен (без личных данных)

**Содержимое письма:**
- Информация о запросе сброса пароля
- Кнопка для перехода на страницу сброса
- Ссылка в текстовом формате (для копирования)
- Предупреждение о сроке действия ссылки
- Информация о безопасности

**Особенности:**
- Отправляется через NOREPLY транспорт
- Красивый HTML шаблон с адаптивным дизайном
- Ссылка генерируется на основе APP_URL из конфигурации
- Защита от фишинга (предупреждения о безопасности)
      `,
    }),
    ApiBody({
      description: 'Данные для отправки письма сброса пароля',
      schema: {
        type: 'object',
        required: ['to', 'token'],
        properties: {
          to: {
            type: 'string',
            format: 'email',
            description: 'Email адрес получателя',
            example: 'user@example.com',
          },
          token: {
            type: 'string',
            pattern:
              '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$',
            description: 'Уникальный токен для сброса пароля (UUID v4)',
            example: 'a1b2c3d4-e5f6-7890-abcd-1234567890ab',
          },
        },
      },
      examples: {
        standardExample: {
          summary: 'Стандартный запрос сброса',
          value: {
            to: 'john.doe@company.com',
            token: 'a1b2c3d4-e5f6-7890-abcd-1234567890ab',
          },
        },
        securityExample: {
          summary: 'Запрос после подозрительной активности',
          value: {
            to: 'user@domain.org',
            token: 'f6e5d4c3-b2a1-0987-fedc-ba0987654321',
          },
        },
      },
    }),
    ApiResponse({
      status: 200,
      description: 'Письмо для сброса пароля успешно отправлено',
      schema: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: true,
            description: 'Статус операции',
          },
          message: {
            type: 'string',
            example: 'Письмо для сброса пароля отправлено на user@example.com',
            description: 'Сообщение об успехе',
          },
        },
      },
    }),
    ApiResponse({
      status: 400,
      description: 'Ошибка отправки письма для сброса пароля',
      schema: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: false,
            description: 'Статус операции',
          },
          message: {
            type: 'string',
            example: 'Ошибка отправки письма для сброса пароля',
            description: 'Сообщение об ошибке',
          },
          error: {
            type: 'string',
            description: 'Детальная информация об ошибке',
          },
        },
      },
      examples: {
        invalidEmail: {
          summary: 'Неверный email',
          value: {
            success: false,
            message: 'Ошибка отправки письма для сброса пароля',
            error: 'Invalid email address',
          },
        },
        invalidToken: {
          summary: 'Неверный формат токена',
          value: {
            success: false,
            message: 'Ошибка отправки письма для сброса пароля',
            error: 'Invalid token format: abc123',
          },
        },
        rateLimit: {
          summary: 'Превышен лимит отправки',
          value: {
            success: false,
            message: 'Ошибка отправки письма для сброса пароля',
            error: 'Rate limit exceeded. Please wait 5 minutes.',
          },
        },
        configError: {
          summary: 'Ошибка конфигурации',
          value: {
            success: false,
            message: 'Ошибка отправки письма для сброса пароля',
            error: 'APP_URL not configured',
          },
        },
      },
    }),
  );
