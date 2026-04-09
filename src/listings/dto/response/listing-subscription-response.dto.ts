import { ApiProperty } from '@nestjs/swagger';

export class ListingSubscriptionResponseDto {
  @ApiProperty({
    description: 'Дата начала подписки',
    example: '2024-01-01T00:00:00.000Z',
    nullable: true,
  })
  subscriptionStartDate: Date | null;

  @ApiProperty({
    description: 'Дата окончания промо-акции',
    example: '2024-12-31T23:59:59.000Z',
    nullable: true,
  })
  promoEndDate: Date | null;

  constructor(
    subscriptionStartDate: Date | null,
    promoEndDate: Date | null,
  ) {
    this.subscriptionStartDate = subscriptionStartDate;
    this.promoEndDate = promoEndDate;
  }
}
