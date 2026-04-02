import { ApiProperty } from '@nestjs/swagger';

export class ListingFileResponseDto {
  @ApiProperty({
    description: 'ID файла или картинки',
    example: '',
    type: 'string',
    format: 'uuid',
  })
  id: string;

  @ApiProperty({
    description: 'Url картинки',
    example: '',
    type: 'string',
  })
  url: string;

  @ApiProperty({
    description: 'Тип файла или картинки',
    example: 'image/jpeg, application/pdf',
    type: 'string',
  })
  fileType: string;

  @ApiProperty({
    description: 'Является ли эта картинка главной для отображения',
    example: false,
    default: false,
    type: 'boolean',
  })
  isPrimary: boolean = false;

  constructor(id: string, url: string, fileType: string, isPrimary: boolean) {
    this.id = id;
    this.url = url;
    this.fileType = fileType;
    this.isPrimary = isPrimary;
  }
}
