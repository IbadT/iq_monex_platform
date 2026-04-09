import { ApiProperty } from '@nestjs/swagger';
import { ListingResposeDto } from './listing-response.dto';

class PaginationDto {
  @ApiProperty({
    description: 'Общее количество объявлений',
    example: 100,
    type: 'integer',
  })
  total!: number;

  @ApiProperty({
    description: 'Лимит записей на странице',
    example: 20,
    type: 'integer',
  })
  limit!: number;

  @ApiProperty({
    description: 'Смещение (offset)',
    example: 0,
    type: 'integer',
  })
  offset!: number;

  @ApiProperty({
    description: 'Есть ли еще записи',
    example: true,
    type: 'boolean',
  })
  hasMore!: boolean;
}

export class ListingListResponseDto {
  @ApiProperty({
    description: 'Массив объявлений',
    type: [ListingResposeDto],
  })
  rows!: ListingResposeDto[];

  @ApiProperty({
    description: 'Информация о пагинации',
    type: PaginationDto,
  })
  pagination!: PaginationDto;
}
