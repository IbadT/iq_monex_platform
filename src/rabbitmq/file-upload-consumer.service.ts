import {
  Injectable,
  Logger,
  OnModuleInit,
  OnModuleDestroy,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as amqp from 'amqplib';
import { S3Service } from '@/s3/s3.service';
import { FileUploadMessage } from './interfaces/file-upload-message.interface';
import { Channel, ChannelModel, ConsumeMessage } from 'amqplib';
import { prisma } from '@/lib/prisma';

@Injectable()
export class FileUploadConsumerService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(FileUploadConsumerService.name);
  private connection: ChannelModel | null = null;
  private channel: Channel | null = null;

  constructor(
    private readonly s3Service: S3Service,
    private readonly configService: ConfigService,
  ) {}

  async onModuleInit() {
    try {
      const rabbitmqUrl = this.configService.get('RABBITMQ_URL') || 'amqp://admin:admin123@rabbitmq:5672';
      
      this.connection = await amqp.connect(rabbitmqUrl);
      this.channel = await this.connection.createChannel();

      if (!this.channel) {
        throw new Error('Failed to create RabbitMQ channel');
      }

      // Устанавливаем prefetch
      await this.channel.prefetch(1);

      // Объявляем очередь
      await this.channel.assertQueue('file_upload_queue', { durable: true });

      this.logger.log('File Upload Consumer подключен к RabbitMQ');

      // Начинаем потреблять сообщения
      this.logger.log('Начато потребление сообщений из очереди file_upload_queue');

      await this.channel.consume('file_upload_queue', this.handleMessage.bind(this));
    } catch (error) {
      this.logger.error('Ошибка подключения к RabbitMQ:', error);
    }
  }

  private async handleMessage(msg: ConsumeMessage | null): Promise<void> {
    if (!msg || !this.channel) {
      return;
    }

    try {
      const content = msg.content.toString();
      const message: FileUploadMessage = JSON.parse(content);

      this.logger.log(`Получено сообщение для загрузки файла: ${message.s3Key}`);

      await this.handleFileUpload(message);

      // Подтверждаем обработку сообщения
      this.channel.ack(msg);

      this.logger.log(`Файл успешно обработан: ${message.s3Key}`);
    } catch (error) {
      this.logger.error('Ошибка обработки сообщения:', error);
      
      // Обновляем статус на failed в случае ошибки
      try {
        const message: FileUploadMessage = JSON.parse(msg.content.toString());
        await prisma.file.updateMany({
          where: {
            listingId: message.listingId,
            sortOrder: message.fileIndex,
            kind: message.fileType === 'photo' ? 'PHOTO' : 'DOCUMENT',
          },
          data: {
            uploadStatus: 'failed',
          },
        });
      } catch (dbError) {
        this.logger.error('Failed to update file status to failed', dbError);
      }
      
      // Отклоняем сообщение
      this.channel.nack(msg, false, false);
    }
  }

  private async handleFileUpload(message: FileUploadMessage): Promise<void> {
    const { listingId, fileType, fileIndex, fileData, contentType, s3Key } = message;
    
    this.logger.log(`Processing file upload: ${s3Key} for listing: ${listingId}`);
    this.logger.log(`File data length: ${fileData.length} characters`);
    
    try {
      // Загружаем файл в S3
      const buffer = this.s3Service.base64ToBuffer(fileData);
      this.logger.log(`Buffer created, size: ${buffer.length} bytes`);
      
      const s3Url = await this.s3Service.upload(buffer, s3Key, contentType);
      this.logger.log(`S3 upload result: ${s3Url}`);
      
      if (s3Url) {
        // Обновляем запись в базе данных с URL из S3
        const updatedFile = await prisma.file.updateMany({
          where: {
            listingId,
            sortOrder: fileIndex,
            kind: fileType === 'photo' ? 'PHOTO' : 'DOCUMENT',
          },
          data: {
            url: s3Url,
            s3Key,
            s3Bucket: this.configService.get<string>('S3_BUCKET_NAME') || '',
            uploadStatus: 'completed', // Обновляем статус на завершенный
          },
        });
        
        this.logger.log(`Successfully uploaded and updated ${updatedFile.count} files: ${s3Key}`);
        this.logger.log(`Updated URL: ${s3Url}`);
      } else {
        // Если загрузка не удалась, обновляем статус на failed
        await prisma.file.updateMany({
          where: {
            listingId,
            sortOrder: fileIndex,
            kind: fileType === 'photo' ? 'PHOTO' : 'DOCUMENT',
          },
          data: {
            uploadStatus: 'failed',
          },
        });
        
        this.logger.warn(`Failed to upload file to S3: ${s3Key}, keeping base64`);
      }
    } catch (error) {
      this.logger.error(`Error processing file upload: ${s3Key}`, error);
      
      // Обновляем статус на failed в случае ошибки
      try {
        await prisma.file.updateMany({
          where: {
            listingId,
            sortOrder: fileIndex,
            kind: fileType === 'photo' ? 'PHOTO' : 'DOCUMENT',
          },
          data: {
            uploadStatus: 'failed',
          },
        });
      } catch (dbError) {
        this.logger.error(`Failed to update file status to failed: ${s3Key}`, dbError);
      }
      
      throw error;
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
      this.logger.log('File Upload Consumer отключен от RabbitMQ');
    } catch (error) {
      this.logger.error('Ошибка отключения от RabbitMQ:', error);
    }
  }
}
