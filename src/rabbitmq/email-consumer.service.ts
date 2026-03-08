import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { EmailMessage } from './interfaces/email-message.interface';
import { EmailService } from '@/email/email.service';

@Controller()
export class EmailConsumerService {
  private readonly logger = new Logger(EmailConsumerService.name);

  constructor(private readonly emailService: EmailService) {}

  @EventPattern('send_email')
  async handleSendEmail(@Payload() message: EmailMessage) {
    this.logger.log(`Получено сообщение для отправки email: ${message.to}`);
    
    try {
      await this.emailService.sendEmail(message);
      this.logger.log(`Email успешно отправлен на ${message.to} с темой: ${message.subject}`);
    } catch (error) {
      this.logger.error(`Ошибка отправки email на ${message.to}:`, error);
      throw error;
    }
  }
}
