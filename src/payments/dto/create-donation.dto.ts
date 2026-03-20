import { VALUT_CODE } from '@/dictionaries/enums/valut-code.enum';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsString } from 'class-validator';

export class CreateDonationDto {
  @ApiProperty({
    description: 'Сумма доната',
    example: 100.5,
    required: true,
  })
  @IsNumber()
  amount: number;

  @ApiProperty({
    description: 'Валюта доната',
    example: 'RUB',
    required: true,
  })
  @IsString()
  @IsEnum(VALUT_CODE)
  currency: VALUT_CODE;

  constructor(amount: number, currency: VALUT_CODE) {
    this.amount = amount;
    this.currency = currency;
  }
}
