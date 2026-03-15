import {
  Injectable,
  Logger,
  OnModuleInit,
  OnModuleDestroy,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as amqp from 'amqplib';
import { EmailService, EmailSender } from '@/email/email.service';
import { EmailMessage } from './interfaces/email-message.interface';
import { Channel, ChannelModel, ConsumeMessage } from 'amqplib';

const RABBITMQ_URL = 'amqp://admin:admin123@localhost:5672';

@Injectable()
export class EmailConsumerService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(EmailConsumerService.name);
  private connection: ChannelModel | null = null;
  private channel: Channel | null = null;

  constructor(
    private readonly emailService: EmailService,
    private readonly configService: ConfigService,
  ) {}

  async onModuleInit() {
    try {
      this.connection = await amqp.connect(RABBITMQ_URL);
      this.channel = await this.connection.createChannel();

      if (!this.channel) {
        throw new Error('Failed to create RabbitMQ channel');
      }

      // Устанавливаем prefetch
      await this.channel.prefetch(1);

      // Объявляем очередь
      await this.channel.assertQueue('auth_queue', { durable: true });

      this.logger.log('Email Consumer подключен к RabbitMQ');

      // Начинаем потреблять сообщения
      this.logger.log('Начато потребление сообщений из очереди auth_queue');
      
      await this.channel.consume('auth_queue', this.handleMessage.bind(this));
      
    } catch (error) {
      this.logger.error('Ошибка подключения к RabbitMQ:', error);
    }
  }

  private async handleMessage(msg: ConsumeMessage | null): Promise<void> {
    if (!msg || !this.channel) {
      return;
    }

    try {
      const messageData = this.parseMessage(msg);
      
      this.logger.log(
        `Получено сообщение для отправки email: ${JSON.stringify(messageData)}`,
      );

      await this.handleEmailMessage(messageData);

      // Подтверждаем обработку сообщения
      this.channel.ack(msg);

      this.logger.log(`Email успешно отправлен на ${messageData.to} с темой: ${messageData.subject}`);
    } catch (error) {
      this.logger.error('Ошибка обработки сообщения:', error);
      // Отклоняем сообщение
      this.channel.nack(msg, false, false);
    }
  }

  private parseMessage(msg: ConsumeMessage): EmailMessage {
    const content = msg.content.toString();
    const parsedMessage = JSON.parse(content);
    
    console.log('Raw message content:', content);
    console.log('Parsed message:', parsedMessage);
    
    return parsedMessage.data || parsedMessage;
  }

  async onModuleDestroy() {
    try {
      if (this.channel) {
        await this.channel.close();
      }
      if (this.connection) {
        await this.connection.close();
      }
      this.logger.log('Email Consumer отключен от RabbitMQ');
    } catch (error) {
      this.logger.error('Ошибка отключения от RabbitMQ:', error);
    }
  }

  private async handleEmailMessage(message: EmailMessage) {
    try {
      const verificationCode = message.data?.verificationCode || 'DEFAULT';
      const htmlTemplate = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px; border-radius: 10px; text-align: center;">
          <h1 style="margin: 0; font-size: 32px; color: #333;">Код подтверждения 🔐</h1>
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; letter-spacing: 8px; font-size: 36px; font-weight: bold; color: #333;">
            ${verificationCode}
          </div>
          <p style="font-size: 18px; margin: 20px 0; color: #333;">Введите этот 6-значный код в форме подтверждения.</p>
          <p style="font-size: 14px; margin: 20px 0; color: #666;">Код действителен в течение 5 минут.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          <p style="font-size: 12px; color: #999; margin: 0;">Если нужна помощь, напишите нам на почту: <a href="mailto:${this.configService.get('SMTP_SUPPORT_USER')}" style="color: #666;">${this.configService.get('SMTP_SUPPORT_USER')}</a></p>
        </div>
      `;

      await this.emailService.send({
        to: message.to,
        subject: message.subject,
        html: htmlTemplate,
        text: `Ваш код подтверждения: ${verificationCode}`,
        sender: EmailSender.NOREPLY,
      });
    } catch (error) {
      this.logger.error(`Ошибка отправки email на ${message.to}:`, error);
      throw error;
    }
  }
}
