import { SpecificationResponseDto } from '@/attributes/dto/response/specification.dto';
import { CategoryResponseDto } from '@/categories/dto/response/categories-response.dto';
import { CurrenciesResponseDto } from '@/dictionaries/dto/response/currencies-response.dto';
import { MapLocationResponseDto } from '@/map_locations/dto/response/map-enterprice.response.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Decimal } from '@prisma/client/runtime/index-browser';

export class ListingResposeDto {
  @ApiProperty({
    description: 'UUID объявления',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: 'string',
    format: 'uuid',
  })
  id: string;

  @ApiProperty({
    description: 'ID категории',
    example: 1,
    type: 'integer',
  })
  categoryId: number;

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
    description: 'Количество добавлений в избранное',
    example: 25,
    type: 'integer',
  })
  favoritesCount: number;

  @ApiProperty({
    description: 'Описание категории',
    type: () => CategoryResponseDto,
  })
  category: CategoryResponseDto;

  @ApiProperty({
    description: 'Описание валюты',
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
    description: '',
    example: '',
    type: 'string',
  })
  files: any[];

  @ApiProperty({
    description: '',
    example: '',
    type: 'string',
  })
  images: any[];

  @ApiProperty({
    description: 'Описание локаций',
    type: () => [MapLocationResponseDto],
  })
  locations: MapLocationResponseDto[];

  @ApiProperty({
    description: 'Описание спецификации',
    type: () => [SpecificationResponseDto],
  })
  specifications: SpecificationResponseDto[];

  constructor(
    id: string,
    categoryId: number,
    title: string | null,
    description: string | null,
    price: Decimal | null,
    condition: string | null,
    status: string,
    viewsCount: number,
    favoritesCount: number,
    category: CategoryResponseDto,
    currency: CurrenciesResponseDto | null,
    priceUnit: any,
    files: any[],
    images: any[],
    locations: MapLocationResponseDto[],
    specifications: SpecificationResponseDto[],
  ) {
    this.id = id;
    this.categoryId = categoryId;
    this.title = title;
    this.description = description;
    this.price = price;
    this.condition = condition;
    this.status = status;
    this.viewsCount = viewsCount;
    this.favoritesCount = favoritesCount;
    this.category = category;
    this.currency = currency;
    ((this.priceUnit = priceUnit),
      (this.files = files),
      (this.images = images));
    this.locations = locations;
    this.specifications = specifications;
  }
}
