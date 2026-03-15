import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { SendEmailDto } from '../dto/send-email.dto';

/**
 * Документация для эндпоинта отправки email
 * 
 * Этот эндпоинт позволяет отправлять email с возможностью выбора отправителя:
 * - NOREPLY - для автоматических рассылок (подтверждения, уведомления)
 * - SUPPORT - для коммуникации с пользователями (ответы поддержки, важные объявления)
 * 
 * @returns Декораторы Swagger для документации
 */
export const ApiSendEmailOperation = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Отправить email с выбором отправителя',
      description: `
Универсальный метод для отправки email с возможностью выбора отправителя.

**Отправители:**
- **NOREPLY** - автоматические рассылки (код подтверждения, сброс пароля, уведомления)
- **SUPPORT** - коммуникация с пользователями (ответы поддержки, важные объявления)

**Особенности:**
- Поддержка HTML и текстового формата
- Возможность добавления CC и BCC получателей
- Настройка Reply-To адреса
- Автоматический выбор транспорта в зависимости от отправителя

**Примеры использования:**
- Отправка кода подтверждения (NOREPLY)
- Ответ на тикет поддержки (SUPPORT)
- Массовая рассылка объявлений (SUPPORT)
      `,
    }),
    ApiBody({ 
      type: SendEmailDto,
      description: 'Данные для отправки email',
      examples: {
        noreplyExample: {
          summary: 'Пример отправки кода подтверждения (NOREPLY)',
          value: {
            to: 'user@example.com',
            subject: 'Код подтверждения регистрации',
            html: '<p>Ваш код подтверждения: <strong>123456</strong></p>',
            text: 'Ваш код подтверждения: 123456',
            sender: 'noreply',
          },
        },
        supportExample: {
          summary: 'Пример ответа поддержки (SUPPORT)',
          value: {
            to: 'user@example.com',
            subject: 'Ответ по вашему обращению #12345',
            html: '<p>Здравствуйте! Ваше обращение рассмотрено...</p>',
            text: 'Здравствуйте! Ваше обращение рассмотрено...',
            sender: 'support',
            replyTo: 'support@yourdomain.com',
            cc: ['manager@yourdomain.com'],
          },
        },
        broadcastExample: {
          summary: 'Пример массовой рассылки (SUPPORT)',
          value: {
            to: 'user@example.com',
            subject: 'Важное объявление: Обновление сервиса',
            html: '<h1>Внимание!</h1><p>Завтра будет техническое обслуживание...</p>',
            text: 'Внимание! Завтра будет техническое обслуживание...',
            sender: 'support',
            bcc: ['user2@example.com', 'user3@example.com'],
          },
        },
      },
    }),
    ApiResponse({
      status: 200,
      description: 'Email успешно отправлен',
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
            example: 'Email успешно отправлен на user@example.com',
            description: 'Сообщение об успехе',
          },
          messageId: {
            type: 'string',
            example: 'a1b2c3d4e5f6@example.com',
            description: 'ID сообщения в SMTP сервере',
          },
        },
      },
    }),
    ApiResponse({
      status: 400,
      description: 'Ошибка валидации или отправки email',
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
            example: 'Ошибка отправки email',
            description: 'Сообщение об ошибке',
          },
          error: {
            type: 'string',
            example: 'SMTP connection failed: Authentication failed',
            description: 'Детальная информация об ошибке',
          },
        },
      },
      examples: {
        validationError: {
          summary: 'Ошибка валидации',
          value: {
            success: false,
            message: 'Ошибка отправки email',
            error: 'Invalid email format',
          },
        },
        smtpError: {
          summary: 'Ошибка SMTP сервера',
          value: {
            success: false,
            message: 'Ошибка отправки email',
            error: 'SMTP connection failed: Authentication failed',
          },
        },
        configError: {
          summary: 'Ошибка конфигурации',
          value: {
            success: false,
            message: 'Ошибка отправки email',
            error: 'SMTP credentials not configured for sender: SUPPORT',
          },
        },
      },
    }),
  );
