import { ListingSpecificationResponseDto } from './listing-specification-response.dto';
import { CategoryResponseDto } from '@/categories/dto/response/categories-response.dto';
import { CurrenciesResponseDto } from '@/dictionaries/dto/response/currencies-response.dto';
import { MapLocationResponseDto } from '@/map_locations/dto/response/map-enterprice.response.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Decimal } from '@prisma/client/runtime/index-browser';
import { UserListingResponseDto } from './user-listing-response.dto';
import { ListingFileResponseDto } from './listing-file-response.dto';
import { ListingContactResponseDto } from './listing-contact-response.dto';
import { ListingSubscriptionResponseDto } from './listing-subscription-response.dto';

export class ListingResposeDto {
  @ApiProperty({
    description: 'UUID объявления',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: 'string',
    format: 'uuid',
  })
  id: string;


  @ApiProperty({
    description: 'Заголовок объявления',
    example: 'iPhone 13 Pro Max',
    type: 'string',
  })
  title: string | null;

  @ApiProperty({
    description: 'Описание объявления',
    example: 'Отличное состояние, использовался 6 месяцев',
    type: 'string',
  })
  description: string | null;

  @ApiProperty({
    description: 'Цена объявления',
    example: 8500,
    type: 'number',
  })
  price: Decimal | null;

  @ApiProperty({
    description: 'Состояние товара',
    example: 'NEW',
    enum: ['NEW', 'USED'],
    type: 'string',
  })
  condition: string | null;

  @ApiProperty({
    description: 'Статус объявления',
    example: 'PUBLISHED',
    enum: ['DRAFT', 'PUBLISHED', 'TEMPLATE', 'ARCHIVED'],
    type: 'string',
  })
  status: string;

  @ApiProperty({
    description: 'Количество просмотров',
    example: 200,
    type: 'integer',
  })
  viewsCount: number;

  @ApiProperty({
    description: 'Рейтинг объявления',
    example: 5,
    minimum: 0,
    maximum: 5,
    type: 'integer',
  })
  rating: number;

  @ApiProperty({
    description: 'Количество комментариев',
    example: 12,
    type: 'integer',
  })
  commentsCount: number;

  @ApiProperty({
    description: 'Количество добавлений в избранное',
    example: 25,
    type: 'integer',
  })
  favoritesCount: number;

  @ApiProperty({
    description: 'Добавлено ли объявление в избранное текущим пользователем',
    example: false,
    type: 'boolean',
  })
  isFavorite: boolean;

  @ApiProperty({
    description: 'Данные категории',
    type: () => CategoryResponseDto,
    nullable: true,
  })
  category: CategoryResponseDto | null;

  @ApiProperty({
    description: 'Данные подкатегории',
    type: () => CategoryResponseDto,
    nullable: true,
  })
  subcategory: CategoryResponseDto | null;

  @ApiProperty({
    description: 'Данные под-подкатегории',
    type: () => CategoryResponseDto,
    nullable: true,
  })
  subsubcategory: CategoryResponseDto | null;

  @ApiProperty({
    description: 'Данные валюты',
    type: () => CurrenciesResponseDto,
  })
  currency: CurrenciesResponseDto | null;

  @ApiProperty({
    description: '',
    example: '',
    type: 'string',
  })
  priceUnit: any;

  @ApiProperty({
    description: 'Файлы для объявления',
    type: () => ListingFileResponseDto,
    isArray: true,
  })
  files: ListingFileResponseDto[];

  @ApiProperty({
    description: 'Картинки объявления',
    type: () => ListingFileResponseDto,
    isArray: true,
  })
  images: ListingFileResponseDto[];

  @ApiProperty({
    description: 'Описание локаций',
    type: () => [MapLocationResponseDto],
  })
  locations: MapLocationResponseDto[];

  @ApiProperty({
    description: 'Характеристики объявления',
    type: () => [ListingSpecificationResponseDto],
  })
  specifications: ListingSpecificationResponseDto[];

  @ApiProperty({
    description: 'Данные пользователя',
    type: () => UserListingResponseDto,
  })
  user: UserListingResponseDto;

  @ApiProperty({
    description: 'Контактные данные для объявления',
    type: () => ListingContactResponseDto,
    required: true,
    nullable: true,
  })
  contacts: ListingContactResponseDto | null;

  @ApiProperty({
    description: 'Информация о подписке пользователя',
    type: () => ListingSubscriptionResponseDto,
  })
  subscription: ListingSubscriptionResponseDto;

  constructor(
    id: string,
    title: string | null,
    description: string | null,
    price: Decimal | null,
    condition: string | null,
    status: string,
    rating: number,
    commentsCount: number,
    viewsCount: number,
    favoritesCount: number,
    category: CategoryResponseDto | null,
    subcategory: CategoryResponseDto | null,
    subsubcategory: CategoryResponseDto | null,
    currency: CurrenciesResponseDto | null,
    priceUnit: any,
    files: ListingFileResponseDto[],
    images: ListingFileResponseDto[],
    locations: MapLocationResponseDto[],
    specifications: ListingSpecificationResponseDto[],
    user: UserListingResponseDto,
    contacts: ListingContactResponseDto | null,
    subscription: ListingSubscriptionResponseDto,
    isFavorite: boolean,
  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.price = price;
    this.condition = condition;
    this.status = status;
    this.rating = rating;
    this.commentsCount = commentsCount;
    this.viewsCount = viewsCount;
    this.favoritesCount = favoritesCount;
    this.isFavorite = isFavorite;
    this.category = category;
    this.subcategory = subcategory;
    this.subsubcategory = subsubcategory;
    this.currency = currency;
    this.subscription = subscription;
    ((this.priceUnit = priceUnit),
      (this.files = files),
      (this.images = images));
    this.locations = locations;
    this.specifications = specifications;
    this.user = user;
    this.contacts = contacts;
  }
}
