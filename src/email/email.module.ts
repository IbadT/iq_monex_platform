import { Module, Logger } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EmailService } from './email.service';
import { EmailController } from './email.controller';
import { NOREPLY_TRANSPORT, SUPPORT_TRANSPORT } from './email.constants';
import * as nodemailer from 'nodemailer';

const logger = new Logger('EmailModule');

@Module({
  imports: [ConfigModule],
  controllers: [EmailController],
  providers: [
    EmailService,
    {
      provide: NOREPLY_TRANSPORT,
      useFactory: (config: any) => {
        const host = config.get('SMTP_NOREPLY_HOST');
        const port = parseInt(config.get('SMTP_NOREPLY_PORT')) || 2525;
        const secure = port === 465;

        logger.log(
          `Configuring NOREPLY transport: ${host}:${port} (secure: ${secure})`,
        );

        return nodemailer.createTransport({
          host,
          port,
          secure,
          auth: {
            user: config.get('SMTP_NOREPLY_USER'),
            pass: config.get('SMTP_NOREPLY_PASS'),
          },
          // tls: {
          //   rejectUnauthorized: false,
          //   minVersion: 'TLSv1.2',
          // },
          // connectionTimeout: 60000, // 60 секунд
          // socketTimeout: 30000, // 30 секунд

          debug: config.get('NODE_ENV') === 'development',
          logger: config.get('NODE_ENV') === 'development',
        });
      },
      inject: [ConfigService],
    },
    {
      provide: SUPPORT_TRANSPORT,
      useFactory: (config: any) => {
        const host = config.get('SMTP_SUPPORT_HOST');
        const port = parseInt(config.get('SMTP_SUPPORT_PORT')) || 2525;
        const secure = port === 465;

        logger.log(
          `Configuring SUPPORT transport: ${host}:${port} (secure: ${secure})`,
        );

        return nodemailer.createTransport({
          host,
          port,
          secure,
          auth: {
            user: config.get('SMTP_SUPPORT_USER'),
            pass: config.get('SMTP_SUPPORT_PASS'),
          },
          // tls: {
          //   rejectUnauthorized: false,
          //   minVersion: 'TLSv1.2',
          // },
          // connectionTimeout: 60000, // 60 секунд
          // socketTimeout: 30000, // 30 секунд
          debug: config.get('NODE_ENV') === 'development',
          logger: config.get('NODE_ENV') === 'development',
        });
      },
      inject: [ConfigService],
    },
  ],
  exports: [EmailService, NOREPLY_TRANSPORT, SUPPORT_TRANSPORT],
})
export class EmailModule {}
