import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ConfirmResetPasswordDto {
  @ApiProperty({
    description: 'Новый пароль пользователя',
    example: 'NewSecurePassword123!',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  newPassword: string;

  @ApiProperty({
    description: 'Код подтверждения из email',
    example: '123456',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  code: string;

  @ApiProperty({
    description: 'Email пользователя',
    example: 'user@example.com',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  email: string;

  constructor(newPassword: string, code: string, email: string) {
    this.newPassword = newPassword;
    this.code = code;
    this.email = email;
  }
}
