import { ApiProperty } from '@nestjs/swagger';

export class BulkRestoreResponseDto {
  @ApiProperty({
    description: 'Количество восстановленных объявлений',
    example: 5,
    type: 'integer',
  })
  restored: number;

  @ApiProperty({
    description: 'Количество использованных слотов',
    example: 5,
    type: 'integer',
  })
  slotsUsed: number;

  constructor(restored: number, slotsUsed: number) {
    this.restored = restored;
    this.slotsUsed = slotsUsed;
  }
}
