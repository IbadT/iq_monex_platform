import { ApiProperty } from '@nestjs/swagger';

export class UserLoginResponseDto {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'ID пользователя',
  })
  id: string;

  @ApiProperty({
    description: 'Email пользователя',
    example: 'example@example.com',
  })
  email: string;

  constructor(id: string, email: string) {
    this.id = id;
    this.email = email;
  }
}
