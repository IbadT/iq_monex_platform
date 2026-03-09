import { ListingStatus } from '@/listings/enums/listing-status.enum';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';

export class ChangeListingStatusDto {
  @ApiProperty({
    description:
      'Переместить объявление в (архив, черновик, опубликовать, шаблон)',
    example: ListingStatus.ARCHIVED,
    enum: ListingStatus,
  })
  @IsEnum(ListingStatus)
  status: ListingStatus;

  constructor(status: ListingStatus) {
    this.status = status;
  }
}
