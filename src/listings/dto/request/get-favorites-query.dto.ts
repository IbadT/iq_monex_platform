import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';

export class GetFavoritesQueryDto {
  @ApiProperty({
    description: 'Максимальное количество полученных элементов',
    example: 10,
    default: 10,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  limit: number = 10;

  @ApiProperty({
    description: 'Количество элементов для пропуска',
    example: 0,
    default: 0,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  offset: number = 0;

  constructor(limit?: number, offset?: number) {
    this.limit = limit || 10;
    this.offset = offset || 0;
  }
}
