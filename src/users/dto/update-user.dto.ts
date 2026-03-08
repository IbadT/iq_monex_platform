import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({
    description: 'Имя пользователя',
    example: 'Иванов Иван Иванович',
    required: true,
  })
  name: string;

  constructor(name: string) {
    this.name = name;
  }
}
