import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import { EmailMessage } from './interfaces/email-message.interface';
import { AppLogger } from '@/common/logger/logger.service';

@Injectable()
export class RabbitmqService implements OnModuleInit, OnModuleDestroy {
  private client!: ClientProxy;

  constructor(private readonly logger: AppLogger) {}

  async onModuleInit() {
    try {
      this.client = ClientProxyFactory.create({
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://admin:admin123@localhost:5672'],
          queue: 'auth_queue',
          queueOptions: {
            durable: true,
          },
          prefetchCount: 1,
        },
      });

      await this.client.connect();
      this.logger.log('RabbitMQ клиент успешно подключен');
    } catch (error) {
      this.logger.error('Ошибка подключения к RabbitMQ:', error);
      throw error;
    }
  }

  async sendEmail(message: EmailMessage): Promise<void> {
    this.client.emit('send_email', message);
  }

  async onModuleDestroy() {
    await this.client.close();
  }
}
