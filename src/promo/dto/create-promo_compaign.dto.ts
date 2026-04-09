import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, IsOptional, Min, Max } from 'class-validator';
import { PromoCampaignStatus } from '../enums/promo-status.enum';

export class CreatePromoCompaignDto {
  @ApiProperty({
    example: 'SUMMER2024',
    // description: 'Unique code for the campaign',
    description: 'Уникальный код для кампании',
  })
  @IsString()
  code: string;

  @ApiProperty({
    example: 'Summer Promo 2024',
    description: 'Название кампании',
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: 100,
    description: 'Максимальное количество участников',
  })
  @IsInt()
  @Min(1)
  maxParticipants: number;

  @ApiProperty({
    example: 7,
    description: 'Количество бесплатных дней для новых пользователей',
  })
  @IsInt()
  @Min(0)
  initialFreeDays: number;

  @ApiProperty({
    example: 20,
    description: 'Процент скидки для последующих периодов',
  })
  @IsInt()
  @Min(0)
  @Max(100)
  subsequentDiscount: number;

  @ApiProperty({
    example: 30,
    description: 'Количество дней для последующей скидки',
  })
  @IsInt()
  @Min(1)
  subsequentDays: number;

  @ApiProperty({
    example: 10,
    description:
      'Требуемое количество активных объявлений для получения скидки',
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  requiredActiveListings?: number = 10;

  @ApiProperty({
    example: 7,
    description:
      'Количество дней, в течение которых пользователь должен быть активным для получения скидки',
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  requiredDays?: number = 7;

  @ApiProperty({
    example: 'ACTIVE',
    description: 'Статус кампании',
    enum: PromoCampaignStatus,
  })
  @IsOptional()
  status?: PromoCampaignStatus = PromoCampaignStatus.ACTIVE;

  constructor(
    code: string,
    name: string,
    maxParticipants: number,
    initialFreeDays: number,
    subsequentDiscount: number,
    subsequentDays: number,
  ) {
    this.code = code;
    this.name = name;
    this.maxParticipants = maxParticipants;
    this.initialFreeDays = initialFreeDays;
    this.subsequentDiscount = subsequentDiscount;
    this.subsequentDays = subsequentDays;
  }
}
