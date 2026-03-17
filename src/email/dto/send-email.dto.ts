import { IsString, IsOptional, IsEmail, IsArray, IsEnum } from 'class-validator';
import { EmailSender } from '../email.service';

// Универсальный DTO для отправки email с subject
export class SendEmailDto {
  @IsString()
  @IsEmail()
  to!: string;

  @IsString()
  subject!: string;

  @IsOptional()
  @IsString()
  text?: string;

  @IsOptional()
  @IsString()
  html?: string;

  @IsOptional()
  @IsEnum(EmailSender)
  sender?: EmailSender;

  @IsOptional()
  @IsString()
  replyTo?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  cc?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  bcc?: string[];
}

// Упрощенные DTO только с email
export class EmailOnlyDto {
  @IsString()
  @IsEmail()
  to!: string;
}

export class SendVerificationCodeDto {
  @IsString()
  @IsEmail()
  to!: string;

  @IsString()
  code!: string;
}

export class SendWelcomeDto {
  @IsString()
  @IsEmail()
  to!: string;

  @IsString()
  userName!: string;
}

export class SendPasswordResetDto {
  @IsString()
  @IsEmail()
  to!: string;

  @IsString()
  token!: string;
}

export class SendSupportReplyDto {
  @IsString()
  @IsEmail()
  to!: string;

  @IsString()
  ticketId!: string;

  @IsString()
  message!: string;

  @IsString()
  agentName!: string;
}

export class Send2FACodeDto {
  @IsString()
  @IsEmail()
  to!: string;

  @IsString()
  code!: string;
}
