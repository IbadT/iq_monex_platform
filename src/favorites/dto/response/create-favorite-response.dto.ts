import { ApiProperty } from '@nestjs/swagger';

export class CreateFavoriteResponseDto {
  @ApiProperty({
    description: 'ID избранного',
    example: '4b41bdb4-f243-488c-8426-36a9546bbe67',
    type: 'string',
  })
  id: string;

  constructor(id: string) {
    this.id = id;
  }
}
