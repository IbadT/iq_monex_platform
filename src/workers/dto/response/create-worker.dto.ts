import { ApiProperty } from '@nestjs/swagger';

export class CreateWorkerResponseDto {
  @ApiProperty({
    description: 'ID созданного работника',
    example: '550e8400-e29b-41d4-a716-446655440000',
    type: 'string',
    format: 'uuid',
  })
  id: string;

  constructor(id: string) {
    this.id = id;
  }
}
