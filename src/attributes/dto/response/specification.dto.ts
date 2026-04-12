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

  @ApiProperty({
    description: 'Пользовательская характеристика (true) или глобальная (false)',
    example: false,
    type: 'boolean',
  })
  isCustom: boolean;

  constructor(id: number, name: string, isCustom: boolean = false) {
    this.id = id;
    this.name = name;
    this.isCustom = isCustom;
  }
}
