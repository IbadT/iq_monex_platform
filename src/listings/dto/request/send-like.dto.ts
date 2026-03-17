import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class SendLikeDto {
  @ApiProperty({
    description: 'ID объявления для лайка',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  listing_id: string;

  constructor(listing_id: string) {
    this.listing_id = listing_id;
  }
}
