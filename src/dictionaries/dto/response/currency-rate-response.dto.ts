import { ApiProperty } from '@nestjs/swagger';

export class CurrencyRateResponseDto {
  @ApiProperty({
    description: 'ID записи курса',
    example: 1,
    type: 'integer',
  })
  id: number;

  @ApiProperty({
    description: 'Код валюты',
    example: 'USD',
    type: 'string',
  })
  code: string;

  @ApiProperty({
    description: 'Номинал валюты',
    example: 1,
    type: 'integer',
  })
  nominal: number;

  @ApiProperty({
    description: 'Курс валюты к рублю',
    example: 90.5,
    type: 'integer',
  })
  rate: number;

  @ApiProperty({
    description: 'Дата последнего обновления',
    example: '2024-01-01T00:00:00.000Z',
    type: 'string',
    format: 'date-time',
  })
  date: Date;

  constructor(
    id: number,
    code: string,
    nominal: number,
    rate: number,
    date: Date,
  ) {
    this.id = id;
    this.code = code;
    this.nominal = nominal;
    this.rate = rate;
    this.date = date;
  }
}
