import {
  IsOptional,
  IsNumber,
  IsEnum,
  IsString,
  Min,
  Max,
  IsPositive,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { ListingStatus } from '../../enums/listing-status.enum';

// Enum для состояния
enum ListingCondition {
  NEW = 'NEW',
  USED = 'USED',
}

export class ListingQueryDto {
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
  })
  @IsOptional()
  @IsEnum(ListingStatus)
  status?: ListingStatus;

  @ApiPropertyOptional({
    description: 'Состояние товара',
    enum: ListingCondition,
    example: ListingCondition.NEW,
  })
  @IsOptional()
  @IsEnum(ListingCondition)
  condition?: ListingCondition;

  @ApiPropertyOptional({
    description: 'ID категории',
    type: Number,
    example: 1,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  categoryId?: number;

  @ApiPropertyOptional({
    description: 'ID подкатегории',
    type: Number,
    example: 2,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  subcategoryId?: number;

  @ApiPropertyOptional({
    description: 'ID под-подкатегории',
    type: Number,
    example: 3,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  subsubcategoryId?: number;

  @ApiPropertyOptional({
    description: 'Минимальная цена',
    type: Number,
    minimum: 0,
    example: 1000,
  })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  minPrice?: number;

  @ApiPropertyOptional({
    description: 'Максимальная цена',
    type: Number,
    minimum: 0,
    example: 100000,
  })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  maxPrice?: number;

  @ApiPropertyOptional({
    description: 'Минимальный рейтинг продавца',
    type: Number,
    example: 4.5,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  onlyFromRating?: number;

  @ApiPropertyOptional({
    description: 'Поиск по названию и описанию',
    type: String,
    example: 'iphone 15 pro max',
  })
  @IsOptional()
  @IsString()
  search?: string;

  /**
   * Конструктор для создания DTO
   * Все поля опциональны, используются значения по умолчанию
   */
  constructor(partial?: Partial<ListingQueryDto>) {
    if (partial) {
      Object.assign(this, partial);

      // Применяем значения по умолчанию, если не указаны
      this.limit = partial.limit ?? 20;
      this.offset = partial.offset ?? 0;
    }
  }
}
