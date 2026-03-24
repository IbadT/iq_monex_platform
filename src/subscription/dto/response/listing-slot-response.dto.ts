import { ApiProperty } from '@nestjs/swagger';

export class ListingSlotResponseDto {
  @ApiProperty({
    description: 'ID слота объявления',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: 'string',
    format: 'uuid',
  })
  id: string;

  @ApiProperty({
    description: 'ID объявления',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: 'string',
    format: 'uuid',
  })
  listingId: string;

  @ApiProperty({
    description: 'ID пользовательского слота',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: 'string',
    format: 'uuid',
  })
  userSlotId: string;

  @ApiProperty({
    description: 'Дата добавления в слот',
    example: '2024-12-31T23:59:59.000Z',
    type: 'string',
    format: 'date-time',
  })
  assignedAt: Date;

  @ApiProperty({
    description: 'Время, когда слот освобожден',
    example: '2024-12-31T23:59:59.000Z',
    type: 'string',
    format: 'date-time',
  })
  releasedAt: Date | null;

  @ApiProperty({
    description: 'Причина освобождения',
    example: 'ARCHIVED',
    type: 'string',
    // enums: ['ARCHIVED', 'DELETED', 'REPUBLISHED'],
  })
  releaseReason: string | null;

  constructor(
    id: string,
    listingId: string,
    userSlotId: string,
    assignedAt: Date,
    releasedAt: Date | null,
    releaseReason: string | null,
  ) {
    this.id = id;
    this.listingId = listingId;
    this.userSlotId = userSlotId;
    this.assignedAt = assignedAt;
    this.releasedAt = releasedAt;
    this.releaseReason = releaseReason;
  }
}
