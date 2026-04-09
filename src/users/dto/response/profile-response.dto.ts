import { ActivityResponseDto } from '@/activities/dto/response/activity-response.dto';
import { LegalEntityResponseDto } from '@/categories/dto/response/legal-entity.response.dto';
import { PaginationDto } from '@/common/dto/pagintation.dto';
import { CurrenciesResponseDto } from '@/dictionaries/dto/response/currencies-response.dto';
import { ApiProperty } from '@nestjs/swagger';

export class ProfileResponseDto {
  @ApiProperty({
    description: 'ID профиля',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: 'string',
    format: 'uuid',
  })
  id: string;

  @ApiProperty({
    description: 'URL аватара',
    example: 'https://example.com/avatar.jpg',
    type: 'string',
  })
  avatarUrl: string | null;

  @ApiProperty({
    description: 'Телефон компании',
    example: '+77001234567',
    type: 'string',
  })
  phone: string | null;

  @ApiProperty({
    description: 'Email компании',
    example: 'info@company.com',
    type: 'string',
  })
  email: string | null;

  @ApiProperty({
    description: 'Telegram',
    example: '@company',
    type: 'string',
  })
  telegram: string | null;

  @ApiProperty({
    description: 'Сайт компании',
    example: 'https://company.com',
    type: 'string',
  })
  siteUrl: string | null;

  @ApiProperty({
    description: 'Описание компании',
    example: 'Строительная компания с 10-летним опытом',
    type: 'string',
  })
  description: string | null;

  @ApiProperty({
    description: 'Описание типа организации',
    type: () => LegalEntityResponseDto,
    nullable: true,
  })
  legalEntityType: LegalEntityResponseDto | null;

  @ApiProperty({
    description: 'Описание валюты',
    type: () => CurrenciesResponseDto,
    nullable: true,
  })
  currency: CurrenciesResponseDto | null;

  @ApiProperty({
    description: 'Описание сферы деятельности',
    type: () => ActivityResponseDto,
  })
  activities: ActivityResponseDto[];

  @ApiProperty({
    description: 'Рейтинг профиля',
    example: 3,
    type: 'integer',
  })
  rating: number;

  @ApiProperty({
    description: 'Количество коментариев у профиля',
    example: 23,
    type: 'integer',
  })
  commentsCount: number;

  constructor(
    id: string,
    avatarUrl: string | null,
    phone: string | null,
    email: string | null,
    telegram: string | null,
    siteUrl: string | null,
    description: string | null,
    legalEntityType: LegalEntityResponseDto | null,
    currency: CurrenciesResponseDto | null,
    activities: ActivityResponseDto[],
    rating: number,
    commentsCount: number,
  ) {
    this.id = id;
    this.avatarUrl = avatarUrl;
    this.phone = phone;
    this.email = email;
    this.telegram = telegram;
    this.siteUrl = siteUrl;
    this.description = description;
    this.legalEntityType = legalEntityType;
    this.currency = currency;
    this.activities = activities;
    this.rating = rating;
    this.commentsCount = commentsCount;
  }
}

export class PaginationResponseDto extends PaginationDto {
  total: number;

  constructor(total: number, limit: number, offset: number) {
    super(limit, total);
    this.total = total;
    this.limit = limit;
    this.offset = offset;
  }
}

export class GetAllProfilesResponseDto {
  @ApiProperty({
    description: 'Строки с профилями',
    type: () => ProfileResponseDto,
    isArray: true,
  })
  rows: ProfileResponseDto[];

  @ApiProperty({
    description: 'Данные пагинации',
    type: () => PaginationResponseDto,
  })
  pagination: PaginationResponseDto;

  constructor(rows: ProfileResponseDto[], pagination: PaginationResponseDto) {
    this.rows = rows;
    this.pagination = pagination;
  }
}
