import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsBoolean, IsOptional } from 'class-validator';
import { TariffCode } from '../enums/tariff-code.enum';

export class UpdateTariffDto {
  @ApiProperty({
    example: TariffCode.BASE,
    description: 'Код тарифа',
    enum: TariffCode,
    required: false,
  })
  @IsOptional()
  @IsString()
  code?: TariffCode;

  @ApiProperty({
    example: 'Базовая подписка',
    description: 'Название тарифа',
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    example: 'Базовая подписка с 100 слотами',
    description: 'Описание тарифа',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    example: 100,
    description: 'Количество слотов при покупке',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  baseSlots?: number;

  @ApiProperty({
    example: 30,
    description: 'Базовый срок действия (дней)',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  baseDays?: number;

  @ApiProperty({
    example: 365,
    description: 'Максимальный срок (для продлений)',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  maxTotalDays?: number;

  @ApiProperty({
    example: true,
    description: 'Можно ли продлевать',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isExtendable?: boolean;

  @ApiProperty({
    example: 500.0,
    description: 'Цена (в базовой валюте)',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  price?: number;

  @ApiProperty({
    example: 'RUB',
    description: 'ISO код валюты (BYN, USD, EUR)',
    required: false,
  })
  @IsOptional()
  @IsString()
  currencyCode?: string;

  @ApiProperty({
    example: true,
    description: 'Активен ли тариф',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
