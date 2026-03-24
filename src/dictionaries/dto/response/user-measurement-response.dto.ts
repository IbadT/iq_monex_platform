import { ApiProperty } from '@nestjs/swagger';

export class UnitMeasurementResponseDto {
  @ApiProperty({
    description: 'ID единицы измерения',
    example: 1,
    type: 'integer',
    format: 'uuid',
  })
  id: number;

  @ApiProperty({
    description: 'Название единицы измерения на выбранном языке',
    example: 'Штуки',
    type: 'string',
  })
  name: string;

  constructor(id: number, name: string) {
    this.id = id;
    this.name = name;
  }
}
