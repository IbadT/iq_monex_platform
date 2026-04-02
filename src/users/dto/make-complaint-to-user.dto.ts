import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsUUID,
  IsEnum,
  ArrayMaxSize,
} from 'class-validator';
import { ComplaintReasonType } from '../enums/complaint-reason-type.enum';

export class MakeComplaintToUserDto {
  @ApiProperty({
    description: 'Тип жалобы',
    example: ComplaintReasonType.SPAM,
    required: true,
    enum: ComplaintReasonType,
  })
  @IsNotEmpty()
  @IsEnum(ComplaintReasonType)
  type: string;

  @ApiProperty({
    description: 'Текст жалобы',
    example: 'Пользователь спамит в комментариях',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  text: string;

  @ApiProperty({
    description: 'ID пользователя, на которого оставляется жалоба',
    example: '123e4567-e89b-12d3-a456-426614174001',
    required: true,
  })
  @IsNotEmpty()
  @IsUUID()
  userId: string;

  @ApiProperty({
    description: 'Картинки для жалобы формата Base64',
    example: '',
    type: [String],
    isArray: true,
  })
  @ArrayMaxSize(3, { message: 'Максимум 3 фотографии' })
  images: string[];

  constructor(type: string, text: string, userId: string, images: string[]) {
    this.type = type;
    this.text = text;
    this.userId = userId;
    this.images = images;
  }
}
