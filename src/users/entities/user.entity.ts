import { ApiProperty } from '@nestjs/swagger';

export interface LegalEntityType {
  id: number;
  data: any; // JSON с мультиязычными данными
  createdAt: Date;
  updatedAt: Date;
}

export interface Currency {
  id: number;
  symbol: string;
  code: string;
  name: any; // JSON с мультиязычными данными
}

export interface Review {
  id: string;
  rating: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Profile {
  id: string;
  userId: string;
  legalEntityTypeId: number;
  currencyId: number;
  avatarUrl: string | null;
  phone: string | null;
  email: string | null;
  telegram: string | null;
  siteUrl: string | null;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
  legalEntityType: LegalEntityType;
  currency: Currency;
}

export class User {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'User ID',
  })
  id: string;

  @ApiProperty({ example: 'user@example.com', description: 'User email' })
  email: string;

  @ApiProperty({ example: 'John Doe', description: 'User name' })
  name: string;

  @ApiProperty({ example: '12345678', description: 'User account number' })
  accountNumber: string;

  @ApiProperty({
    example: false,
    description: 'Whether user email is verified',
    default: false,
  })
  isVerified: boolean;

  @ApiProperty({
    example: 4.5,
    description: 'User average rating',
    default: 0,
  })
  rating: number;

  @ApiProperty({
    example: 10,
    description: 'Number of reviews',
    default: 0,
  })
  reviewsCount: number;

  @ApiProperty({
    description: 'User profile data',
  })
  profile: Profile | null;

  @ApiProperty({
    description: 'User workers',
  })
  workers: any[] | null;

  @ApiProperty({
    description: 'User activities',
  })
  userActivities: any[] | null;

  @ApiProperty({
    description: 'User locations',
  })
  locations: any[] | null;

  @ApiProperty({
    description: 'User received reviews',
  })
  receivedReviews: Review[] | null;


  @ApiProperty({
    description: 'User favorites',
  })
  favorites: any[] | null;

  @ApiProperty({
    description: 'ID которых добавил этот пользователь',
  })
  favoritedBy: any[] | null;

  @ApiProperty({
    example: '2022-01-01T00:00:00.000Z',
    description: 'User creation date',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2022-01-01T00:00:00.000Z',
    description: 'User update date',
  })
  updatedAt: Date;

  constructor(
    id: string,
    email: string,
    name: string,
    accountNumber: string,
    isVerified: boolean,
    rating: number,
    reviewsCount: number,
    createdAt: Date,
    updatedAt: Date,
    profile: Profile | null,
    workers: any[] | null,
    userActivities: any[] | null,
    locations: any[] | null,
    receivedReviews: Review[] | null,
    favorites: any[] | null,
    favoritedBy: any[] | null,
  ) {
    this.id = id;
    this.email = email;
    this.name = name;
    this.accountNumber = accountNumber;
    this.isVerified = isVerified || false;
    this.rating = rating;
    this.reviewsCount = reviewsCount;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.profile = profile;
    this.workers = workers;
    this.userActivities = userActivities;
    this.locations = locations;
    this.receivedReviews = receivedReviews;
    this.favorites = favorites;
    this.favoritedBy = favoritedBy;
  }

  static fromUpdateUserDto(user: any, profileData: Profile | null): User {
    const profile = profileData ? {
      id: user.profile.id,
      userId: user.profile.userId,
      legalEntityTypeId: profileData.legalEntityTypeId,
      currencyId: profileData.currencyId,
      avatarUrl: profileData.avatarUrl,
      phone: profileData.phone,
      email: profileData.email,
      telegram: profileData.telegram,
      siteUrl: profileData.siteUrl,
      description: profileData.description,
      createdAt: user.profile.createdAt,
      updatedAt: user.profile.updatedAt,
      legalEntityType: user.profile.legalEntityType,
      currency: user.profile.currency,
    } : null;

    return new User(
      user.id,
      user.email,
      user.name,
      user.accountNumber,
      user.isVerified,
      user.rating,
      user.reviewsCount,
      user.createdAt,
      user.updatedAt,
      profile,
      user.workers,
      user.userActivities,
      user.locations,
      user.receivedReviews,
      user.favorites,
      user.favoritedBy,
    );
  }
}
