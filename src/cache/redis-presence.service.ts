// modules/redis/redis-presence.service.ts
import { Injectable } from '@nestjs/common';
import { RedisPubSubService } from './redis-pubsub.service';

interface PresenceData {
  userId: string;
  status: 'online' | 'offline';
  sockets: string[];
  lastSeen?: string;
  serverId: string;
}

@Injectable()
export class RedisPresenceService {
  private readonly PRESENCE_PREFIX = 'presence:';
  private readonly PRESENCE_TTL = 60 * 5; // 5 минут

  constructor(private redisPubSub: RedisPubSubService) {}

  // Установить пользователя онлайн
  async setOnline(
    userId: string,
    socketId: string,
    serverId: string,
  ): Promise<void> {
    const key = `${this.PRESENCE_PREFIX}${userId}`;

    // Получаем текущие сокеты
    const existing = await this.getPresence(userId);
    const sockets = existing?.sockets || [];

    if (!sockets.includes(socketId)) {
      sockets.push(socketId);
    }

    const data: PresenceData = {
      userId,
      status: 'online',
      sockets,
      serverId,
    };

    // Сохраняем в Redis с TTL
    await this.redisPubSub['publisher'].setEx(
      key,
      this.PRESENCE_TTL,
      JSON.stringify(data),
    );

    // Публикуем изменение статуса
    await this.redisPubSub.publish(this.redisPubSub.CHANNELS.USER_STATUS, {
      userId,
      status: 'online',
      serverId,
      socketCount: sockets.length,
    });
  }

  // Установить офлайн (один сокет)
  async setOffline(
    userId: string,
    socketId: string,
    serverId: string,
  ): Promise<void> {
    const key = `${this.PRESENCE_PREFIX}${userId}`;
    const existing = await this.getPresence(userId);

    if (!existing) return;

    const sockets = existing.sockets.filter((s) => s !== socketId);

    if (sockets.length === 0) {
      // Полностью офлайн
      const data: PresenceData = {
        userId,
        status: 'offline',
        sockets: [],
        lastSeen: new Date().toISOString(),
        serverId,
      };

      await this.redisPubSub['publisher'].setEx(
        key,
        this.PRESENCE_TTL * 6, // Храним lastSeen дольше (30 мин)
        JSON.stringify(data),
      );

      await this.redisPubSub.publish(this.redisPubSub.CHANNELS.USER_STATUS, {
        userId,
        status: 'offline',
        serverId,
        lastSeen: data.lastSeen,
      });
    } else {
      // Ещё есть сокеты
      existing.sockets = sockets;
      await this.redisPubSub['publisher'].setEx(
        key,
        this.PRESENCE_TTL,
        JSON.stringify(existing),
      );
    }
  }

  // Получить статус пользователя
  async getPresence(userId: string): Promise<PresenceData | null> {
    const key = `${this.PRESENCE_PREFIX}${userId}`;
    const data = await this.redisPubSub['publisher'].get(key);

    if (!data) return null;

    try {
      return JSON.parse(data);
    } catch {
      return null;
    }
  }

  // Проверить онлайн
  async isOnline(userId: string): Promise<boolean> {
    const presence = await this.getPresence(userId);
    return presence?.status === 'online';
  }

  // Получить несколько пользователей
  async getMultiplePresence(
    userIds: string[],
  ): Promise<Map<string, PresenceData>> {
    const pipeline = this.redisPubSub['publisher'].multi();

    userIds.forEach((id) => {
      pipeline.get(`${this.PRESENCE_PREFIX}${id}`);
    });

    const results = await pipeline.exec();
    const map = new Map<string, PresenceData>();

    results?.forEach((result, index) => {
      if (result && typeof result === 'object' && 'reply' in result) {
        const data = result.reply as string | null;
        if (data) {
          try {
            map.set(userIds[index], JSON.parse(data));
          } catch {
            // ignore
          }
        }
      }
    });

    return map;
  }

  // Продлить TTL (heartbeat)
  async refreshPresence(userId: string): Promise<void> {
    const key = `${this.PRESENCE_PREFIX}${userId}`;
    const exists = await this.redisPubSub['publisher'].exists(key);

    if (exists) {
      await this.redisPubSub['publisher'].expire(key, this.PRESENCE_TTL);
    }
  }
}
