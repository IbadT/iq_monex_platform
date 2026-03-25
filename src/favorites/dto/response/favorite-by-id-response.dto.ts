import { ApiProperty } from '@nestjs/swagger';
import { ListingResposeDto } from '@/listings/dto/response/listing-response.dto';

export class FavoriteByIdResponseDto {
  @ApiProperty({
    description: 'ID избранного',
    example: '4b41bdb4-f243-488c-8426-36a9546bbe67',
    type: 'string',
  })
  id: string;

  @ApiProperty({
    description: 'ID пользователя, который добавил в избранное',
    example: '4b41bdb4-f243-488c-8426-36a9546bbe67',
    type: 'string',
  })
  userId: string;

  @ApiProperty({
    description: 'Тип избранного',
    example: 'LISTING',
    type: 'string',
  })
  type: string;

  @ApiProperty({
    description: 'ID объявления (если type=LISTING)',
    example: '4b41bdb4-f243-488c-8426-36a9546bbe67',
    type: 'string',
  })
  listingId: string | null;

  @ApiProperty({
    description: 'ID пользователя (если type=USER)',
    example: '4b41bdb4-f243-488c-8426-36a9546bbe67',
    type: 'string',
  })
  targetUserId: string | null;

  @ApiProperty({
    description: 'Дата создания',
    example: '2026-03-22T16:24:33.144Z',
    type: 'string',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Объявление (включается через include)',
    type: () => ListingResposeDto,
    required: false,
  })
  listing: ListingResposeDto | null;

  constructor(
    id: string,
    userId: string,
    type: string,
    listingId: string | null,
    targetUserId: string | null,
    createdAt: Date,
    listing: ListingResposeDto | null,
  ) {
    this.id = id;
    this.userId = userId;
    this.type = type;
    this.listingId = listingId;
    this.targetUserId = targetUserId;
    this.createdAt = createdAt;
    this.listing = listing;
  }
}
