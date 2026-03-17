import { RoleType } from '../enums/role-type.enum';

export const roles = [
  { code: 'SUPER_ADMIN', role: 'Супер администратор', type: RoleType.ADMIN },
  { code: 'USER', role: 'Пользователь', type: RoleType.USER },
  { code: 'USER_PREMIUM', role: 'Премиум', type: RoleType.USER },
  { code: 'ADMIN', role: 'Администратор', type: RoleType.WORKER },
  { code: 'MODERATOR', role: 'Модератор', type: RoleType.WORKER },
  { code: 'SUPPORT', role: 'Поддержка', type: RoleType.WORKER },
  { code: 'INSTALLER', role: 'Монтажёр', type: RoleType.WORKER },
  { code: 'MANAGER', role: 'Менеджер', type: RoleType.WORKER },
  { code: 'FINANCE', role: 'Финансы', type: RoleType.WORKER },
];

export const rolesCode = ["SUPER_ADMIN", "USER", "USER_PREMIUM", "ADMIN", "MODERATOR", "SUPPORT", "INSTALLER", "MANAGER", "FINANCE"];