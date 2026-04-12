import { ApiProperty } from '@nestjs/swagger';
import { ArrayMaxSize, IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateUserSuggestionDto {
  @ApiProperty({
    description: 'Текст предложения пользователя',
    example: 'Добавьте возможность фильтрации по цене',
    required: true,
  })
  @IsNotEmpty({ message: 'Текст предложения обязателен' })
  @IsString({ message: 'Текст должен быть строкой' })
  text: string;

  @ApiProperty({
    description: 'Массив картинок формата base64 (максимум 3)',
    example: ['data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...'],
    required: false,
    type: [String],
    isArray: true,
  })
  @IsOptional()
  @IsArray({ message: 'Фотографии должны быть массивом' })
  @IsString({ each: true, message: 'Каждая фотография должна быть строкой base64' })
  @ArrayMaxSize(3, { message: 'Максимум 3 фотографии' })
  photos: string[] = [];

  constructor(text: string, photos?: string[]) {
    this.text = text;
    this.photos = photos || [];
  }
}
