import { ApiProperty } from '@nestjs/swagger';

export class ActivityResponseDto {
  @ApiProperty({
    description: 'Уникальный идентификатор сферы деятельности',
    example: 1,
    type: 'integer',
  })
  id: number;

  @ApiProperty({
    description: 'Название сферы деятельности',
    example: 'Программирование',
    type: 'string',
  })
  name: string;

  constructor(id: number, name: string) {
    this.id = id;
    this.name = name;
  }
}
