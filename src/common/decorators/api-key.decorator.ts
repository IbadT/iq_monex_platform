import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { HttpStatus } from '@nestjs/common';

/**
 * Декоратор для API ключей (альтернативная авторизация)
 */
export const ApiKeyAuth = () => {
  return applyDecorators(
    ApiOperation({
      description: 'Требуется API ключ в заголовке X-API-KEY',
    }),
    ApiResponse({
      status: HttpStatus.UNAUTHORIZED,
      description: 'Отсутствует или неверный API ключ',
      schema: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          message: { type: 'string', example: 'Invalid API key' },
          error: { type: 'string', example: 'Unauthorized' },
          statusCode: { type: 'number', example: 401 },
          path: { type: 'string', example: '/api/key-protected-route' },
          timestamp: { type: 'string', example: '2024-01-01T12:00:00.000Z' },
        },
      },
    }),
  );
};
