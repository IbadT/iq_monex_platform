import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsInt, IsBoolean, IsUUID, Min, Max } from 'class-validator';

export class ListingReviewsQueryDto {
  @ApiProperty({
    description: 'ID объявления',
    example: '550e8400-e29b-41d4-a716-446655440000',
    type: 'string',
    format: 'uuid',
  })
  @IsUUID()
  listing_id: string;

  @ApiPropertyOptional({
    description: 'Общее количество элементов для получения. None - вернет все',
    example: 20,
    minimum: 1,
    maximum: 100,
    default: 20,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 20;

  @ApiPropertyOptional({
    description: 'Сколько элементов будет пропущено с начала',
    example: 0,
    minimum: 0,
    default: 0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  offset?: number = 0;

  @ApiPropertyOptional({
    description: 'Комментарии только с фото\n\ntrue - только с фото; false - только без фото',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  has_photo?: boolean;

  @ApiPropertyOptional({
    description: 'Отсортировать по дате создания\n\ntrue - сначала новые; false - сначала старые; null - игнорируем',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  new_first?: boolean;

  @ApiPropertyOptional({
    description: 'Отсортировать по рейтингу\n\ntrue - сначала положительные; false - сначала негативные; null - игнорируем',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  positive_rate_first?: boolean;

  constructor(listing_id: string) {
    this.listing_id = listing_id;
  }
}
