import { ApiProperty } from '@nestjs/swagger';

export class CurrenciesResponseDto {
  @ApiProperty({
    description: 'ID валюты',
    example: 1,
    type: 'integer',
  })
  id: number;

  @ApiProperty({
    description: 'Символ валюты',
    example: '$',
    type: 'integer',
  })
  symbol: string;

  @ApiProperty({
    description: 'Название валюты на выбранном языке',
    example: 'Доллар США',
    type: 'integer',
  })
  name: string;

  @ApiProperty({
    description: 'Код валюты',
    example: 'USD',
    type: 'integer',
  })
  code: string;

  constructor(id: number, symbol: string, name: string, code: string) {
    this.id = id;
    this.symbol = symbol;
    this.name = name;
    this.code = code;
  }
}
