import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsString,
  IsNumber,
  Min,
  Max,
  IsOptional,
  IsInt,
} from 'class-validator';
import { Type } from 'class-transformer';

export class GetProfilesDto {
  @ApiProperty({
    description: 'Количество профилей для возврата',
    example: 10,
    required: false,
    minimum: 1,
    maximum: 100,
  })
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  limit: number = 10;

  @ApiProperty({
    description: 'Смещение для пагинации',
    example: 0,
    required: false,
    minimum: 0,
  })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  offset: number = 0;

  @ApiProperty({
    description: 'Поисковый запрос для фильтрации по названию компании',
    example: 'Строительная компания',
    required: false,
  })
  @IsOptional()
  @IsString()
  query?: string | '';

  @ApiProperty({
    description: 'Минимальный рейтинг компании',
    example: 4.5,
    required: false,
    minimum: 0,
    maximum: 5,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(5)
  ratingMin?: number;

  @ApiProperty({
    description: 'Массив ID активностей для фильтрации',
    example: [
      1,
      2,
    ],
    required: false,
    type: [Number],
  })
  @IsOptional()
  @IsArray()
  @Type(() => Number)
  @IsInt({ each: true, })
  activityIds?: number[];

  constructor(
    limit: number,
    offset: number,
    query?: string,
    ratingMin?: number,
    activitiIds?: number[],
  ) {
    this.limit = limit;
    this.offset = offset;
    if (activitiIds) {
      this.activityIds = activitiIds;
    }
    if (ratingMin !== undefined) {
      this.ratingMin = ratingMin;
    }
    if (query !== undefined) {
      this.query = query;
    }
  }
}
