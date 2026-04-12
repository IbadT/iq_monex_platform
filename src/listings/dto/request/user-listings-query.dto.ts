import { IsOptional, IsNumber, IsEnum, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { ListingStatus } from '../../enums/listing-status.enum';

export class UserListingsQueryDto {
  @ApiPropertyOptional({
    description: 'Количество элементов на странице',
    type: Number,
    minimum: 1,
    maximum: 100,
    default: 20,
    example: 20,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number = 20;

  @ApiPropertyOptional({
    description: 'Смещение для пагинации',
    type: Number,
    minimum: 0,
    default: 0,
    example: 0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  offset?: number = 0;

  @ApiPropertyOptional({
    description: 'Статус объявления',
    enum: ListingStatus,
    example: ListingStatus.PUBLISHED,
    required: true,
  })
  @IsEnum(ListingStatus)
  status: ListingStatus;

  constructor(status: ListingStatus) {
    this.status = status;
  }
}
