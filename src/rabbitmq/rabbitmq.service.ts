import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import { EmailMessage } from './interfaces/email-message.interface';
import { FileUploadMessage } from './interfaces/file-upload-message.interface';
import { AppLogger } from '@/common/logger/logger.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RabbitmqService implements OnModuleInit, OnModuleDestroy {
  private emailClient!: ClientProxy;
  private fileUploadClient!: ClientProxy;

  constructor(
    private readonly configService: ConfigService,
    private readonly logger: AppLogger
  ) {}

  async onModuleInit() {
    try {
      // Клиент для email сообщений
      this.emailClient = ClientProxyFactory.create({
        transport: Transport.RMQ,
        options: {
          urls: [this.configService.get('RABBITMQ_URL')],
          queue: 'auth_queue',
          queueOptions: {
            durable: true,
          },
          prefetchCount: 1,
        },
      });

      // Клиент для загрузки файлов
      this.fileUploadClient = ClientProxyFactory.create({
        transport: Transport.RMQ,
        options: {
          urls: [this.configService.get('RABBITMQ_URL')],
          queue: 'file_upload_queue',
          queueOptions: {
            durable: true,
          },
          prefetchCount: 1,
        },
      });

      await this.emailClient.connect();
      await this.fileUploadClient.connect();
      this.logger.log('RabbitMQ клиенты успешно подключены');
    } catch (error) {
      this.logger.error('Ошибка подключения к RabbitMQ:', error);
      throw error;
    }
  }

  async onModuleDestroy() {
    await this.emailClient.close();
    await this.fileUploadClient.close();
  }

  async sendEmail(message: EmailMessage): Promise<void> {
    this.emailClient.emit('send_email', message);
  }

  async sendFileUpload(message: FileUploadMessage): Promise<void> {
    this.fileUploadClient.emit('file_upload', message);
    this.logger.log(`File upload task sent to queue: ${message.s3Key}`);
  }
}
