import { Injectable, Logger } from '@nestjs/common';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { ConfigService } from '@nestjs/config';
import type { Redis as RedisType } from 'ioredis';

export interface ISetRedisData<T> {
  baseKey: string;
  ttl?: number;
  value: T;
}

@Injectable()
export class CacheService {
  private readonly REGISTRATION_PREFIX = 'reg:';
  private readonly REGISTRATION_TTL = 300;
  private readonly MAX_ATTEMPTS = 3;

  private readonly logger = new Logger(CacheService.name);
  private readonly defaultTTL: number;
  private readonly keyPrefix: string;

  constructor(
    @InjectRedis() private readonly redis: RedisType,
    private readonly configService: ConfigService,
  ) {
    this.defaultTTL = this.configService.get<number>('CACHE_TTL') || 3600; // 1 час по умолчанию
    this.keyPrefix = this.configService.get<string>('CACHE_PREFIX') || 'app';
  }

  /**
   * Генерация ключей для пользователей
   */
  private getUserKeys = {
    byId: (id: string) => `${this.keyPrefix}:user:id:${id}`,
    byEmail: (email: string) => `${this.keyPrefix}:user:email:${email}`,
  };

  /**
   * Генерация ключей для токенов
   */
  private getAuthKeys = {
    accessToken: (userId: string) => `${this.keyPrefix}:auth:access:${userId}`,
    refreshToken: (userId: string) =>
      `${this.keyPrefix}:auth:refresh:${userId}`,
    blacklistedToken: (token: string) =>
      `${this.keyPrefix}:auth:blacklist:${token}`,
  };

  /**
   * Установить значение в кэш
   */
  async set<T>({
    baseKey,
    ttl = this.defaultTTL,
    value,
  }: ISetRedisData<T>): Promise<void> {
    try {
      const serializedValue = JSON.stringify(value);
      await this.redis.setex(baseKey, ttl, serializedValue);
      this.logger.debug(`Cache set for key: ${baseKey}, TTL: ${ttl}s`);
    } catch (error) {
      this.logger.error(`Failed to set cache for key ${baseKey}:`, error);
      throw error;
    }
  }

  /**
   * Получить значение из кэша
   */
  async get<T>(key: string): Promise<T | null> {
    try {
      const value = await this.redis.get(key);
      if (value === null) {
        this.logger.debug(`Cache miss for key: ${key}`);
        return null;
      }

      // const parsedValue = JSON.parse(value) as T;
      const parsedValue: T = JSON.parse(value);
      this.logger.debug(`Cache hit for key: ${key}`);
      return parsedValue;
    } catch (error) {
      this.logger.error(`Failed to get cache for key ${key}:`, error);
      return null;
    }
  }

  /**
   * Удалить значение из кэша
   */
  async del(key: string): Promise<void> {
    try {
      await this.redis.del(key);
      this.logger.debug(`Cache deleted for key: ${key}`);
    } catch (error) {
      this.logger.error(`Failed to delete cache for key ${key}:`, error);
      throw error;
    }
  }

  /**
   * Проверить существует ли ключ в кэше
   */
  async exists(key: string): Promise<boolean> {
    try {
      const result = await this.redis.exists(key);
      return result === 1;
    } catch (error) {
      this.logger.error(
        `Failed to check cache existence for key ${key}:`,
        error,
      );
      return false;
    }
  }

  /**
   * Установить TTL для существующего ключа
   */
  async expire(key: string, ttl: number): Promise<void> {
    try {
      await this.redis.expire(key, ttl);
      this.logger.debug(`TTL set for key: ${key}, TTL: ${ttl}s`);
    } catch (error) {
      this.logger.error(`Failed to set TTL for key ${key}:`, error);
      throw error;
    }
  }

  /**
   * Получить оставшееся время жизни ключа
   */
  async ttl(key: string): Promise<number> {
    try {
      return await this.redis.ttl(key);
    } catch (error) {
      this.logger.error(`Failed to get TTL for key ${key}:`, error);
      return -1;
    }
  }

