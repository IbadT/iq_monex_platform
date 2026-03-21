import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class CreateFavoriteDto {
  @ApiProperty({
    description: 'ID объявления',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: true,
  })
  @IsUUID()
  listingId: string;

  constructor(listingId: string) {
    this.listingId = listingId;
  }
}
