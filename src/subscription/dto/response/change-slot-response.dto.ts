import { ApiProperty } from '@nestjs/swagger';

export class ChangeSlotResponseDto {
  @ApiProperty({
    description: 'Статус операции',
    example: 'Объявление успешно перемещено',
    type: 'string',
  })
  message: string;

  @ApiProperty({
    description: 'ID исходного слота',
    example: '456e7890-f12a-34b5-c678-532614174111',
    type: 'string',
    format: 'uuid',
  })
  fromSlotId: string;

  @ApiProperty({
    description: 'ID целевого слота',
    example: '789e0123-g45b-67c8-d901-642514174222',
    type: 'string',
    format: 'uuid',
  })
  toSlotId: string;

  @ApiProperty({
    description: 'ID перемещенного объявления',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: 'string',
    format: 'uuid',
  })
  listingId: string;

  constructor(
    message: string,
    fromSlotId: string,
    toSlotId: string,
    listingId: string,
  ) {
    this.message = message;
    this.fromSlotId = fromSlotId;
    this.toSlotId = toSlotId;
    this.listingId = listingId;
  }
}
