import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty({
    description: 'Email пользователя для сброса пароля',
    example: 'user@example.com',
    required: true,
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  constructor(email: string) {
    this.email = email;
  }
}
