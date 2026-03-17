import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';

export class AddFavoriteListingDto {
  @ApiProperty({
    description: 'ID объявления, для добавления в избранное',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: true,
  })
  @IsString()
  @IsUUID()
  listingId: string;

  constructor(listingId: string) {
    this.listingId = listingId;
  }
}
