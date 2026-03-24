import { ApiProperty } from '@nestjs/swagger';

export class SpecificationResponseDto {
  @ApiProperty({
    description: 'Уникальный идентификатор спецификации',
    example: 1,
    type: 'integer',
  })
  id: number;

  @ApiProperty({
    description: 'Название спецификации на выбранном языке',
    example: 'Состояние',
    type: 'string',
  })
  name: string;

  constructor(id: number, name: string) {
    this.id = id;
    this.name = name;
  }
}
