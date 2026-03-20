import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
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
    description: 'ID пакетов для продления (только для EXTEND_PACKAGES)',
    example: ['1', '2', '3'],
    required: false,
  })
  @IsArray()
  @IsOptional()
  packageIds?: string[];

  @ApiProperty({
    description: 'Сумма оплаты',
    example: 100.5,
    required: true,
  })
  @IsNumber()
  amount: number;

  @ApiProperty({
    description: 'Валюта платежа',
    example: 'RUB',
    required: true,
  })
  @IsString()
  currency: string;

  @ApiProperty({
    description:
      'Количество дней (зависит от типа платежа: 30 для подписки/покупки, 100 для продления)',
    example: 30,
    required: true,
  })
  @IsNumber()
  daysCount: number;

  constructor(
    paymentType: PaymentType,
    amount: number,
    currency: string,
    daysCount: number,
    packageIds?: string[],
  ) {
    this.paymentType = paymentType;
    this.amount = amount;
    this.currency = currency;
    this.daysCount = daysCount;
    if (packageIds) {
      this.packageIds = packageIds;
    }
  }
}
