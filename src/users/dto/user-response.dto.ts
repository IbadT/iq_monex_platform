import { ApiProperty } from '@nestjs/swagger';
import { User } from '../entities/user.entity';

export class UserResponseDto {
  @ApiProperty({
    description: 'User information',
    type: User,
  })
  user: User;

  constructor(user: User) {
    this.user = user;
  }
}
