import { Controller, Post, Body, Logger } from '@nestjs/common';
import { EmailService, EmailSender } from './email.service';
import { ApiTags } from '@nestjs/swagger';
import { SendEmailDto, EmailOnlyDto } from './dto/send-email.dto';
import { ApiSendEmailOperation } from './decorators/send-email-api-docs.decorator';
import { ApiSendVerificationCodeOperation } from './decorators/send-verification-code-api-docs.decorator';
import { ApiSendWelcomeOperation } from './decorators/send-welcome-api-docs.decorator';
import { ApiSendPasswordResetOperation } from './decorators/send-password-reset-api-docs.decorator';
import { ApiSendSupportReplyOperation } from './decorators/send-support-reply-api-docs.decorator';
import { ApiSend2FACodeOperation } from './decorators/send-2fa-code-api-docs.decorator';

@ApiTags('Email')
@Controller('email')
export class EmailController {
  private readonly logger = new Logger(EmailController.name);

  constructor(private readonly emailService: EmailService) {}

  @Post('send')
  @ApiSendEmailOperation()
  async sendEmail(@Body() body: SendEmailDto) {
    this.logger.log(
      `Отправка email на ${body.to} от ${body.sender || EmailSender.NOREPLY}`,
    );

    try {
      const result = await this.emailService.send({
        to: body.to,
        subject: body.subject,
        text: body.text || '',
        html: body.html || '',
        sender: body.sender || EmailSender.NOREPLY,
        replyTo: body.replyTo || '',
        cc: body.cc || [],
        bcc: body.bcc || [],
      });
      return {
        success: true,
        message: `Email успешно отправлен на ${body.to}`,
        messageId: result.messageId,
      };
    } catch (error) {
      this.logger.error('Ошибка отправки email:', error);
      return {
        success: false,
        message: 'Ошибка отправки email',
        error: error.message,
      };
    }
  }

  @Post('send-verification-code')
  @ApiSendVerificationCodeOperation()
  async sendVerificationCode(
    @Body() body: EmailOnlyDto,
    @Body('code') code: string,
  ) {
    this.logger.log(`Отправка кода подтверждения на ${body.to}`);

    try {
      await this.emailService.sendVerificationCode(body.to, code);
      return {
        success: true,
        message: `Код подтверждения отправлен на ${body.to}`,
      };
    } catch (error) {
      this.logger.error('Ошибка отправки кода подтверждения:', error);
      return {
        success: false,
        message: 'Ошибка отправки кода подтверждения',
        error: error.message,
      };
    }
  }

  @Post('send-welcome')
  @ApiSendWelcomeOperation()
  async sendWelcome(
    @Body() body: EmailOnlyDto,
    @Body('userName') userName: string,
  ) {
    this.logger.log(`Отправка приветственного письма на ${body.to}`);

    try {
      await this.emailService.sendWelcome(body.to, userName);
      return {
        success: true,
        message: `Приветственное письмо отправлено на ${body.to}`,
      };
    } catch (error) {
      this.logger.error('Ошибка отправки приветственного письма:', error);
      return {
        success: false,
        message: 'Ошибка отправки приветственного письма',
        error: error.message,
      };
    }
  }

  @Post('send-password-reset')
  @ApiSendPasswordResetOperation()
  async sendPasswordReset(
    @Body() body: EmailOnlyDto,
    @Body('token') token: string,
  ) {
    this.logger.log(`Отправка письма для сброса пароля на ${body.to}`);

    try {
      await this.emailService.sendPasswordReset(body.to, token);
      return {
        success: true,
        message: `Письмо для сброса пароля отправлено на ${body.to}`,
      };
    } catch (error) {
      this.logger.error('Ошибка отправки письма для сброса пароля:', error);
      return {
        success: false,
        message: 'Ошибка отправки письма для сброса пароля',
        error: error.message,
      };
    }
  }

  @Post('send-support-reply')
  @ApiSendSupportReplyOperation()
  async sendSupportReply(
    @Body() body: EmailOnlyDto,
    @Body('ticketId') ticketId: string,
    @Body('message') message: string,
    @Body('agentName') agentName: string,
  ) {
    this.logger.log(
      `Отправка ответа поддержки по тикету #${ticketId} на ${body.to}`,
    );

    try {
      await this.emailService.sendSupportReply(
        body.to,
        ticketId,
        message,
        agentName,
      );
      return {
        success: true,
        message: `Ответ поддержки отправлен на ${body.to}`,
      };
    } catch (error) {
      this.logger.error('Ошибка отправки ответа поддержки:', error);
      return {
        success: false,
        message: 'Ошибка отправки ответа поддержки',
        error: error.message,
      };
    }
  }

  @Post('send-2fa-code')
  @ApiSend2FACodeOperation()
  async send2FACode(@Body() body: EmailOnlyDto, @Body('code') code: string) {
    this.logger.log(`Отправка 2FA кода на ${body.to}`);

    try {
      await this.emailService.send2FACode(body.to, code);
      return {
        success: true,
        message: `2FA код отправлен на ${body.to}`,
      };
    } catch (error) {
      this.logger.error('Ошибка отправки 2FA кода:', error);
      return {
        success: false,
        message: 'Ошибка отправки 2FA кода',
        error: error.message,
      };
    }
  }
}
