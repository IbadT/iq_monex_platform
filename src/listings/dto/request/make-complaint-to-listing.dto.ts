import { ApiProperty } from '@nestjs/swagger';
import { ArrayMaxSize, IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class MakeComplaintToListing {
  @ApiProperty({
    description: '',
    example: '',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  type: string;

  @ApiProperty({
    description: '',
    example: '',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  text: string;

  @ApiProperty({
    description: '',
    example: '',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  listingId: string;

  @ApiProperty({
    description: 'Массив картинок формата base64',
    example: '',
    required: true,
    type: [String],
    isArray: true,
  })
  @ArrayMaxSize(3, { message: 'Максимум 3 фотографии' })
  photos: string[] = [];

  constructor(type: string, text: string, listingId: string, photos: string[]) {
    this.type = type;
    this.text = text;
    this.listingId = listingId;
    this.photos = photos;
  }
}
