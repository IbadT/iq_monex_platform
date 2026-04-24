import { ApiProperty } from '@nestjs/swagger';

export class UserProfileDto {
  @ApiProperty({
    description: 'UUID профиля',
    example: 'profile-uuid-123',
    type: 'string',
    format: 'uuid',
  })
  id: string;

  @ApiProperty({
    description: 'UUID пользователя',
    example: 'bcea00ce-0a3b-4063-9289-1fd63662cbd3',
    type: 'string',
    format: 'uuid',
  })
  userId: string;

  @ApiProperty({
    description: 'Тип юридического лица',
    example: 1,
    type: 'integer',
  })
  legalEntityTypeId: number;

  @ApiProperty({
    description: 'ID валюты',
    example: 1,
    type: 'integer',
  })
  currencyId: number;

  @ApiProperty({
    description: 'URL аватара',
    example: 'https://example.com/avatar.jpg',
    type: 'string',
  })
  avatarUrl: string | null;

  @ApiProperty({
    description: 'Телефон',
    example: '+77001234567',
    type: 'string',
  })
  phone: string | null;

  @ApiProperty({
    description: 'Email',
    example: 'info@company.com',
    type: 'string',
  })
  email: string | null;

  @ApiProperty({
    description: 'Сайт',
    example: 'https://company.com',
    type: 'string',
  })
  siteUrl: string | null;

  @ApiProperty({
    description: 'Описание профиля',
    example: 'Строительная компания с 10-летним опытом',
    type: 'string',
  })
  description: string | null;

  @ApiProperty({
    description: 'Номер счета',
    example: 'ACC-123456',
    type: 'string',
  })
  accountNumber: string;

  @ApiProperty({
    description: 'Количество офисов',
    example: 3,
    type: 'integer',
  })
  officesCount: number;

  @ApiProperty({
    description: 'Количество складов',
    example: 2,
    type: 'integer',
  })
  warehousesCount: number;

  @ApiProperty({
    description: 'Количество сотрудников',
    example: 15,
    type: 'integer',
  })
  workersCount: number;

  @ApiProperty({
    description: 'Количество опубликованных объявлений',
    example: 25,
    type: 'integer',
  })
  listingsCount: number;

  @ApiProperty({
    description: 'Фотографии галереи',
    type: [String],
    example: ['https://example.com/photo1.jpg', 'https://example.com/photo2.jpg'],
  })
  photos: string[];

  constructor(
    id: string,
    userId: string,
    legalEntityTypeId: number,
    currencyId: number,
    avatarUrl: string | null,
    phone: string | null,
    email: string | null,
    siteUrl: string | null,
    description: string | null,
    accountNumber: string,
    officesCount: number,
    warehousesCount: number,
    workersCount: number,
    listingsCount: number,
    photos: string[],
  ) {
    this.id = id;
    this.userId = userId;
    this.legalEntityTypeId = legalEntityTypeId;
    this.currencyId = currencyId;
    this.avatarUrl = avatarUrl;
    this.phone = phone;
    this.email = email;
    this.siteUrl = siteUrl;
    this.description = description;
    this.accountNumber = accountNumber;
    this.officesCount = officesCount;
    this.warehousesCount = warehousesCount;
    this.workersCount = workersCount;
    this.listingsCount = listingsCount;
    this.photos = photos;
  }
}

export class ActivityDto {
  @ApiProperty({
    description: 'ID активности',
    example: 1,
    type: 'integer',
  })
  id: number;

  @ApiProperty({
    description: 'Название активности',
    example: 'Строительство',
    type: 'string',
  })
  name: string;

  constructor(id: number, name: string) {
    this.id = id;
    this.name = name;
  }
}

export class UserDto {
  @ApiProperty({
    description: 'UUID пользователя',
    example: 'bcea00ce-0a3b-4063-9289-1fd63662cbd3',
    type: 'string',
    format: 'uuid',
  })
  id: string;

  @ApiProperty({
    description: 'Имя пользователя',
    example: 'Иван Иванов',
    type: 'string',
  })
  name: string;

  @ApiProperty({
    description: 'Рейтинг пользователя',
    example: 4.5,
    type: 'number',
  })
  rating: number | null;

  @ApiProperty({
    description: 'Количество отзывов',
    example: 12,
    type: 'integer',
  })
  reviewsCount: number;

  @ApiProperty({
    description: 'Профиль пользователя',
    type: () => UserProfileDto,
  })
  profile: UserProfileDto | null;

  @ApiProperty({
    description: 'Активности пользователя',
    type: [ActivityDto],
  })
  activities: ActivityDto[];

  @ApiProperty({
    description:
      'Добавлен ли пользователь в избранное (всегда true для этого списка)',
    example: true,
    type: 'boolean',
  })
  isFavorite: boolean;

  @ApiProperty({
    description: 'Город',
    example: 'Алматы',
    type: 'string',
  })
  city: string | null;

  @ApiProperty({
    description: 'Страна',
    example: 'Казахстан',
    type: 'string',
  })
  country: string | null;

  constructor(
    id: string,
    name: string,
    rating: number | null,
    reviewsCount: number,
    profile: UserProfileDto | null,
    activities: ActivityDto[],
    isFavorite: boolean,
    city: string | null,
    country: string | null,
  ) {
    this.id = id;
    this.name = name;
    this.rating = rating;
    this.reviewsCount = reviewsCount;
    this.profile = profile;
    this.activities = activities;
    this.isFavorite = isFavorite;
    this.city = city;
    this.country = country;
  }
}

export class FavoriteUserProfileResponseDto {
  @ApiProperty({
    description: 'UUID записи в избранном',
    example: '885eb360-9337-4f7c-923c-2180fb886634',
    type: 'string',
    format: 'uuid',
  })
  id: string;

  @ApiProperty({
    description: 'UUID пользователя',
    example: 'bcea00ce-0a3b-4063-9289-1fd63662cbd3',
    type: 'string',
    format: 'uuid',
  })
  userId: string;

  @ApiProperty({
    description: 'Тип избранного',
    example: 'USER',
    type: 'string',
    enum: ['LISTING', 'USER'],
  })
  type: string;

  @ApiProperty({
    description: 'UUID целевого пользователя',
    example: 'target-user-uuid-123',
    type: 'string',
    format: 'uuid',
  })
  targetUserId: string;

  @ApiProperty({
    description: 'Дата создания записи',
    example: '2026-03-22T15:52:13.768Z',
    type: 'string',
    format: 'date-time',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Информация о пользователе',
    type: () => UserDto,
  })
  user: UserDto;

  constructor(
    id: string,
    userId: string,
    type: string,
    targetUserId: string,
    createdAt: Date,
    user: UserDto,
  ) {
    this.id = id;
    this.userId = userId;
    this.type = type;
    this.targetUserId = targetUserId;
    this.createdAt = createdAt;
    this.user = user;
  }
}
