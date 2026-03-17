import { ApiProperty } from '@nestjs/swagger';
import {
  IsUUID,
  IsString,
  IsNumber,
  IsPositive,
  Min,
  Max,
} from 'class-validator';

export class UpdateReviewDto {
  @ApiProperty({
    description: 'ID объявления для которого оставляется отзыв',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: true,
  })
  @IsUUID()
  listingId: string;

  @ApiProperty({
    description: 'Заголовок отзыва',
    example: 'Отличное объявление',
    required: true,
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: 'Содержание отзыва',
    example: 'Отличное объявление, рекомендую',
    required: true,
  })
  @IsString()
  content: string;

  @ApiProperty({
    description: 'Рейтинг от 1 до 5',
    example: 5,
    required: true,
  })
  @IsNumber()
  @IsPositive()
  @Min(1, { message: 'Минимальный рейтинг - 1' })
  @Max(5, { message: 'Максимальный рейтинг - 5' })
  rating: number;

  constructor(
    listingId: string,
    title: string,
    content: string,
    rating: number,
  ) {
    this.listingId = listingId;
    this.title = title;
    this.content = content;
    this.rating = rating;
  }
}
