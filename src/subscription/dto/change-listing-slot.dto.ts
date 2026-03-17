import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class ChangeListingSlotDto {
  @ApiProperty({
    description: 'ID объявления для перемещения в другой слот',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: true,
  })
  @IsUUID()
  listingId: string;

  @ApiProperty({
    description: 'ID текущего слота, в котором находится объявление',
    example: '456e7890-f12a-34b5-c678-532614174111',
    required: true,
  })
  @IsUUID()
  fromSlotId: string;

  @ApiProperty({
    description: 'ID целевого свободного слота для перемещения',
    example: '789e0123-g45b-67c8-d901-642514174222',
    required: true,
  })
  @IsUUID()
  toSlotId: string;

  constructor(listingId: string, fromSlotId: string, toSlotId: string) {
    this.listingId = listingId;
    this.fromSlotId = fromSlotId;
    this.toSlotId = toSlotId;
  }
}
