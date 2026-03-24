import { ApiProperty } from '@nestjs/swagger';

export class ToggleLikeResponseDto {
  @ApiProperty({
    description: 'ID объявления',
    example: '9d9412a4-37e2-43a1-8896-5a99bf3dfb81',
    type: 'string',
    format: 'uuid',
  })
  id: string;

  @ApiProperty({
    description: 'Проделанное действие',
    example: 'LIKED',
    enum: ['LIKED', 'UNLIKED'],
    type: 'string',
  })
  action: string;

  constructor(id: string, action: string) {
    this.id = id;
    this.action = action;
  }
}
