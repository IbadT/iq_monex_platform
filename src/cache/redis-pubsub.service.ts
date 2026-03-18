import { AppLogger } from '@/common/logger/logger.service';
import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, RedisClientType } from 'redis';

// interface PubSubMessage {
//   channel: string;
//   pattern?: string;
//   data: any;
// }

@Injectable()
export class RedisPubSubService implements OnModuleInit, OnModuleDestroy {
  private publisher!: RedisClientType;
  private subscriber!: RedisClientType;

  //   Каналы
  readonly CHANNELS = {
    NOTIFICATIONS: 'app:notifications',
    USER_STATUS: 'app:user:status',
    CHAT_MESSAGES: 'app:chat:messages',
    TYPING: 'app:chat:typing',
    SYSTEM: 'app:system',
  } as const;

  private handlers = new Map<string, ((message: any) => void)[]>();

  constructor(
    private readonly configService: ConfigService,
    private readonly logger: AppLogger,
  ) {}

  async onModuleInit() {
    const redisUrl = this.configService.get<string>(
      'REDIS_URL',
      'redis://redis:6379',
    );

    this.publisher = createClient({ url: redisUrl });
    this.subscriber = createClient({ url: redisUrl });

    await Promise.all([this.publisher.connect(), this.subscriber.connect()]);

    this.logger.log('Redis Pub/Sub connected');
  }

  async onModuleDestroy() {
    await Promise.all([this.publisher.quit(), this.subscriber.quit()]);
    this.logger.log('Redis Pub/Sub disconnected');
  }

  //   Публикация сообщения
  async publish(channel: string, message: any): Promise<void> {
    try {
      if (!this.publisher) {
        this.logger.warn(
          'Redis publisher not available, skipping publish to',
          channel,
        );
        return;
      }
      await this.publisher.publish(channel, JSON.stringify(message));
    } catch (error) {
      this.logger.error(`Failed to publish to ${channel}: `, error);
    }
  }

  //   Подписка на канал
  async subscribe(
    channel: string,
    handler: (message: any) => void,
  ): Promise<void> {
    // Проверяем инициализацию
    if (!this.publisher || !this.subscriber) {
      this.logger.warn(
        'Redis Pub/Sub not available, skipping subscription to',
        channel,
      );
      return;
    }

    if (!this.handlers.has(channel)) {
      this.handlers.set(channel, []);

      await this.subscriber.subscribe(channel, (rawMessage) => {
        try {
          const parsed = JSON.parse(rawMessage);
          this.handlers.get(channel)?.forEach((h) => h(parsed));
        } catch (error) {
          this.logger.error(`Failed to parse message from ${channel}: `, error);
        }
      });
    }

    this.handlers.get(channel)?.push(handler);
  }

  // Отписка
  async unsubscribe(
    channel: string,
    handler?: (message: any) => void,
  ): Promise<void> {
    if (!handler) {
      // отписываемся полностью
      await this.subscriber.unsubscribe(channel);
      this.handlers.delete(channel);
      return;
    }

    const handlers = this.handlers.get(channel);
    if (handlers) {
      const index = handlers.indexOf(handler);
      if (index > -1) {
        handlers.splice(index, 1);
      }
      if (handlers.length === 0) {
        await this.subscriber.unsubscribe(channel);
        this.handlers.delete(channel);
      }
    }
  }

  //   Публикация метаданными
  async publishWithMeta(
    channel: string,
    data: any,
    meta?: Record<string, any>,
  ): Promise<void> {
    await this.publish(channel, {
      data,
      meta: {
        timestamp: new Date().toISOString(),
        serverId: this.configService.get<string>('SERVER_ID') || 'unknown',
        ...meta,
      },
    });
  }
}
