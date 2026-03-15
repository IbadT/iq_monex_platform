import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { ResendEmailDto } from '../dto/resend-email.dto';

export const ApiResendEmailOperation = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Отправить код подтверждения повторно',
      description: 'Отправляет новый 5-значный код подтверждения на email пользователя. Используется, если предыдущий код истек или не был получен.',
    }),
    ApiBody({
      type: ResendEmailDto,
      description: 'Email адрес для повторной отправки кода',
      examples: {
        valid: {
          summary: 'Пример запроса',
          value: {
            email: 'user@example.com',
          },
        },
      },
    }),
    ApiResponse({
      status: 200,
      description: 'Код успешно отправлен',
      schema: {
        type: 'object',
        properties: {
          message: { 
            type: 'string', 
            example: 'Код подтверждения отправлен на ваш email' 
          },
          status: { 
            type: 'number', 
            example: 200 
          },
        },
      },
    }),
    ApiResponse({
      status: 404,
      description: 'Пользователь не найден',
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number', example: 404 },
          message: { 
            type: 'string', 
            example: 'Пользователь с таким email не найден' 
          },
        },
      },
    }),
    ApiResponse({
      status: 409,
      description: 'Email уже подтвержден',
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number', example: 409 },
          message: { 
            type: 'string', 
            example: 'Email уже подтвержден' 
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
