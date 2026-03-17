import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail } from 'class-validator';

export class ResendEmailDto {
  @ApiProperty({
    description: 'Email address for resending verification code',
    example: 'user@example.com'
  })
  @IsString()
  @IsEmail()
  email!: string;
}
