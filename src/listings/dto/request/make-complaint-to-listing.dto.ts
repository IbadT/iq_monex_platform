import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

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
    description: '',
    example: '',
    required: true,
  })
  photos?: string[] = [];

  constructor(
    type: string,
    text: string,
    listingId: string,
    photos?: string[],
  ) {
    this.type = type;
    this.text = text;
    this.listingId = listingId;
    if (photos) {
      this.photos = photos;
    }
  }
}
