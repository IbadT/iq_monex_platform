import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateSpecificationDto {
  @ApiProperty({
    description: 'Название спецификации',
    example: 'Цвет',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  constructor(name: string) {
    this.name = name;
  }
}
