import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
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
  text: string;

  @ApiProperty({
    description: 'Оценка от 1 до 5',
    example: 5,
    required: true,
  })
  @IsNumber()
  @Min(0)
  @Max(5)
  rating: number;

  @ApiProperty({
    description: 'Фотографии для комментария, формата base64',
    example: [],
    required: false,
  })
  @IsString({ each: true })
  photos: string[] = [];

  constructor(userId: string, text: string, rating: number, photos: string[]) {
    this.userId = userId;
    this.text = text;
    this.rating = rating;
    this.photos = photos;
  }
}
