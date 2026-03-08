import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginUserDto {
  @ApiProperty({
    description: 'Email пользователя',
    example: 'test@gmail.com',
    required: true,
  })
  @IsEmail({}, { message: 'Некорректный email' })
  email: string;

  @ApiProperty({
    description: 'Пароль пользователя',
    example: 'Q!1qwerty',
    required: true,
  })
  @Expose()
  @IsString({ message: 'Пароль должен быь строкой' })
  @IsNotEmpty({ message: 'Пароль не должет быть пустым' })
  password: string;

  constructor(email: string, password: string) {
    this.email = email;
    this.password = password;
  }
}
