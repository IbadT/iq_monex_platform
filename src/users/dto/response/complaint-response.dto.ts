import { ApiProperty } from '@nestjs/swagger';

export class ComplaintResponseDto {
  @ApiProperty({
    description: 'ID жалобы',
    example: '550e8400-e29b-41d4-a716-446655440000',
    type: 'string',
  })
  id: string;

  constructor(id: string) {
    this.id = id;
  }
}
