import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import {
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
} from './api-response.decorator';

/**
 * Декоратор для роутов требующих авторизации
 */
export const Protected = () => {
  return applyDecorators(
    UseGuards(JwtAuthGuard),
    ApiBearerAuth(),
    ApiOperation({
      description:
        'Требуется авторизация (Bearer токен в заголовке Authorization)',
    }),
    ApiUnauthorizedResponse('Отсутствует или неверный токен доступа'),
    ApiForbiddenResponse('Доступ запрещен (недостаточно прав)'),
  );
};
