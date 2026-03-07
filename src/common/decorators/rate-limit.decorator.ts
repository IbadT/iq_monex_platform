import { applyDecorators, SetMetadata } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { HttpStatus } from '@nestjs/common';

export const RATE_LIMIT_KEY = 'rateLimit';

/**
 * Декоратор для роутов с ограничением скорости запросов
 */
export const RateLimit = (limit: number, windowMs: number) => {
  return applyDecorators(
    SetMetadata(RATE_LIMIT_KEY, { limit, windowMs }),
    ApiResponse({
      status: HttpStatus.TOO_MANY_REQUESTS,
      description: `Слишком много запросов. Лимит: ${limit} запросов в ${windowMs / 1000} секунд`,
      schema: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          message: { type: 'string', example: 'Too many requests' },
          error: { type: 'string', example: 'Too Many Requests' },
          statusCode: { type: 'number', example: 429 },
          path: { type: 'string', example: '/api/rate-limited-route' },
          timestamp: { type: 'string', example: '2024-01-01T12:00:00.000Z' },
        },
      },
    }),
  );
};
