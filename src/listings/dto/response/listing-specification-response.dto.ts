import { ApiProperty } from '@nestjs/swagger';

export class ListingSpecificationResponseDto {
  @ApiProperty({
    description: 'ID характеристики',
    example: 1,
    type: 'integer',
  })
  id: number;

  @ApiProperty({
    description: 'Название характеристики',
    example: 'Состояние',
    type: 'string',
  })
  name: string;

  @ApiProperty({
    description: 'Значение характеристики',
    example: 'Новое',
    type: 'string',
  })
  value: string;

  constructor(
    id: number,
    name: string,
    value: string,
  ) {
    this.id = id;
    this.name = name;
    this.value = value;
  }
}
