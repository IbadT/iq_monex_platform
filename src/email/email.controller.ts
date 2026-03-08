import { Controller, Post, Body, Logger } from '@nestjs/common';
import { EmailService } from './email.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { EmailMessage } from '@/rabbitmq/interfaces/email-message.interface';

@ApiTags('Email')
@Controller('email')
export class EmailController {
  private readonly logger = new Logger(EmailController.name);

  constructor(private readonly emailService: EmailService) {}

  @Post('send')
  @ApiOperation({ summary: 'Отправить тестовое email' })
  async sendTestEmail(@Body() message: EmailMessage) {
    this.logger.log(`Отправка тестового email на ${message.to}`);
    
    try {
      await this.emailService.sendEmail(message);
      return { 
        success: true, 
        message: `Email успешно отправлен на ${message.to}` 
      };
    } catch (error) {
      this.logger.error('Ошибка отправки тестового email:', error);
      return { 
        success: false, 
        message: 'Ошибка отправки email',
        error: error.message 
      };
    }
  }

  @Post('verify')
  @ApiOperation({ summary: 'Проверить подключение к Mailtrap' })
  async verifyConnection() {
    try {
      const isConnected = await this.emailService.verifyConnection();
      return { 
        success: isConnected, 
        message: isConnected ? 'Подключение успешно' : 'Ошибка подключения' 
      };
    } catch (error) {
      this.logger.error('Ошибка проверки подключения:', error);
      return { 
        success: false, 
        message: 'Ошибка проверки подключения',
        error: error.message 
      };
    }
  }
}
