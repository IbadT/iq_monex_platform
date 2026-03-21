import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  IsString,
  IsUUID,
  IsOptional,
} from 'class-validator';

export enum PaymentType {
  EXTEND_PACKAGES = 'EXTEND_PACKAGES', // Продление пакетов на 100 дней
  EXTEND_BASE_SUBSCRIPTION = 'EXTEND_BASE_SUBSCRIPTION', // Продление базовой подписки на 30 дней
  BUY_ADDITIONAL_PACKAGE = 'BUY_ADDITIONAL_PACKAGE', // Покупка дополнительного пакета 100 слотов на 30 дней
  BUY_BASE_SUBSCRIPTION = 'BUY_BASE_SUBSCRIPTION', // Покупка базовой подписки на 30 дней
  DONATION = 'DONATION', // Пожертвование
}

export class CreatePaymentDto {
  @ApiProperty({
    description: 'Тип платежа',
    enum: PaymentType,
    example: PaymentType.EXTEND_PACKAGES,
    required: true,
  })
  @IsEnum(PaymentType)
  paymentType: PaymentType;

  @ApiProperty({
    description: 'ID тарифа',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: true,
  })
  @IsUUID()
  tariffId: string;

  @ApiProperty({
    description: 'ID пакетов для продления (только для EXTEND_PACKAGES)',
    example: ['uuid-package-1', 'uuid-package-2', 'uuid-package-3'],
    required: false,
  })
  @IsArray()
  @IsOptional()
  packageIds?: string[];

  @ApiProperty({
    description: 'Валюта платежа (если не указана, берется из тарифа)',
    example: 'RUB',
    required: false,
    enum: ['RUB', 'USD', 'EUR', 'CNY', 'KZT', 'BYN'],
  })
  @IsString()
  @IsOptional()
  currency?: string;

  constructor(
    paymentType: PaymentType,
    tariffId: string,
    packageIds?: string[],
    currency?: string,
  ) {
    this.paymentType = paymentType;
    this.tariffId = tariffId;
    if (packageIds) {
      this.packageIds = packageIds;
    }
    if (currency) {
      this.currency = currency;
    }
  }
}
