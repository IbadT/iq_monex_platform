// Экспорт всех декораторов для удобного импорта
export * from './public.decorator';
export * from './protected.decorator';
export * from './roles.decorator';
export * from './permissions.decorator';
export * from './rate-limit.decorator';
export * from './api-key.decorator';
export * from './composite.decorator';
export * from './api-response.decorator';
export * from './current-user.decorator';

// Экспорт констант для guards
export { IS_PUBLIC_KEY } from './public.decorator';
export { ROLES_KEY } from './roles.decorator';
export { PERMISSIONS_KEY } from './permissions.decorator';
export { RATE_LIMIT_KEY } from './rate-limit.decorator';
