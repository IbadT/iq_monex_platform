import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

/**
 * Документация для эндпоинта отправки кода подтверждения
 *
 * Этот эндпоинт используется для отправки кодов подтверждения email адреса.
 * Коды действительны в течение 15 минут и отправляются через NOREPLY транспорт.
 *
 * @returns Декораторы Swagger для документации
 */
export const ApiSendVerificationCodeOperation = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Отправить код подтверждения',
      description: `
Отправляет код подтверждения на указанный email адрес.

**Назначение:**
- Подтверждение email при регистрации
- Восстановление доступа к аккаунту
- Проверка смены email адреса

**Особенности:**
- Код состоит из 6 цифр
- Действителен 15 минут
- Отправляется через NOREPLY транспорт
- HTML шаблон с красивым оформлением

**Процесс:**
1. Генерируется случайный 6-значный код
2. Сохраняется в базе данных с временем жизни 15 минут
3. Отправляется email с кодом
4. Пользователь вводит код для подтверждения

**Безопасность:**
- Ограничение частоты отправки (rate limiting)
- Уникальный код для каждой попытки
- Автоматическая очистка просроченных кодов
      `,
    }),
    ApiBody({
      description: 'Данные для отправки кода подтверждения',
      schema: {
        type: 'object',
        required: ['to', 'code'],
        properties: {
          to: {
            type: 'string',
            format: 'email',
            description: 'Email адрес получателя',
            example: 'user@example.com',
          },
          code: {
            type: 'string',
            pattern: '^[0-9]{6}$',
            description: '6-значный код подтверждения',
            example: '123456',
          },
        },
      },
      examples: {
        standardExample: {
          summary: 'Стандартный запрос',
          value: {
            to: 'user@example.com',
            code: '123456',
          },
        },
        registrationExample: {
          summary: 'Подтверждение регистрации',
          value: {
            to: 'john.doe@company.com',
            code: '789012',
          },
        },
        passwordResetExample: {
          summary: 'Сброс пароля',
          value: {
            to: 'user@domain.org',
            code: '345678',
          },
        },
      },
    }),
    ApiResponse({
      status: 200,
      description: 'Код подтверждения успешно отправлен',
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
            example: 'Код подтверждения отправлен на user@example.com',
            description: 'Сообщение об успехе',
          },
        },
      },
    }),
    ApiResponse({
      status: 400,
      description: 'Ошибка отправки кода подтверждения',
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
            example: 'Ошибка отправки кода подтверждения',
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
            message: 'Ошибка отправки кода подтверждения',
            error: 'Invalid email address: invalid-email',
          },
        },
        invalidCode: {
          summary: 'Неверный формат кода',
          value: {
            success: false,
            message: 'Ошибка отправки кода подтверждения',
            error: 'Code must be 6 digits: abc123',
          },
        },
        rateLimit: {
          summary: 'Превышен лимит отправки',
          value: {
            success: false,
            message: 'Ошибка отправки кода подтверждения',
            error: 'Rate limit exceeded. Please wait 60 seconds.',
          },
        },
        smtpError: {
          summary: 'Ошибка SMTP',
          value: {
            success: false,
            message: 'Ошибка отправки кода подтверждения',
            error: 'SMTP connection failed',
          },
        },
      },
    }),
  );
