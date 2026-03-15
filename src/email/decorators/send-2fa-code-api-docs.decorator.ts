import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

/**
 * Документация для эндпоинта отправки 2FA кода
 * 
 * Этот эндпоинт используется для отправки кодов двухфакторной аутентификации.
 * Коды действительны в течение 5 минут и отправляются через NOREPLY транспорт.
 * 
 * @returns Декораторы Swagger для документации
 */
export const ApiSend2FACodeOperation = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Отправить 2FA код',
      description: `
Отправляет код двухфакторной аутентификации для дополнительной защиты аккаунта.

**Назначение:**
- Двухфакторная аутентификация при входе
- Подтверждение критических действий
- Защита от несанкционированного доступа
- Повышение безопасности аккаунта

**Когда используется 2FA:**
- Вход с нового устройства/IP адреса
- Подтверждение финансов операций
- Изменение настроек безопасности
- Доступ к конфиденциальным данным

**Процесс аутентификации:**
1. Пользователь вводит логин и пароль
2. Система проверяет учетные данные
3. Генерируется 6-значный 2FA код
4. Код отправляется на registered email
5. Пользователь вводит код для завершения входа
6. Код аннулируется после использования

**Безопасность:**
- Код действителен 5 минут (короче чем для email подтверждения)
- Уникальный код для каждой попытки
- Ограничение попыток ввода (max 5)
- Автоматическая блокировка при подозрительной активности
- Логирование всех 2FA попыток

**Особенности:**
- Отправляется через NOREPLY транспорт
- Минималистичный HTML шаблон (быстрая загрузка)
- Крупный шрифт для удобного чтения
- Четкие инструкции по использованию

**Защита от атак:**
- Rate limiting (1 код в минуту)
- Блокировка после 5 неверных попыток
- Мониторинг подозрительных паттернов
- Автоматическое уведомление о безопасности

**Пользовательский опыт:**
- Быстрая доставка кода
- Простота использования
- Четкие инструкции
- Возможность повторной отправки
      `,
    }),
    ApiBody({
      description: 'Данные для отправки 2FA кода',
      schema: {
        type: 'object',
        required: ['to', 'code'],
        properties: {
          to: {
            type: 'string',
            format: 'email',
            description: 'Email адрес получателя (зарегистрированный email пользователя)',
            example: 'user@example.com',
          },
          code: {
            type: 'string',
            pattern: '^[0-9]{6}$',
            description: '6-значный код двухфакторной аутентификации',
            example: '789012',
          },
        },
      },
      examples: {
        loginExample: {
          summary: '2FA при входе в систему',
          value: {
            to: 'john.doe@company.com',
            code: '123456',
          },
        },
        newDeviceExample: {
          summary: 'Вход с нового устройства',
          value: {
            to: 'user@domain.org',
            code: '345678',
          },
        },
        securityExample: {
          summary: 'Подтверждение критического действия',
          value: {
            to: 'admin@secure.net',
            code: '901234',
          },
        },
      },
    }),
    ApiResponse({
      status: 200,
      description: '2FA код успешно отправлен',
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
            example: '2FA код отправлен на user@example.com',
            description: 'Сообщение об успехе',
          },
        },
      },
    }),
    ApiResponse({
      status: 400,
      description: 'Ошибка отправки 2FA кода',
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
            example: 'Ошибка отправки 2FA кода',
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
            message: 'Ошибка отправки 2FA кода',
            error: 'Invalid email address',
          },
        },
        invalidCode: {
          summary: 'Неверный формат кода',
          value: {
            success: false,
            message: 'Ошибка отправки 2FA кода',
            error: 'Code must be 6 digits: abc123',
          },
        },
        rateLimit: {
          summary: 'Превышен лимит отправки',
          value: {
            success: false,
            message: 'Ошибка отправки 2FA кода',
            error: 'Rate limit exceeded. Please wait 60 seconds.',
          },
        },
        accountLocked: {
          summary: 'Аккаунт заблокирован',
          value: {
            success: false,
            message: 'Ошибка отправки 2FA кода',
            error: 'Account locked due to suspicious activity',
          },
        },
        smtpError: {
          summary: 'Ошибка SMTP сервера',
          value: {
            success: false,
            message: 'Ошибка отправки 2FA кода',
            error: 'SMTP connection failed',
          },
        },
      },
    }),
  );
