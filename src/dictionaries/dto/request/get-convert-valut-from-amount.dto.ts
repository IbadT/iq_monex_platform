import { VALUT_CODE } from '@/dictionaries/enums/valut-code.enum';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsString } from 'class-validator';

export class GetConvertValueFromAmountDto {
  @ApiProperty({
    description: '',
    example: VALUT_CODE.RUB,
    required: true,
    enum: VALUT_CODE,
  })
  @IsString()
  @IsEnum(VALUT_CODE)
  code: VALUT_CODE;

  @ApiProperty({
    description: '',
    example: 100,
    required: true,
  })
  @IsNumber()
  amount: number;

  constructor(code: VALUT_CODE, amount: number) {
    this.code = code;
    this.amount = amount;
  }
}
