import { Injectable, Logger } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
// const { MailtrapTransport } = require('mailtrap');
import { EmailMessage } from '@/rabbitmq/interfaces/email-message.interface';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter!: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    // this.initializeTransporter();
  }

  // private initializeTransporter() {
  //   const token = this.configService.get<string>('MAILTRAP_API_TOKEN');

  //   this.transporter = nodemailer.createTransport(
  //     MailtrapTransport({
  //       token: token,
  //     })
  //   );
  // }

  async sendEmail(message: EmailMessage): Promise<void> {
    try {
      const emailContent = this.generateEmailContent(message);

      const mailOptions = {
        from: {
          address:
            this.configService.get<string>('MAIL_FROM') ||
            'noreply@yourapp.com',
          name: 'Your App',
        },
        to: message.to,
        subject: message.subject,
        html: emailContent,
        category: 'Email Verification',
      };

      const result = await this.transporter.sendMail(mailOptions);
      this.logger.log(
        `Email отправлен успешно через Mailtrap: ${result.message_ids} на ${message.to}`,
      );
    } catch (error) {
      this.logger.error(`Ошибка отправки email на ${message.to}:`, error);
      throw error;
    }
  }

  private generateEmailContent(message: EmailMessage): string {
    if (message.data?.verificationCode) {
      return this.generateVerificationEmail(message.data.verificationCode);
    }

    return this.generateDefaultEmail(message);
  }

  private generateVerificationEmail(verificationCode: string): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Код подтверждения</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #4f46e5; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9fafb; }
          .code { font-size: 32px; font-weight: bold; color: #4f46e5; 
                  text-align: center; padding: 20px; background: white; 
                  border-radius: 8px; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Код подтверждения регистрации</h1>
          </div>
          <div class="content">
            <p>Спасибо за регистрацию! Используйте код ниже для подтверждения вашего email:</p>
            <div class="code">${verificationCode}</div>
            <p><strong>Важно:</strong> Код действителен 15 минут.</p>
          </div>
          <div class="footer">
            <p>Если вы не запрашивали этот код, просто проигнорируйте это письмо.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  private generateDefaultEmail(message: EmailMessage): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>${message.subject}</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #4f46e5; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9fafb; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>${message.subject}</h1>
          </div>
          <div class="content">
            <p>${message.data?.verificationCode || 'Спасибо за использование нашего сервиса!'}</p>
          </div>
          <div class="footer">
            <p>Это автоматическое сообщение, пожалуйста не отвечайте на него.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  // async verifyConnection(): Promise<boolean> {
  //   try {
  //     const testPayload = {
  //       from: {
  //         address: this.configService.get<string>('MAIL_FROM') || 'noreply@yourapp.com',
  //         name: 'Test',
  //       },
  //       to: 'test@example.com',
  //       subject: 'Connection Test',
  //       text: 'Test email to verify Mailtrap connection',
  //       category: 'Integration Test',
  //     };

  //     await this.transporter.sendMail(testPayload);
  //     this.logger.log('Mailtrap Transport подключение успешно');
  //     return true;
  //   } catch (error) {
  //     this.logger.error('Ошибка проверки подключения к Mailtrap:', error);
  //     return false;
  //   }
  // }
}
