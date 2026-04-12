import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateUserSpecificationDto {
  @ApiProperty({
    description: 'Название характеристики',
    example: 'Моя кастомная характеристика',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  constructor(name: string) {
    this.name = name;
  }
}
