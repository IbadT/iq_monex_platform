import { ApiProperty } from '@nestjs/swagger';
import { GetAvailableSlotResponseDto } from './get-available-slot-response.dto';

export class SlotPackageResponseDto {
  @ApiProperty({
    description: 'ID пакета слота',
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

  slots: number;

  expiresAt: Date;

  @ApiProperty({
    description: 'Активен ли пакет',
    example: true,
    type: 'boolean',
  })
  isActive: boolean;

  paymentId: string | null;

  userSlots?: GetAvailableSlotResponseDto[] | null;

  //   @ApiProperty({
  //     description: 'Название пакета',
  //     example: 'Пакет "Бизнес"',
  //     type: 'string',
  //   })
  //   name: string;

  //   @ApiProperty({
  //     description: 'Количество слотов в пакете',
  //     example: 10,
  //     type: 'string',
  //   })
  //   slotCount: number;

  //   @ApiProperty({
  //     description: 'Длительность пакета в днях',
  //     example: 30,
  //     type: 'integer',
  //   })
  //   duration: number;

  //   @ApiProperty({
  //     description: 'Стоимость пакета',
  //     example: 500,
  //     type: 'integer',
  //   })
  //   price: number;

  constructor(
    id: string,
    userId: string,
    slots: number,
    expiresAt: Date,
    paymentId: string | null,
    isActive: boolean,
    userSlots?: GetAvailableSlotResponseDto[],
  ) {
    this.id = id;
    this.userId = userId;
    this.slots = slots;
    this.expiresAt = expiresAt;
    this.paymentId = paymentId;
    this.isActive = isActive;
    if (userSlots !== undefined) {
      this.userSlots = userSlots;
    }
  }
}
