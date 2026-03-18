import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { ApiUnauthorizedResponse, ApiForbiddenResponse } from './api-response.decorator';

export const ROLES_KEY = 'roles';

/**
 * Декоратор для роутов с проверкой ролей
 */
export const Roles = (...roles: string[]) => {
  return applyDecorators(
    UseGuards(JwtAuthGuard, RolesGuard),
    SetMetadata(ROLES_KEY, roles),
    ApiBearerAuth(),
    ApiOperation({
      description: `Требуется авторизация и роль: ${roles.join(', ')}`,
    }),
    ApiUnauthorizedResponse('Отсутствует или неверный токен доступа'),
    ApiForbiddenResponse('Недостаточно прав для выполнения операции'),
  );
};

/**
 * Декоратор для роутов только для администраторов
 */
export const Admin = () => Roles('SUPER_ADMIN');

/**
 * Декоратор для роутов только для модераторов
 */
export const Moderator = () => Roles('MODERATOR');

/**
 * Декоратор для роутов только для пользователей
 */
export const User = () => Roles('USER');
