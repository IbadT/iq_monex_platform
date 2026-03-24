import { ApiProperty } from '@nestjs/swagger';
import { UserInLike } from './user-in-like.response.dto';

export class LikeResponseDto {
  @ApiProperty({
    description: 'ID лайка',
    example: 'bcea00ce-0a3b-4063-9289-1fd63662cbd3',
    type: 'string',
    format: 'uuid',
  })
  id: string;

  @ApiProperty({
    description: 'ID объявления',
    example: 'bcea00ce-0a3b-4063-9289-1fd63662cbd3',
    type: 'string',
    format: 'uuid',
  })
  listingId: string;

  @ApiProperty({
    description: 'ID пользователя, который поставил лайк',
    example: 'bcea00ce-0a3b-4063-9289-1fd63662cbd3',
    type: 'string',
    format: 'uuid',
  })
  userId: string;

  @ApiProperty({
    description: 'Данные пользователя',
    type: () => UserInLike,
  })
  user: UserInLike;

  constructor(id: string, listingId: string, userId: string, user: UserInLike) {
    this.id = id;
    this.listingId = listingId;
    this.userId = userId;
    this.user = user;
  }
}
