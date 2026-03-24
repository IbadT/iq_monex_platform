import { ApiProperty } from '@nestjs/swagger';
import { ListingSlotResponseDto } from './listing-slot-response.dto';

export class GetAvailableSlotResponseDto {
  @ApiProperty({
    description: 'ID слота',
    example: '456e7890-f12a-34b5-c678-532614174111',
    type: 'string',
    format: 'uuid',
  })
  id: string;

  @ApiProperty({
    description: 'ID пользователя',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: 'string',
    format: 'uuid',
  })
  userId: string;

  @ApiProperty({
    description: 'Индекс слота',
    example: 1,
    type: 'integer',
  })
  slotIndex: number;

  @ApiProperty({
    description: 'Тип источника слота',
    example: 'SUBSCRIPTION',
    type: 'string',
    enum: ['SUBSCRIPTION', 'SLOT_PACKAGE'],
  })
  sourceType: string; // TODO: добавить enum

  @ApiProperty({
    description: 'ID источника слота',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: 'string',
    format: 'uuid',
  })
  sourceId: string;

  @ApiProperty({
    description: 'ID пакета слота',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: 'string',
    format: 'uuid',
  })
  slotPackageId: string | null;

  @ApiProperty({
    description: 'ID подписки',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: 'string',
    format: 'uuid',
  })
  subscriptionId: string | null;

  @ApiProperty({
    description: 'Дата истечения срока действия слота',
    example: '2024-12-31T23:59:59.000Z',
    type: 'string',
    format: 'date-time',
  })
  expiresAt: Date;

  @ApiProperty({
    description: 'Связанное объявление (null если слот свободен)',
    type: () => ListingSlotResponseDto,
  })
  listingSlot: ListingSlotResponseDto | null;

  constructor(
    id: string,
    userId: string,
    slotIndex: number,
    sourceType: string,
    sourceId: string,
    slotPackageId: string | null,
    subscriptionId: string | null,
    expiresAt: Date,
    listingSlot: ListingSlotResponseDto | null,
  ) {
    this.id = id;
    this.userId = userId;
    this.slotIndex = slotIndex;
    this.sourceType = sourceType;
    this.sourceId = sourceId;
    this.slotPackageId = slotPackageId;
    this.subscriptionId = subscriptionId;
    this.expiresAt = expiresAt;
    this.listingSlot = listingSlot;
  }
}
