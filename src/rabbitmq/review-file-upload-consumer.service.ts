import {
  Injectable,
  Logger,
  OnModuleInit,
  OnModuleDestroy,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as amqp from 'amqplib';
import { S3Service } from '@/s3/s3.service';
import { ReviewFileUploadMessage } from './interfaces/review-file-upload-message.interface';
import { Channel, ConsumeMessage } from 'amqplib';
import { prisma } from '@/lib/prisma';

@Injectable()
export class ReviewFileUploadConsumerService
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(ReviewFileUploadConsumerService.name);
  private connection: any = null;
  private channel: Channel | null = null;

  constructor(
    private readonly s3Service: S3Service,
    private readonly configService: ConfigService,
  ) {}

  async onModuleInit() {
    try {
      const rabbitmqUrl =
        this.configService.get('RABBITMQ_URL') ||
        'amqp://admin:admin123@rabbitmq:5672';

      this.connection = await amqp.connect(rabbitmqUrl);
      this.channel = await this.connection.createChannel();

      if (!this.channel) {
        throw new Error('Failed to create RabbitMQ channel');
      }

      // Устанавливаем prefetch
      await this.channel.prefetch(1);

      // Объявляем очередь
      await this.channel.assertQueue('review_file_upload_queue', {
        durable: true,
      });

      this.logger.log('Review File Upload Consumer подключен к RabbitMQ');

      // Начинаем потреблять сообщения
      this.logger.log(
        'Начато потребление сообщений из очереди review_file_upload_queue',
      );

      await this.channel.consume(
        'review_file_upload_queue',
        this.handleMessage.bind(this),
      );
    } catch (error) {
      this.logger.error('Ошибка подключения к RabbitMQ:', error);
    }
  }

  async onModuleDestroy() {
    try {
      if (this.channel) {
        await this.channel.close();
      }
      if (this.connection) {
        await this.connection.close();
      }
      this.logger.log('Review File Upload Consumer отключен от RabbitMQ');
    } catch (error) {
      this.logger.error('Ошибка отключения от RabbitMQ:', error);
    }
  }

  private async handleMessage(msg: ConsumeMessage | null): Promise<void> {
    if (!msg) {
      this.logger.warn('Получено пустое сообщение');
      return;
    }

    try {
      const content = msg.content.toString();
      const message: ReviewFileUploadMessage = JSON.parse(content);

      this.logger.log(
        `Получено сообщение для загрузки файла review: ${message.s3Key}`,
      );

      await this.handleReviewFileUpload(message);

      // Подтверждаем успешную обработку
      this.channel?.ack(msg);
    } catch (error) {
      this.logger.error('Ошибка обработки сообщения:', error);

      // Отклоняем сообщение
      this.channel?.nack(msg, false, false);
    }
  }

  private async handleReviewFileUpload(
    message: ReviewFileUploadMessage,
  ): Promise<void> {
    const { reviewId, fileIndex, fileData, contentType, s3Key } = message;

    this.logger.log(
      `Processing review file upload: ${s3Key} for review: ${reviewId}`,
    );
    this.logger.log(`File data length: ${fileData.length} characters`);

    try {
      // Загружаем файл в S3
      const buffer = this.s3Service.base64ToBuffer(fileData);
      this.logger.log(`Buffer created, size: ${buffer.length} bytes`);

      const s3Url = await this.s3Service.upload(buffer, s3Key, contentType);
      this.logger.log(`S3 upload result: ${s3Url}`);

      if (s3Url) {
        // Обновляем запись в базе данных с URL из S3
        const updatedFile = await prisma.reviewFile.updateMany({
          where: {
            reviewId,
            sortOrder: fileIndex,
          },
          data: {
            url: s3Url,
            s3Key,
            s3Bucket: this.configService.get<string>('S3_BUCKET_NAME') || '',
          },
        });

        this.logger.log(
          `Successfully uploaded and updated ${updatedFile.count} review files: ${s3Key}`,
        );
        this.logger.log(`Updated URL: ${s3Url}`);
      } else {
        // Если загрузка не удалась, оставляем base64
        this.logger.warn(
          `Failed to upload review file to S3: ${s3Key}, keeping base64`,
        );
      }
    } catch (error) {
      this.logger.error(`Error processing review file upload: ${s3Key}`, error);
      throw error;
    }
  }
}
