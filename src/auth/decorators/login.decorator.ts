import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { HttpStatus } from '@nestjs/common';
import { LoginResponseDto } from '../dto/login-response.dto';

export const ApiLoginOperation = () => {
  return applyDecorators(
    ApiOperation({
      summary: 'Вход пользователя',
      description: 'Аутентификация пользователя и возврат JWT токенов',
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Успешный вход',
      type: LoginResponseDto,
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
            example: ['Некорректный email', 'Пароль не может быть пустым'],
          },
          error: { type: 'string', example: 'Bad Request' },
          statusCode: { type: 'number', example: 400 },
          path: { type: 'string', example: '/auth/sign-in' },
          timestamp: { type: 'string', example: '2024-01-01T12:00:00.000Z' },
        },
      },
    }),
    ApiResponse({
      status: HttpStatus.UNAUTHORIZED,
      description: 'Неверный пароль',
      schema: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          message: { type: 'string', example: 'Неверный пароль' },
          error: { type: 'string', example: 'Unauthorized' },
          statusCode: { type: 'number', example: 401 },
          path: { type: 'string', example: '/auth/sign-in' },
          timestamp: { type: 'string', example: '2024-01-01T12:00:00.000Z' },
        },
      },
    }),
    ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'Пользователь не найден',
      schema: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          message: {
            type: 'string',
            example: 'Пользователь с email: user@example.com не найден',
          },
          error: { type: 'string', example: 'Not Found' },
          statusCode: { type: 'number', example: 404 },
          path: { type: 'string', example: '/auth/sign-in' },
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
          path: { type: 'string', example: '/auth/sign-in' },
          timestamp: { type: 'string', example: '2024-01-01T12:00:00.000Z' },
        },
      },
    }),
  );
};
