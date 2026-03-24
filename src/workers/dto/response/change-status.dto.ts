import { ApiProperty } from '@nestjs/swagger';

export class ChangeStatusResponseDto {
  @ApiProperty({
    description: 'Id работника',
    example: '550e8400-e29b-41d4-a716-446655440000',
    type: 'string',
    format: 'uuid',
  })
  id: string;

  constructor(id: string) {
    this.id = id;
  }
}
