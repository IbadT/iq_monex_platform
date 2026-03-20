import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

/**
 * Документация для эндпоинта отправки ответа поддержки
 *
 * Этот эндпоинт используется для отправки ответов пользователям по тикетам поддержки.
 * Ответы отправляются через SUPPORT транспорт и поддерживают прямые ответы.
 *
 * @returns Декораторы Swagger для документации
 */
export const ApiSendSupportReplyOperation = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Отправить ответ поддержки',
      description: `
Отправляет ответ пользователя по тикету поддержки.

**Назначение:**
- Ответы на обращения пользователей
- Решение проблем и вопросов
- Предоставление информации
- Взаимодействие с клиентами

**Процесс работы с тикетами:**
1. Пользователь создает обращение
2. Сотрудник поддержки изучает проблему
3. Формируется ответ с решением
4. Ответ отправляется через этот эндпоинт
5. Пользователь может ответить на письмо напрямую

**Особенности отправки:**
- Отправляется через SUPPORT транспорт
- Reply-To настроен на support email
- Поддержка прямых ответов пользователей
- Профессиональный HTML шаблон
- Автоматическая подпись агента

**Содержимое письма:**
- Номер тикета в теме письма
- Приветствие пользователя
- Ответ на вопрос/проблема
- Подпись агента поддержки
- Информация о дальнейших действиях
- Возможность ответить напрямую

**Бизнес-ценность:**
- Быстрое решение проблем клиентов
- Персонализированное обслуживание
- Повышение удовлетворенности клиентов
- Эффективная коммуникация

**Интеграция с CRM:**
- Автоматическое обновление статуса тикета
- Логирование коммуникаций
- Отслеживание времени ответа
- Аналитика качества обслуживания
      `,
    }),
    ApiBody({
      description: 'Данные для отправки ответа поддержки',
      schema: {
        type: 'object',
        required: ['to', 'ticketId', 'message', 'agentName'],
        properties: {
          to: {
            type: 'string',
            format: 'email',
            description: 'Email адрес получателя (клиента)',
            example: 'client@company.com',
          },
          ticketId: {
            type: 'string',
            pattern: '^[A-Z0-9-]+$',
            description: 'Уникальный идентификатор тикета',
            example: 'TICKET-12345',
          },
          message: {
            type: 'string',
            minLength: 10,
            maxLength: 2000,
            description: 'Текст ответа на обращение',
            example:
              'Здравствуйте! Ваше обращение рассмотрено. Проблема связана с...',
          },
          agentName: {
            type: 'string',
            minLength: 2,
            maxLength: 100,
            description: 'Имя агента поддержки',
            example: 'John Smith',
          },
        },
      },
      examples: {
        standardReply: {
          summary: 'Стандартный ответ поддержки',
          value: {
            to: 'john.doe@client.com',
            ticketId: 'TICKET-12345',
            message:
              'Здравствуйте! Ваше обращение по поводу проблемы с входом в систему рассмотрено. Мы обнаружили техническую неполадку и уже исправили ее. Пожалуйста, попробуйте войти снова. Если проблема сохранится, сообщите нам.',
            agentName: 'Alice Johnson',
          },
        },
        technicalSolution: {
          summary: 'Техническое решение',
          value: {
            to: 'techuser@company.org',
            ticketId: 'TICKET-67890',
            message:
              'Добрый день! Проанализировав ваш запрос, мы выяснили, что проблема связана с неверной конфигурацией браузера. Пожалуйста, очистите кэш и cookies, затем перезагрузите страницу. Если это не поможет, попробуйте использовать другой браузер.',
            agentName: 'Bob Wilson',
          },
        },
        billingQuestion: {
          summary: 'Ответ по финансовому вопросу',
          value: {
            to: 'customer@domain.net',
            ticketId: 'TICKET-11111',
            message:
              'Здравствуйте! Касательно вашего вопроса о списании средств - мы проверили транзакцию и обнаружили ошибку. Средства будут возвращены на ваш счет в течение 3-5 рабочих дней. Приносим извинения за неудобства.',
            agentName: 'Carol Davis',
          },
        },
      },
    }),
    ApiResponse({
      status: 200,
      description: 'Ответ поддержки успешно отправлен',
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
            example: 'Ответ поддержки отправлен на client@company.com',
            description: 'Сообщение об успехе',
          },
        },
      },
    }),
    ApiResponse({
      status: 400,
      description: 'Ошибка отправки ответа поддержки',
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
            example: 'Ошибка отправки ответа поддержки',
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
            message: 'Ошибка отправки ответа поддержки',
            error: 'Invalid email address',
          },
        },
        invalidTicketId: {
          summary: 'Неверный формат ID тикета',
          value: {
            success: false,
            message: 'Ошибка отправки ответа поддержки',
            error: 'Invalid ticket ID format: ticket-123',
          },
        },
        shortMessage: {
          summary: 'Слишком короткое сообщение',
          value: {
            success: false,
            message: 'Ошибка отправки ответа поддержки',
            error: 'Message too short (min 10 characters)',
          },
        },
        longMessage: {
          summary: 'Слишком длинное сообщение',
          value: {
            success: false,
            message: 'Ошибка отправки ответа поддержки',
            error: 'Message too long (max 2000 characters)',
          },
        },
        invalidAgentName: {
          summary: 'Неверное имя агента',
          value: {
            success: false,
            message: 'Ошибка отправки ответа поддержки',
            error: 'Agent name cannot be empty',
          },
        },
        smtpError: {
          summary: 'Ошибка SMTP сервера',
          value: {
            success: false,
            message: 'Ошибка отправки ответа поддержки',
            error: 'SUPPORT SMTP not configured',
          },
        },
      },
    }),
  );
