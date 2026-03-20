import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

/**
 * Документация для эндпоинта отправки приветственного письма
 *
 * Этот эндпоинт используется для отправки приветственных писем новым пользователям.
 * Письмо содержит приветствие, информацию о сервисе и ссылку на приложение.
 *
 * @returns Декораторы Swagger для документации
 */
export const ApiSendWelcomeOperation = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Отправить приветственное письмо',
      description: `
Отправляет приветственное письмо новому пользователю.

**Назначение:**
- Приветствие нового пользователя
- Информация о возможностях сервиса
- Первичная навигация по приложению
- Установление первого контакта

**Содержимое письма:**
- Персонализированное приветствие с именем пользователя
- Краткая информация о сервисе
- Кнопка для перехода в приложение
- Контактная информация поддержки
- Информация о том, что письмо автоматическое

**Особенности:**
- Отправляется через NOREPLY транспорт
- Красивый HTML шаблон с адаптивным дизайном
- Персонализация по имени пользователя
- Ссылка на приложение из конфигурации

**Когда отправляется:**
- Сразу после успешной регистрации
- После подтверждения email адреса
- При приглашении нового пользователя в команду

**Психологический эффект:**
- Позитивное первое впечатление
- Чувство приветствия
- Мотивация к использованию сервиса
      `,
    }),
    ApiBody({
      description: 'Данные для отправки приветственного письма',
      schema: {
        type: 'object',
        required: ['to', 'userName'],
        properties: {
          to: {
            type: 'string',
            format: 'email',
            description: 'Email адрес получателя',
            example: 'user@example.com',
          },
          userName: {
            type: 'string',
            minLength: 1,
            maxLength: 100,
            description: 'Имя пользователя для персонализации',
            example: 'John Doe',
          },
        },
      },
      examples: {
        standardExample: {
          summary: 'Стандартное приветствие',
          value: {
            to: 'john.doe@company.com',
            userName: 'John Doe',
          },
        },
        russianName: {
          summary: 'Приветствие с русским именем',
          value: {
            to: 'ivan.petrov@domain.ru',
            userName: 'Иван Петров',
          },
        },
        simpleExample: {
          summary: 'Простое приветствие',
          value: {
            to: 'user@domain.org',
            userName: 'Alex',
          },
        },
      },
    }),
    ApiResponse({
      status: 200,
      description: 'Приветственное письмо успешно отправлено',
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
            example: 'Приветственное письмо отправлено на user@example.com',
            description: 'Сообщение об успехе',
          },
        },
      },
    }),
    ApiResponse({
      status: 400,
      description: 'Ошибка отправки приветственного письма',
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
            example: 'Ошибка отправки приветственного письма',
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
            message: 'Ошибка отправки приветственного письма',
            error: 'Invalid email address',
          },
        },
        emptyName: {
          summary: 'Пустое имя пользователя',
          value: {
            success: false,
            message: 'Ошибка отправки приветственного письма',
            error: 'User name cannot be empty',
          },
        },
        nameTooLong: {
          summary: 'Слишком длинное имя',
          value: {
            success: false,
            message: 'Ошибка отправки приветственного письма',
            error: 'User name too long (max 100 characters)',
          },
        },
        smtpError: {
          summary: 'Ошибка SMTP сервера',
          value: {
            success: false,
            message: 'Ошибка отправки приветственного письма',
            error: 'SMTP connection failed',
          },
        },
      },
    }),
  );
