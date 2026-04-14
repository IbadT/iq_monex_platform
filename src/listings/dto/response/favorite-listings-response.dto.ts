import { ApiProperty } from '@nestjs/swagger';
import { Listing } from '../../../../prisma/generated/browser';

export class FavoriteListingsResponseDto {
  @ApiProperty({
    description: 'Массив избранных объявлений',
    type: 'array',
    items: {
      type: 'object',
    },
  })
  listings: Listing[];

  @ApiProperty({
    description: 'Общее количество избранных',
    example: 25,
  })
  total: number;

  @ApiProperty({
    description: 'Текущая страница',
    example: 1,
  })
  page: number;

  @ApiProperty({
    description: 'Количество элементов на странице',
    example: 20,
  })
  limit: number;

  constructor(listings: Listing[], total: number, page: number, limit: number) {
    this.listings = listings;
    this.total = total;
    this.page = page;
    this.limit = limit;
  }
}