  /**
   * Очистить весь кэш (осторожно!)
   */
  async flush(): Promise<void> {
    try {
      await this.redis.flushdb();
      this.logger.warn('Cache flushed');
    } catch (error) {
      this.logger.error('Failed to flush cache:', error);
      throw error;
    }
  }

  /**
   * Установить значение с автоматическим ключом на основе параметров
   */
  async setWithParams<T>(
    baseKey: string,
    params: Record<string, any>,
    value: T,
    ttl?: number,
  ): Promise<void> {
    const key = this.buildKey(baseKey, params);
    await this.set({ baseKey: key, ttl, value });
  }

  /**
   * Получить значение с автоматическим ключом на основе параметров
   */
  async getWithParams<T>(
    baseKey: string,
    params: Record<string, any>,
  ): Promise<T | null> {
    const key = this.buildKey(baseKey, params);
    return this.get<T>(key);
  }

  /**
   * Построить ключ на основе базового ключа и параметров
   */
  private buildKey(baseKey: string, params: Record<string, any>): string {
    const paramString = Object.entries(params)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, value]) => `${key}:${value}`)
      .join(':');
    return `${this.keyPrefix}:${baseKey}:${paramString}`;
  }

  /**
   * Инкремент числового значения
   */
  async increment(key: string, amount = 1): Promise<number> {
    try {
      const result = await this.redis.incrby(key, amount);
      this.logger.debug(`Incremented key: ${key} by ${amount}`);
      return result;
    } catch (error) {
      this.logger.error(`Failed to increment key ${key}:`, error);
      throw error;
    }
  }

  /**
   * Декремент числового значения
   */
  async decrement(key: string, amount = 1): Promise<number> {
    try {
      const result = await this.redis.decrby(key, amount);
      this.logger.debug(`Decremented key: ${key} by ${amount}`);
      return result;
    } catch (error) {
      this.logger.error(`Failed to decrement key ${key}:`, error);
      throw error;
    }
  }

  /**
   * Методы для работы с пользователями
   */
  async getUserById(id: string): Promise<any> {
    return this.get(this.getUserKeys.byId(id));
  }

  async setUserById(id: string, user: any, ttl?: number): Promise<void> {
    await this.set({ baseKey: this.getUserKeys.byId(id), value: user, ttl });
  }

  async getUserByEmail(email: string): Promise<any> {
    return this.get(this.getUserKeys.byEmail(email));
  }

  async setUserByEmail(email: string, user: any, ttl?: number): Promise<void> {
    await this.set({
      baseKey: this.getUserKeys.byEmail(email),
      value: user,
      ttl,
    });
  }

  async invalidateUserCache(userId: string, email: string): Promise<void> {
    await Promise.all([
      this.del(this.getUserKeys.byId(userId)),
      this.del(this.getUserKeys.byEmail(email)),
    ]);
  }

  /**
   * Методы для работы с токенами
   */
  async setAccessToken(
    userId: string,
    token: string,
    ttl?: number,
  ): Promise<void> {
    await this.set({
      baseKey: this.getAuthKeys.accessToken(userId),
      value: token,
      ttl,
    });
  }

  async getAccessToken(userId: string): Promise<string | null> {
    return this.get(this.getAuthKeys.accessToken(userId));
  }

  async setRefreshToken(
    userId: string,
    token: string,
    ttl?: number,
  ): Promise<void> {
    await this.set({
      baseKey: this.getAuthKeys.refreshToken(userId),
      value: token,
      ttl,
    });
  }

  async getRefreshToken(userId: string): Promise<string | null> {
    return this.get(this.getAuthKeys.refreshToken(userId));
  }

  async blacklistToken(token: string, ttl?: number): Promise<void> {
    await this.set({
      baseKey: this.getAuthKeys.blacklistedToken(token),
      value: true,
      ttl,
    });
  }

  async isTokenBlacklisted(token: string): Promise<boolean> {
    return this.exists(this.getAuthKeys.blacklistedToken(token));
  }

  async invalidateAuthTokens(userId: string): Promise<void> {
    await Promise.all([
      this.del(this.getAuthKeys.accessToken(userId)),
      this.del(this.getAuthKeys.refreshToken(userId)),
    ]);
  }
}
