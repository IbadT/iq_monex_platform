import { applyDecorators } from '@nestjs/common';
import { Protected } from './protected.decorator';
import { Public } from './public.decorator';
import { Roles } from './roles.decorator';
import { Permissions } from './permissions.decorator';
import { RateLimit } from './rate-limit.decorator';
import { ApiKeyAuth } from './api-key.decorator';

/**
 * Декоратор для роутов с авторизацией и ограничением скорости
 */
export const AuthenticatedWithRateLimit = (
  limit: number = 100,
  windowMs: number = 60000,
) => {
  return applyDecorators(Protected(), RateLimit(limit, windowMs));
};

/**
 * Декоратор для роутов с ролевой моделью и ограничением скорости
 */
export const RolesWithRateLimit = (
  roles: string[],
  limit: number = 50,
  windowMs: number = 60000,
) => {
  return applyDecorators(Roles(...roles), RateLimit(limit, windowMs));
};

/**
 * Комбинированный декоратор для сложных правил доступа
 */
export const AccessControl = (options: {
  roles?: string[];
  permissions?: string[];
  rateLimit?: { limit: number; windowMs: number };
  requireApiKey?: boolean;
  public?: boolean;
}) => {
  const decorators: any[] = [];

  if (options.public) {
    decorators.push(Public());
  } else {
    decorators.push(Protected());

    if (options.roles?.length) {
      decorators.push(Roles(...options.roles));
    }

    if (options.permissions?.length) {
      decorators.push(Permissions(...options.permissions));
    }

    if (options.requireApiKey) {
      decorators.push(ApiKeyAuth());
    }
  }

  if (options.rateLimit) {
    decorators.push(
      RateLimit(options.rateLimit.limit, options.rateLimit.windowMs),
    );
  }

  return applyDecorators(...decorators);
};
