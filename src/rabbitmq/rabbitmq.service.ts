import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import * as amqp from 'amqplib';
import { EmailMessage } from './interfaces/email-message.interface';
import { FileUploadMessage } from './interfaces/file-upload-message.interface';
import { ReviewFileUploadMessage } from './interfaces/review-file-upload-message.interface';
import { AppLogger } from '@/common/logger/logger.service';
import { ConfigService } from '@nestjs/config';
import { Channel, ChannelModel } from 'amqplib';

@Injectable()
export class RabbitmqService implements OnModuleInit, OnModuleDestroy {
  private connection: ChannelModel | null = null;
  private emailChannel: Channel | null = null;
  private fileUploadChannel: Channel | null = null;

  constructor(
    private readonly configService: ConfigService,
    private readonly logger: AppLogger,
  ) {}

  async onModuleInit() {
    try {
      const rabbitmqUrl =
        this.configService.get('RABBITMQ_URL') ||
        'amqp://admin:admin123@rabbitmq:5672';

      this.connection = await amqp.connect(rabbitmqUrl);
      this.emailChannel = await this.connection.createChannel();
      this.fileUploadChannel = await this.connection.createChannel();

      if (!this.emailChannel || !this.fileUploadChannel) {
        throw new Error('Failed to create RabbitMQ channels');
      }

      // Устанавливаем prefetch
      await this.emailChannel.prefetch(1);
      await this.fileUploadChannel.prefetch(1);

      // Объявляем очереди
      await this.emailChannel.assertQueue('auth_queue', { durable: true });
      await this.fileUploadChannel.assertQueue('file_upload_queue', {
        durable: true,
      });
      await this.fileUploadChannel.assertQueue('review_file_upload_queue', {
        durable: true,
      });

      this.logger.log('RabbitMQ клиенты успешно подключены');
    } catch (error) {
      this.logger.error('Ошибка подключения к RabbitMQ:', error);
      throw error;
    }
  }

  async onModuleDestroy() {
    try {
      if (this.emailChannel) {
        await this.emailChannel.close();
      }
      if (this.fileUploadChannel) {
        await this.fileUploadChannel.close();
      }
      if (this.connection) {
        await this.connection.close();
      }
    } catch (error) {
      this.logger.error('Ошибка отключения от RabbitMQ:', error);
    }
  }

  async sendEmail(message: EmailMessage): Promise<void> {
    if (!this.emailChannel) {
      throw new Error('Email channel not initialized');
    }

    this.emailChannel.sendToQueue(
      'auth_queue',
      Buffer.from(
        JSON.stringify({
          pattern: 'send_email',
          data: message,
        }),
      ),
      { persistent: true },
    );
  }

  async sendFileUpload(message: FileUploadMessage): Promise<void> {
    if (!this.fileUploadChannel) {
      throw new Error('File upload channel not initialized');
    }

    this.fileUploadChannel.sendToQueue(
      'file_upload_queue',
      Buffer.from(JSON.stringify(message)),
      { persistent: true },
    );
    this.logger.log(`File upload task sent to queue: ${message.s3Key}`);
  }

  async sendReviewFileUpload(message: ReviewFileUploadMessage): Promise<void> {
    if (!this.fileUploadChannel) {
      throw new Error('File upload channel not initialized');
    }

    this.fileUploadChannel.sendToQueue(
      'review_file_upload_queue',
      Buffer.from(JSON.stringify(message)),
      { persistent: true },
    );
    this.logger.log(`Review file upload task sent to queue: ${message.s3Key}`);
  }
}
