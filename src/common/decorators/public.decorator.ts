import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';

/**
 * Декоратор для публичных роутов (без авторизации)
 */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
