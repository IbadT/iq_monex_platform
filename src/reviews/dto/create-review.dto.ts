import {
  IsNumber,
  IsPositive,
  IsUUID,
  Min,
  Max,
  IsArray,
  IsString,
  ArrayMaxSize,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReviewDto {
  @ApiProperty({
    description: 'ID объявления для которого оставляется отзыв',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: true,
  })
  @IsUUID()
  listingId: string;

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

  @ApiProperty({
    description: 'Массив base64 строк для документов (макс. 5)',
    example: [
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
    ],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ArrayMaxSize(5)
  photos?: string[]; // Массив base64 строк для документов (макс. 5)

  constructor(
    listingId: string,
    content: string,
    rating: number,
    photos?: string[],
  ) {
    this.listingId = listingId;
    this.content = content;
    this.rating = rating;
    this.photos = photos || [];
  }
}
