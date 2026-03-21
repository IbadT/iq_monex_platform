import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class AddFavoriteToUserDto {
  @ApiProperty({
    description: 'ID пользователя, которого нужно добавить в избранное',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  userId: string;

  constructor(userId: string) {
    this.userId = userId;
  }
}
