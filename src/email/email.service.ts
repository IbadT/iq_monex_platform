import { Injectable, Logger, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Transporter, SendMailOptions } from 'nodemailer';
import {
  NOREPLY_TRANSPORT,
  SUPPORT_TRANSPORT,
  EmailSender,
} from './email.constants';

// Export EmailSender for use in other modules
export { EmailSender } from './email.constants';

// === Интерфейсы ===

export interface EmailAttachment {
  filename: string;
  content: Buffer | string;
  contentType?: string;
}

export interface BaseEmailParams {
  to: string | string[];
  subject: string;
  text?: string;
  html?: string;
  attachments?: EmailAttachment[];
  replyTo?: string;
  cc?: string | string[];
  bcc?: string | string[];
}

export interface SendEmailParams extends BaseEmailParams {
  sender?: EmailSender; // По умолчанию NOREPLY
}

export interface TemplateEmailParams extends BaseEmailParams {
  template:
    | 'welcome'
    | 'password-reset'
    | 'verify-email'
    | 'new-message'
    | 'listing-approved'
    | 'payment-success';
  data: Record<string, string | number>;
}

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  constructor(
    @Inject(NOREPLY_TRANSPORT) private readonly noreplyTransporter: Transporter,
    @Inject(SUPPORT_TRANSPORT) private readonly supportTransporter: Transporter,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Универсальный метод отправки с выбором отправителя
   */
  async send(params: SendEmailParams): Promise<{ messageId: string }> {
    const { sender = EmailSender.NOREPLY, ...mailOptions } = params;

    const transporter =
      sender === EmailSender.SUPPORT
        ? this.supportTransporter
        : this.noreplyTransporter;

    const fromName =
      sender === EmailSender.SUPPORT
        ? this.configService.get('EMAIL_SUPPORT_NAME')
        : this.configService.get('EMAIL_NOREPLY_NAME');

    const fromAddress =
      sender === EmailSender.SUPPORT
        ? this.configService.get('SMTP_SUPPORT_USER')
        : this.configService.get('SMTP_NOREPLY_USER');

    // Debug logging
    this.logger.log(`[DEBUG] Sender: ${sender}, fromAddress: ${fromAddress}`);

    const options: SendMailOptions = {
      from: `"${fromName}" <${fromAddress}>`,
      to: Array.isArray(mailOptions.to)
        ? mailOptions.to.join(', ')
        : mailOptions.to,
      subject: mailOptions.subject,
      text: mailOptions.text,
      html: mailOptions.html,
      attachments: mailOptions.attachments,
      replyTo:
        sender === EmailSender.NOREPLY
          ? this.configService.get('SMTP_NOREPLY_USER') // noreply → используем тот же email
          : mailOptions.replyTo,
      cc: mailOptions.cc,
      bcc: mailOptions.bcc,
    };

    try {
      const info = await transporter.sendMail(options);
      this.logger.log(
        `[${sender.toUpperCase()}] Email sent to ${mailOptions.to}: ${info.messageId}`,
      );
      return { messageId: info.messageId };
    } catch (error) {
      this.logger.error(
        `[${sender.toUpperCase()}] Failed to send to ${mailOptions.to}:`,
        error,
      );
      throw new EmailSendException(`Failed to send email: ${error.message}`);
    }
  }

  // === АВТОМАТИЧЕСКАЯ РАССЫЛКА (noreply) ===

  /** Приветствие нового пользователя */
  async sendWelcome(to: string, userName: string): Promise<void> {
    await this.send({
      to,
      sender: EmailSender.NOREPLY,
      subject: 'Добро пожаловать! 🎉',
      html: this.templates.welcome({
        userName,
        appUrl: this.configService.get('APP_URL') || '',
      }),
      text: `Привет, ${userName}! Добро пожаловать в наше приложение.`,
    });
  }

  /** Код подтверждения email */
  async sendVerificationCode(to: string, code: string): Promise<void> {
    await this.send({
      to,
      sender: EmailSender.NOREPLY,
      subject: 'Подтверждение email',
      html: this.templates.verificationCode({ code, expiresIn: '15 минут' }),
      text: `Ваш код подтверждения: ${code}. Действителен 15 минут.`,
    });
  }

  /** Сброс пароля */
  async sendPasswordReset(to: string, token: string): Promise<void> {
    const resetUrl = `${this.configService.get('APP_URL')}/auth/reset-password?token=${token}`;

    await this.send({
      to,
      sender: EmailSender.NOREPLY,
      subject: 'Сброс пароля',
      html: this.templates.passwordReset({ resetUrl, expiresIn: '1 час' }),
      text: `Для сброса пароля перейдите: ${resetUrl}`,
    });
  }

  /** 2FA код */
  async send2FACode(to: string, code: string): Promise<void> {
    await this.send({
      to,
      sender: EmailSender.NOREPLY,
      subject: 'Код двухфакторной аутентификации',
      html: this.templates.twoFactorCode({ code }),
      text: `Ваш код 2FA: ${code}`,
    });
  }

  /** Уведомление о входе с нового устройства */
  async sendSecurityAlert(
    to: string,
    deviceInfo: string,
    location: string,
  ): Promise<void> {
    await this.send({
      to,
      sender: EmailSender.NOREPLY,
      subject: '⚠️ Новый вход в аккаунт',
      html: this.templates.securityAlert({
        deviceInfo,
        location,
        time: new Date().toLocaleString('ru-RU'),
      }),
      text: `Обнаружен вход с устройства: ${deviceInfo}, локация: ${location}`,
    });
  }

  // === ПОДДЕРЖКА / ОБЩЕНИЯ (support) ===

  /** Ответ пользователю из тикета поддержки */
  async sendSupportReply(
    to: string,
    ticketId: string,
    message: string,
    agentName: string,
  ): Promise<void> {
    await this.send({
      to,
      sender: EmailSender.SUPPORT,
      subject: `Ответ по обращению #${ticketId}`,
      html: this.templates.supportReply({ ticketId, message, agentName }),
      text: `Ответ поддержки по обращению ${ticketId}: ${message}`,
      replyTo: this.configService.get('SMTP_SUPPORT_USER') || '', // Ответ придёт в support@
    });
  }

  /** Уведомление о создании тикета */
  async sendTicketCreated(
    to: string,
    ticketId: string,
    subject: string,
  ): Promise<void> {
    await this.send({
      to,
      sender: EmailSender.SUPPORT,
      subject: `Обращение #${ticketId} создано`,
      html: this.templates.ticketCreated({
        ticketId,
        subject,
        appUrl: this.configService.get('APP_URL') || '',
      }),
    });
  }

  /** Массовая рассылка от поддержки (важные объявления) */
  async sendBroadcast(
    to: string[],
    subject: string,
    content: string,
  ): Promise<void> {
    // Отправляем пачками по 50 штук
    const batchSize = 50;
    for (let i = 0; i < to.length; i += batchSize) {
      const batch = to.slice(i, i + batchSize);
      await this.send({
        to: batch,
        sender: EmailSender.SUPPORT,
        subject,
        html: content,
        bcc: batch, // Скрытые копии, чтобы не светить emails
      });
    }
  }

  // === ШАБЛОНЫ (inline для простоты, в production используйте Handlebars/React Email) ===

  private templates = {
    welcome: (data: Record<string, string>) => `
      <div style="font-family: system-ui, -apple-system, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #111;">Привет, ${data.userName}! 👋</h1>
        <p>Добро пожаловать в наше приложение.</p>
        <a href="${data.appUrl}" style="display: inline-block; background: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 16px 0;">
          Перейти в приложение
        </a>
        <p style="color: #666; font-size: 12px; margin-top: 32px;">
          Это письмо отправлено автоматически. Пожалуйста, не отвечайте на него.
          Для связи: <a href="mailto:support@yourdomain.ru">support@yourdomain.ru</a>
        </p>
      </div>
    `,

    verificationCode: (data: Record<string, string>) => `
      <div style="font-family: system-ui, sans-serif; max-width: 600px;">
        <h2>Ваш код подтверждения</h2>
        <div style="background: #f4f4f5; padding: 24px; border-radius: 8px; text-align: center; font-size: 32px; letter-spacing: 8px; font-weight: 600;">
          ${data.code}
        </div>
        <p>Код действителен ${data.expiresIn}.</p>
        <p style="color: #666; font-size: 12px;">Если вы не запрашивали код, проигнорируйте это письмо.</p>
      </div>
    `,

    passwordReset: (data: Record<string, string>) => `
      <div style="font-family: system-ui, sans-serif; max-width: 600px;">
        <h2>Сброс пароля</h2>
        <p>Нажмите кнопку ниже для создания нового пароля:</p>
        <a href="${data.resetUrl}" style="display: inline-block; background: #dc2626; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
          Сбросить пароль
        </a>
        <p style="margin-top: 16px;">Или скопируйте ссылку: <code>${data.resetUrl}</code></p>
        <p style="color: #666; font-size: 12px;">Ссылка действительна ${data.expiresIn}.</p>
      </div>
    `,

    twoFactorCode: (data: Record<string, string>) => `
      <div style="font-family: system-ui, sans-serif; max-width: 600px;">
        <h2>Код подтверждения</h2>
        <p>Введите этот код для входа:</p>
        <div style="font-size: 48px; font-weight: 700; letter-spacing: 4px;">${data.code}</div>
      </div>
    `,

    securityAlert: (data: Record<string, string>) => `
      <div style="font-family: system-ui, sans-serif; max-width: 600px;">
        <h2 style="color: #dc2626;">⚠️ Обнаружен новый вход</h2>
        <p><strong>Устройство:</strong> ${data.deviceInfo}</p>
        <p><strong>Локация:</strong> ${data.location}</p>
        <p><strong>Время:</strong> ${data.time}</p>
        <p>Если это были не вы, немедленно смените пароль.</p>
      </div>
    `,

    supportReply: (data: Record<string, string>) => `
      <div style="font-family: system-ui, sans-serif; max-width: 600px;">
        <h2>Ответ по обращению #${data.ticketId}</h2>
        <div style="background: #f4f4f5; padding: 16px; border-radius: 8px; margin: 16px 0;">
          ${data.message}
        </div>
        <p>С уважением,<br>${data.agentName}</p>
        <hr style="border: none; border-top: 1px solid #e4e4e7; margin: 24px 0;">
        <p style="font-size: 12px; color: #666;">
          Ответьте на это письмо, чтобы продолжить диалог. 
          Или напишите на <a href="mailto:support@yourdomain.ru">support@yourdomain.ru</a>
        </p>
      </div>
    `,

    ticketCreated: (data: Record<string, string>) => `
      <div style="font-family: system-ui, sans-serif; max-width: 600px;">
        <h2>Обращение создано</h2>
        <p>Номер: <strong>#${data.ticketId}</strong></p>
        <p>Тема: ${data.subject}</p>
        <p>Мы ответим вам в ближайшее время.</p>
        <a href="${data.appUrl}/support/tickets/${data.ticketId}" style="display: inline-block; background: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
          Отследить статус
        </a>
      </div>
    `,
  };
}

// === Кастомное исключение ===
export class EmailSendException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'EmailSendException';
  }
}
