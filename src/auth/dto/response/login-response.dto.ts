import { ApiProperty } from '@nestjs/swagger';
import { UserLoginResponseDto } from './user-login-response.dto';

export class LoginResponseDto {
  @ApiProperty({
    description: 'Access token for authentication',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  accessToken: string;

  @ApiProperty({
    description: 'Refresh token for getting new access token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  refreshToken: string;

  @ApiProperty({
    description: 'User information',
    type: () => UserLoginResponseDto,
  })
  user: UserLoginResponseDto;

  constructor(
    accessToken: string,
    refreshToken: string,
    user: UserLoginResponseDto,
  ) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    this.user = user;
  }
}
