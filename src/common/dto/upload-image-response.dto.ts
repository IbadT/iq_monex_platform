import { ApiProperty } from '@nestjs/swagger';

export class UploadImageResponseDto {
  @ApiProperty({
    description: 'Success status of the upload operation',
    example: true,
  })
  success!: boolean;

  @ApiProperty({
    description: 'Message describing the result',
    example: 'Image uploaded successfully',
  })
  message!: string;

  @ApiProperty({
    description: 'Uploaded file information',
    example: {
      key: 'images/1647890123456.jpg',
      url: 'https://storage.clo.ru/images/1647890123456.jpg',
    },
  })
  data!: {
    key: string;
    url: string;
  };
}

export class UploadImageErrorDto {
  @ApiProperty({
    description: 'Success status of the upload operation',
    example: false,
  })
  success!: boolean;

  @ApiProperty({
    description: 'Error message',
    example: 'No file provided',
  })
  message!: string;
}
