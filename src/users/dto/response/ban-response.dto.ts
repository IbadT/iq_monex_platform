import { ApiProperty } from '@nestjs/swagger';

export class BanResponseDto {
  @ApiProperty({
    description: 'Статус бана пользователя',
    example: false,
    type: 'boolean',
  })
  isBanned: boolean;

  @ApiProperty({
    description: 'Причина бана (если пользователь забанен)',
    example: 'Нарушение правил платформы',
    type: 'string',
    nullable: true,
  })
  banReason: string | null;

  constructor(isBanned: boolean, banReason: string | null) {
    this.isBanned = isBanned;
    this.banReason = banReason;
  }
}
