import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { VerifyCodeDto } from '../dto/verify-code.dto';
import { VerifyCodeResponseDto } from '../dto/verify-code.dto';

export const ApiVerifyEmailOperation = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Подтвердить email адрес',
      description:
        'Подтверждает email пользователя с помощью 5-значного кода, отправленного на почту',
    }),
    ApiBody({
      type: VerifyCodeDto,
      description: 'Данные для подтверждения email',
      examples: {
        valid: {
          summary: 'Пример запроса',
          value: {
            email: 'user@example.com',
            code: '123456',
          },
        },
      },
    }),
    ApiResponse({
      status: 200,
      description: 'Email успешно подтвержден',
      type: VerifyCodeResponseDto,
      example: {
        message: 'Email успешно подтвержден',
        status: 200,
      },
    }),
    ApiResponse({
      status: 401,
      description: 'Ошибка подтверждения',
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number', example: 401 },
          message: {
            type: 'string',
            examples: {
              sessionExpired: {
                value:
                  'Сессия регистрации истекла. Пожалуйста, зарегистрируйтесь заново.',
              },
              invalidCode: { value: 'Неверный код подтверждения' },
              userNotFound: { value: 'Пользователь не найден' },
            },
          },
        },
      },
    }),
    ApiResponse({
      status: 400,
      description: 'Ошибка валидации данных',
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number', example: 400 },
          message: {
            type: 'string',
            example: 'Validation failed',
          },
          errors: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                property: { type: 'string' },
                constraints: { type: 'object' },
              },
            },
          },
        },
      },
    }),
  );
