import { ApiProperty } from '@nestjs/swagger';

export class TariffResponseDto {
  @ApiProperty({
    description: 'ID тарифа',
    example: '550e8400-e29b-41d4-a716-446655440000',
    type: 'string',
    format: 'uuid',
  })
  id: string;

  @ApiProperty({
    description: 'Код тарифа',
    example: 'BASE',
    type: 'string',
    enum: ['BASE', 'MAIN', 'PREMIUM', 'ADDITIONAL_PACKAGE'],
  })
  code: string;

  @ApiProperty({
    description: 'Название тарифа',
    example: 'Базовая подписка',
    type: 'string',
  })
  name: string;

  @ApiProperty({
    description: 'Описание тарифа',
    example: 'Базовая подписка с 100 слотами',
    type: 'string',
  })
  description: string;

  @ApiProperty({
    description: 'Количество слотов при покупке',
    example: 100,
    type: 'integer',
  })
  baseSlots: number;

  @ApiProperty({
    description: 'Базовый срок действия (дней)',
    example: 30,
    type: 'integer',
  })
  baseDays: number;

  @ApiProperty({
    description: 'Максимальный срок (для продлений)',
    example: 365,
    type: 'integer',
  })
  maxTotalDays: number;

  @ApiProperty({
    description: 'Можно ли продлевать',
    example: true,
    type: 'boolean',
  })
  isExtendable: boolean;

  @ApiProperty({
    description: 'Цена (в базовой валюте)',
    example: 500.0,
    type: 'number',
  })
  price: number;

  @ApiProperty({
    description: 'ISO код валюты',
    example: 'RUB',
    type: 'string',
  })
  currencyCode: string;

  @ApiProperty({
    description: 'Активен ли тариф',
    example: true,
    type: 'boolean',
  })
  isActive: boolean;

  constructor(
    id: string,
    code: string,
    name: string,
    description: string,
    baseSlots: number,
    baseDays: number,
    maxTotalDays: number,
    isExtendable: boolean,
    price: number,
    currencyCode: string,
    isActive: boolean,
  ) {
    this.id = id;
    this.code = code;
    this.name = name;
    this.description = description;
    this.baseSlots = baseSlots;
    this.baseDays = baseDays;
    this.maxTotalDays = maxTotalDays;
    this.isExtendable = isExtendable;
    this.price = price;
    this.currencyCode = currencyCode;
    this.isActive = isActive;
  }
}
