import { ListingStatus } from '@/listings/enums/listing-status.enum';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';

export class StatusQueryDto {
  @ApiProperty({
    enum: ListingStatus,
    example: ListingStatus.PUBLISHED,
    description: 'Статус объявления',
    required: true,
  })
  @IsEnum(ListingStatus)
  status: ListingStatus;

  constructor(status: ListingStatus) {
    this.status = status;
  }
}
