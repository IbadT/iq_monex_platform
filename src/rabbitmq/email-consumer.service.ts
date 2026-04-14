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

const RABBITMQ_URL = 'amqp://admin:admin123@rabbitmq:5672';

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
      const content = msg.content.toString();
      const parsedMessage = JSON.parse(content);

      console.log('Raw message content:', content);
      console.log('Parsed message:', parsedMessage);

      // Проверяем тип сообщения - обрабатываем только email сообщения
      if (parsedMessage.pattern !== 'send_email') {
        this.logger.log(
          `Пропуск сообщения с pattern: ${parsedMessage.pattern}`,
        );
        this.channel.ack(msg); // Подтверждаем, но не обрабатываем
        return;
      }

      const messageData = parsedMessage.data || parsedMessage;

      this.logger.log(
        `Получено сообщение для отправки email: ${JSON.stringify(messageData)}`,
      );

      await this.handleEmailMessage(messageData);

      // Подтверждаем обработку сообщения
      this.channel.ack(msg);

      this.logger.log(
        `Email успешно отправлен на ${messageData.to} с темой: ${messageData.subject}`,
      );
    } catch (error) {
      this.logger.error('Ошибка обработки сообщения:', error);
      // Отклоняем сообщение
      this.channel.nack(msg, false, false);
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
      this.logger.log('Email Consumer отключен от RabbitMQ');
    } catch (error) {
      this.logger.error('Ошибка отключения от RabbitMQ:', error);
    }
  }

  // private async handleEmailMessage(message: EmailMessage) {
  //   try {
  //     const verificationCode = message.data?.verificationCode || 'DEFAULT';
  //     const htmlTemplate = `
  //       <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px; border-radius: 10px; text-align: center;">
  //         <h1 style="margin: 0; font-size: 32px; color: #333;">Код подтверждения 🔐</h1>
  //         <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; letter-spacing: 8px; font-size: 36px; font-weight: bold; color: #333;">
  //           ${verificationCode}
  //         </div>
  //         <p style="font-size: 18px; margin: 20px 0; color: #333;">Введите этот 6-значный код в форме подтверждения.</p>
  //         <p style="font-size: 14px; margin: 20px 0; color: #666;">Код действителен в течение 5 минут.</p>
  //         <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
  //         <p style="font-size: 12px; color: #999; margin: 0;">Если нужна помощь, напишите нам на почту: <a href="mailto:${this.configService.get('SMTP_SUPPORT_USER')}" style="color: #666;">${this.configService.get('SMTP_SUPPORT_USER')}</a></p>
  //       </div>
  //     `;

  //     await this.emailService.send({
  //       to: message.to,
  //       subject: message.subject,
  //       html: htmlTemplate,
  //       text: `Ваш код подтверждения: ${verificationCode}`,
  //       sender: EmailSender.NOREPLY,
  //     });
  //   } catch (error) {
  //     this.logger.error(`Ошибка отправки email на ${message.to}:`, error);
  //     throw error;
  //   }
  // }

  private async handleEmailMessage(message: EmailMessage) {
    try {
      const frontendUrl =
        this.configService.get('FRONTEND_URL') || 'http://localhost:5173';
      const verificationCode = message.data?.verificationCode || 'DEFAULT';

      // Определяем тип письма: сброс пароля или подтверждение регистрации
      const isPasswordReset =
        message.template === 'reset-password' ||
        message.subject?.includes('Сброс пароля');

      // Формируем ссылку в зависимости от типа письма
      const confirmUrl = isPasswordReset
        ? `${frontendUrl}/auth/reset-password?code=${verificationCode}`
        : `${frontendUrl}/auth/confirm-email?code=${verificationCode}`;

      const buttonText = isPasswordReset
        ? 'Перейти на сайт'
        : 'Подтвердить email';
      const emailTitle = isPasswordReset
        ? 'Сброс пароля'
        : 'Подтверждение регистрации';
      const emailDescription = isPasswordReset
        ? 'Вы запросили сброс пароля. Нажмите кнопку ниже:'
        : 'Для завершения регистрации нажмите кнопку ниже:';

      // Текстовая версия
      const textVersion = `
Добрый день!

${emailDescription}

Ссылка: ${confirmUrl}

${isPasswordReset ? 'Ссылка действительна 5 минут.' : 'Ссылка действительна 5 минут.'}

Если вы не запрашивали это письмо, просто проигнорируйте его.
--
С уважением,
Команда поддержки
${this.configService.get('SMTP_SUPPORT_USER')}
    `.trim();

      // HTML версия с кнопкой
      const htmlTemplate = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
            <div style="padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0 0 20px; font-size: 28px; color: #222222;">${emailTitle}</h1>
              <p style="font-size: 16px; margin: 20px 0; color: #333333;">${emailDescription}</p>
              <a href="${confirmUrl}" style="display: inline-block; background: ${isPasswordReset ? '#dc2626' : '#16a34a'}; color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-size: 16px; font-weight: 600; margin: 20px 0;">
                ${buttonText}
              </a>
              <p style="font-size: 15px; margin: 20px 0; color: #666666;">⏱️ ${isPasswordReset ? 'Ссылка действительна 5 минут.' : 'Ссылка действительна 5 минут.'} Если вы не запрашивали это письмо, проигнорируйте его.</p>
              <hr style="border: none; border-top: 2px solid #eaeef2; margin: 30px 0;">
              <p style="font-size: 13px; color: #888888; margin: 0 0 10px;">Нужна помощь? Напишите нам:</p>
              <a href="mailto:${this.configService.get('SMTP_SUPPORT_USER')}" style="font-size: 14px; color: #1a73e8; text-decoration: underline; word-break: break-all;">${this.configService.get('SMTP_SUPPORT_USER')}</a>
            </div>
          </div>
        </body>
      </html>
    `;

      await this.emailService.send({
        to: message.to,
        subject: message.subject, // Тему лучше сделать без эмодзи и спецсимволов
        html: htmlTemplate,
        text: textVersion, // <- теперь текст нормальный
        sender: EmailSender.NOREPLY,
      });

      this.logger.log(`Email успешно отправлен на ${message.to}`);
    } catch (error) {
      this.logger.error(`Ошибка отправки email на ${message.to}:`, error);
      throw error;
    }
  }
}
