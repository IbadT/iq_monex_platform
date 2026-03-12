import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsPositive } from 'class-validator';

export class PaginationDto {
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

  constructor(limit: number, offset: number) {
    this.limit = limit;
    this.offset = offset;
  }
}
