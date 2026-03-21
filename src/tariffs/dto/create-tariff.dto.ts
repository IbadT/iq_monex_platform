import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsBoolean } from 'class-validator';
import { TariffCode } from '../enums/tariff-code.enum';

export class CreateTariffDto {
  @ApiProperty({
    example: TariffCode.BASE,
    description: 'Код тарифа',
    enum: TariffCode,
  })
  @IsString()
  code: TariffCode;

  @ApiProperty({
    example: 'Базовая подписка',
    description: 'Название тарифа',
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: 'Базовая подписка с 100 слотами',
    description: 'Описание тарифа',
  })
  @IsString()
  description: string;

  @ApiProperty({
    example: 100,
    description: 'Количество слотов при покупке',
  })
  @IsNumber()
  baseSlots: number;

  @ApiProperty({
    example: 30,
    description: 'Базовый срок действия (дней)',
  })
  @IsNumber()
  baseDays: number;

  @ApiProperty({
    example: 365,
    description: 'Максимальный срок (для продлений)',
  })
  @IsNumber()
  maxTotalDays: number;

  @ApiProperty({
    example: true,
    description: 'Можно ли продлевать',
  })
  @IsBoolean()
  isExtendable: boolean;

  @ApiProperty({
    example: 500.0,
    description: 'Цена (в базовой валюте)',
  })
  @IsNumber()
  price: number;

  @ApiProperty({
    example: 'RUB',
    description: 'ISO код валюты (BYN, USD, EUR)',
  })
  @IsString()
  currencyCode: string;


  constructor(code: TariffCode, name: string, description: string, baseSlots: number, baseDays: number, maxTotalDays: number, isExtendable: boolean, price: number, currencyCode: string) {
    this.code = code;
    this.name = name;
    this.description = description;
    this.baseSlots = baseSlots;
    this.baseDays = baseDays;
    this.maxTotalDays = maxTotalDays;
    this.isExtendable = isExtendable;
    this.price = price;
    this.currencyCode = currencyCode;
  }
}
