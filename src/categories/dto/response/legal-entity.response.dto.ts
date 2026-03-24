import { ApiProperty } from '@nestjs/swagger';

export class LegalEntityResponseDto {
  @ApiProperty({
    description: 'ID типа юридического лица',
    example: 1,
    type: 'integer',
  })
  id: number;

  @ApiProperty({
    description: 'Код',
    example: 'OOO',
    type: 'string',
  })
  code: string;

  @ApiProperty({
    description: 'Полное название',
    example: 'Общество с ограниченной ответственностью',
    type: 'string',
  })
  name: string;

  constructor(id: number, code: string, name: string) {
    this.id = id;
    this.code = code;
    this.name = name;
  }
}
