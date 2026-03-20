import { ListingStatus } from '@/listings/enums/listing-status.enum';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsUUID } from 'class-validator';

export class ChangeListingStatusDto {
  @ApiProperty({
    description:
      'Переместить объявление в (архив, черновик, опубликовать, шаблон)',
    example: ListingStatus.ARCHIVED,
    enum: ListingStatus,
  })
  @IsEnum(ListingStatus)
  status: ListingStatus;

  @ApiProperty({
    description: 'ID объявления',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  listingId: string;

  constructor(status: ListingStatus, listingId: string) {
    this.status = status;
    this.listingId = listingId;
  }
}
