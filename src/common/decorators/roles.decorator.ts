import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { Protected } from './protected.decorator';
import { RolesGuard } from '../guards/roles.guard';
import { ApiForbiddenResponse } from './api-response.decorator';

export const ROLES_KEY = 'roles';

/**
 * Декоратор для роутов с проверкой ролей
 */
export const Roles = (...roles: string[]) => {
  return applyDecorators(
    SetMetadata(ROLES_KEY, roles),
    UseGuards(RolesGuard),
    Protected(),
    ApiForbiddenResponse('Недостаточно прав для выполнения операции'),
  );
};

/**
 * Декоратор для роутов только для администраторов
 */
export const Admin = () => Roles('admin');

/**
 * Декоратор для роутов только для модераторов
 */
export const Moderator = () => Roles('moderator');

/**
 * Декоратор для роутов только для пользователей
 */
export const User = () => Roles('user');
