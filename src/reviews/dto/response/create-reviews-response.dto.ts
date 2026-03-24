import { ApiProperty } from '@nestjs/swagger';

export class CreateReviesResponseDto {
  @ApiProperty({
    description: 'ID отзыва',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: 'string',
    format: 'uuid',
  })
  id: string;

  constructor(id: string) {
    this.id = id;
  }
}
