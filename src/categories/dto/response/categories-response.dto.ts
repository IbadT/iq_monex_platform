import { ApiProperty } from '@nestjs/swagger';

export class CategoryResponseDto {
  @ApiProperty({
    description: '',
    example: 1,
    type: Number,
  })
  id: number;

  @ApiProperty({
    description: '',
    example: 'Готовая продукция',
    type: String,
  })
  name: string;

  constructor(id: number, name: string) {
    this.id = id;
    this.name = name;
  }
}

export class SubcategoryResponseDto extends CategoryResponseDto {}

export class SubSubcategoryResponseDto extends CategoryResponseDto {}
