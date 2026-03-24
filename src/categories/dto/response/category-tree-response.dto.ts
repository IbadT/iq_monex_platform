import { ApiProperty } from '@nestjs/swagger';

export class CategoryTreeResponseDto {
  @ApiProperty({ description: 'ID категории', example: 1, type: Number })
  id: number;

  @ApiProperty({
    description: 'Название категории',
    example: 'Готовая продукция',
    type: String,
  })
  name: string;

  @ApiProperty({
    description: 'ID родительской категории',
    example: 1,
    required: false,
    type: Number,
  })
  parentId: number | null;

  @ApiProperty({
    description: 'Дочерние категории',
    type: () => [CategoryTreeResponseDto],
    required: false,
    isArray: true,
  })
  children: CategoryTreeResponseDto[] | null;

  constructor(
    id: number,
    name: string,
    parentId: number | null,
    children: CategoryTreeResponseDto[] | null,
  ) {
    this.id = id;
    this.name = name;
    this.parentId = parentId;
    this.children = children;
  }
}

export class SubcategoryTreeResponseDto extends CategoryTreeResponseDto {}

export class SubSubcategoryTreeResponseDto extends CategoryTreeResponseDto {}
