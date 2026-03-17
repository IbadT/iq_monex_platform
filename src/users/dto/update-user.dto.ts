import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({
    description: 'Имя пользователя',
    example: 'Иванов Иван Иванович',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  constructor(name: string) {
    this.name = name;
  }
}
