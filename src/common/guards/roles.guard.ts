import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    console.log('user', user);
    // Если пользователя нет, отклоняем доступ
    if (!user) {
      return false;
    }

    // Поддерживаем разные форматы хранения ролей
    // Сравниваем с role (название роли) или с code (код роли)
    const userRole = user.role || user.code;

    // Если role это строка, сравниваем напрямую
    if (typeof userRole === 'string') {
      return requiredRoles.includes(userRole);
    }

    // Если role это массив, проверяем вхождение
    if (Array.isArray(userRole)) {
      return requiredRoles.some((role) => userRole.includes(role));
    }

    return false;
  }
}
