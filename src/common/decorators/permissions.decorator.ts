import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { Protected } from './protected.decorator';
import { PermissionsGuard } from '../guards/permissions.guard';
import { ApiForbiddenResponse } from './api-response.decorator';

export const PERMISSIONS_KEY = 'permissions';

/**
 * Декоратор для роутов с проверкой прав доступа
 */
export const Permissions = (...permissions: string[]) => {
  return applyDecorators(
    SetMetadata(PERMISSIONS_KEY, permissions),
    UseGuards(PermissionsGuard),
    Protected(),
    ApiForbiddenResponse('Недостаточно прав для выполнения операции'),
  );
};
