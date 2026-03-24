import { ApiProperty } from '@nestjs/swagger';
import { LikeResponseDto } from './like-response.dto';

export class GetLikesResponseDto {
  @ApiProperty({
    description: 'Количество лайков',
    example: 42,
    type: 'integer',
  })
  likesCount: number;

  @ApiProperty({
    description: 'Описание лайка',
    type: () => LikeResponseDto,
  })
  likes: LikeResponseDto[];

  constructor(likesCount: number, likes: LikeResponseDto[]) {
    this.likesCount = likesCount;
    this.likes = likes;
  }
}
