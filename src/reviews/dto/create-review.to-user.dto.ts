import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMaxSize,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';

export class CreateReviewToUserDto {
  @ApiProperty({
    description: 'ID пользователя, которому оставляется отзыв',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  userId: string;

  @ApiProperty({
    description: 'Текст отзыва',
    example: 'Отличный мастер, рекомендую!',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  content: string;

  @ApiProperty({
    description: 'Оценка от 1 до 5',
    example: 5,
    required: true,
  })
  @IsNumber()
  @Min(1, { message: 'Минимальный рейтинг - 1' })
  @Max(5, { message: 'Максимальный рейтинг - 5' })
  rating: number;

  @ApiProperty({
    description: 'Фотографии для комментария, формата base64',
    example: [],
    required: false,
  })
  @IsOptional()
  @IsString({ each: true })
  @ArrayMaxSize(5)
  photos?: string[];

  constructor(userId: string, content: string, rating: number, photos?: string[]) {
    this.userId = userId;
    this.content = content;
    this.rating = rating;
    this.photos = photos || [];
  }
}
