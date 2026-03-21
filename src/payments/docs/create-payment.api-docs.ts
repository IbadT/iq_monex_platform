import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreatePaymentDto, PaymentType } from '../dto/create-payment.dto';

export const CreatePaymentApiDocs = applyDecorators(
  ApiTags('Payments'),
  ApiOperation({
    summary: 'Создание платежа',
    description: `
    Создает платеж для различных типов операций:
    
    **1. EXTEND_PACKAGES** - Продление пакетов на 100 дней
    - Требует packageIds массив
    - Продлевает указанные пакеты на 100 дней
    
    **2. EXTEND_BASE_SUBSCRIPTION** - Продление базовой подписки на 30 дней
    - Создает новый период подписки или продлевает существующую
    - Базовая подписка включает 100 слотов на 30 дней
    
    **3. BUY_ADDITIONAL_PACKAGE** - Покупка дополнительного пакета
    - Создает новый пакет с 100 слотами на 30 дней
    
    **4. BUY_BASE_SUBSCRIPTION** - Покупка базовой подписки на 30 дней
    - Создает новую базовую подписку с 100 слотами на 30 дней
    
    **5. DONATION** - Пожертвование
    - Принимает пожертвования без создания слотов
    
    Все параметры цены и количества дней передаются от пользователя.
    `,
  }),
  ApiBody({
    type: CreatePaymentDto,
    examples: {
      extendPackages: {
        summary: 'Продление пакетов',
        description: 'Продление нескольких пакетов на 100 дней',
        value: {
          paymentType: PaymentType.EXTEND_PACKAGES,
          packageIds: ['uuid1', 'uuid2', 'uuid3'],
          amount: 1500.0,
          currency: 'RUB',
          daysCount: 100,
        },
      },
      extendBaseSubscription: {
        summary: 'Продление базовой подписки',
        description: 'Продление или покупка базовой подписки на 30 дней',
        value: {
          paymentType: PaymentType.EXTEND_BASE_SUBSCRIPTION,
          amount: 500.0,
          currency: 'RUB',
          daysCount: 30,
        },
      },
      buyAdditionalPackage: {
        summary: 'Покупка дополнительного пакета',
        description: 'Покупка нового пакета с 100 слотами на 30 дней',
        value: {
          paymentType: PaymentType.BUY_ADDITIONAL_PACKAGE,
          amount: 800.0,
          currency: 'RUB',
          daysCount: 30,
        },
      },
      buyBaseSubscription: {
        summary: 'Покупка базовой подписки',
        description: 'Покупка новой базовой подписки с 100 слотами на 30 дней',
        value: {
          paymentType: PaymentType.BUY_BASE_SUBSCRIPTION,
          amount: 500.0,
          currency: 'RUB',
          daysCount: 30,
        },
      },
      donation: {
        summary: 'Пожертвование',
        description: 'Просто пожертвование без создания слотов',
        value: {
          paymentType: PaymentType.DONATION,
          amount: 100.0,
          currency: 'RUB',
          daysCount: 1,
        },
      },
    },
  }),
  ApiResponse({
    status: 201,
    description: 'Платеж успешно создан',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', description: 'ID платежа в YooKassa' },
        status: { type: 'string', description: 'Статус платежа' },
        confirmationUrl: {
          type: 'string',
          description: 'URL для редиректа на оплату',
        },
        amount: { type: 'number', description: 'Сумма платежа' },
        currency: { type: 'string', description: 'Валюта платежа' },
      },
    },
  }),
  ApiResponse({
    status: 400,
    description: 'Ошибка валидации или бизнес-логики',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: { type: 'string', example: 'Bad Request' },
        error: {
          type: 'string',
          example: 'У пользователя достигнуто максимальное количество пакетов',
        },
      },
    },
  }),
  ApiResponse({
    status: 401,
    description: 'Пользователь не авторизован',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 401 },
        message: { type: 'string', example: 'Unauthorized' },
      },
    },
  }),
  ApiResponse({
    status: 503,
    description: 'Ошибка платежной системы',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 503 },
        message: { type: 'string', example: 'Service Unavailable' },
        error: { type: 'string', example: 'Ошибка создания платежа' },
      },
    },
  }),
);
