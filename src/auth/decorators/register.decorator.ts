import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { HttpStatus } from '@nestjs/common';
import { RegisterResponseDto } from '../dto/register-response.dto';

export const ApiRegisterOperation = () => {
  return applyDecorators(
    ApiOperation({
      summary: 'Регистрация пользователя',
      description: 'Создание нового пользователя и возврат JWT токенов',
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Пользователь успешно зарегистрирован',
      type: RegisterResponseDto,
    }),
    ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: 'Ошибка валидации данных',
      schema: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          message: { 
            type: 'array', 
            items: { type: 'string' },
            example: ['Некорректный email', 'Пароль должен содержать минимум 6 символов']
          },
          error: { type: 'string', example: 'Bad Request' },
          statusCode: { type: 'number', example: 400 },
          path: { type: 'string', example: '/auth/sign-up' },
          timestamp: { type: 'string', example: '2024-01-01T12:00:00.000Z' },
        },
      },
    }),
    ApiResponse({
      status: HttpStatus.CONFLICT,
      description: 'Пользователь с таким email уже существует',
      schema: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          message: { type: 'string', example: 'Пользователь с таким email: user@example.com уже зарегистрирован' },
          error: { type: 'string', example: 'Conflict' },
          statusCode: { type: 'number', example: 409 },
          path: { type: 'string', example: '/auth/sign-up' },
          timestamp: { type: 'string', example: '2024-01-01T12:00:00.000Z' },
        },
      },
    }),
    ApiResponse({
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      description: 'Внутренняя ошибка сервера',
      schema: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          message: { type: 'string', example: 'Internal server error' },
          error: { type: 'string', example: 'Internal Server Error' },
          statusCode: { type: 'number', example: 500 },
          path: { type: 'string', example: '/auth/sign-up' },
          timestamp: { type: 'string', example: '2024-01-01T12:00:00.000Z' },
        },
      },
    }),
  );
};
