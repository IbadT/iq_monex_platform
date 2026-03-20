import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail } from 'class-validator';
import { User } from '@/users/entities/user.entity';

export class VerifyCodeDto {
  @ApiProperty({
    description: '',
    example: '',
  })
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: '',
    example: '',
  })
  @IsString()
  code: string;

  constructor(email: string, code: string) {
    this.email = email;
    this.code = code;
  }
}

export class VerifyCodeResponseDto {
  @ApiProperty({
    description: '',
    example: '',
  })
  message: string;

  @ApiProperty({
    description: '',
    example: 200,
  })
  status: number;

  @ApiProperty({
    description: 'Информация о пользователе',
    type: User,
    required: false,
  })
  user?: User;

  @ApiProperty({
    description: 'JWT токены',
    example: {
      accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    },
    required: false,
  })
  tokens?:
    | {
        accessToken: string;
        refreshToken: string;
      }
    | undefined;

  constructor(
    message: string,
    status: number,
    user?: User,
    tokens?: { accessToken: string; refreshToken: string },
  ) {
    this.message = message;
    this.status = status;
    if (user) {
      this.user = user;
    }
    if (tokens) {
      this.tokens = tokens;
    }
  }
}
