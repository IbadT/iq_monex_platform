import {
  IsOptional,
  IsString,
  IsNumber,
  IsEnum,
  IsArray,
  ArrayMaxSize,
  ArrayMinSize,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { CreateMapLocationDto } from './create-map-location.dto';
import { CreateListingSpecificationDto } from './create-listing-specification.dto';
import {
  ListingCondition,
  ListingStatus,
} from '../../enums/listing-status.enum';
import { ConditionalRequired } from '../../decorators/conditional-required.decorator';
import { ListingContactDto } from './listing-contact.dto';

export class CreateListingDto {
  @ApiProperty({
    description: 'ID категории объявления',
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  categoryId?: number;

  @ApiProperty({
    description: 'ID подкатегории объявления',
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  subcategoryId?: number;

  @ApiProperty({
    description: 'ID под-подкатегории объявления',
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  subsubcategoryId?: number;

  @ApiProperty({
    description: 'Заголовок объявления',
    example: 'iPhone 13 Pro Max',
    required: false,
  })
  @IsOptional()
  @ConditionalRequired([ListingStatus.PUBLISHED])
  @IsString()
  title?: string;

  @ApiProperty({
    description: 'Описание объявления',
    example: 'Отличное состояние, использовался 6 месяцев',
    required: false,
  })
  @IsOptional()
  @ConditionalRequired([ListingStatus.PUBLISHED])
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Цена объявления',
    example: 85000,
    required: false,
  })
  @IsOptional()
  @ConditionalRequired([ListingStatus.PUBLISHED])
  @Type(() => Number)
  price?: number;

  @ApiProperty({
    description: 'ID валюты',
    example: 1,
    required: false,
  })
  @IsOptional()
  @ConditionalRequired([ListingStatus.PUBLISHED])
  @IsNumber()
  currencyId?: number;

  @ApiProperty({
    description: 'ID единицы измерения цены',
    example: 1,
    required: false,
  })
  @IsOptional()
  @ConditionalRequired([ListingStatus.PUBLISHED])
  @IsNumber()
  priceUnitId?: number;

  @ApiProperty({
    description: 'Состояние товара',
    example: ListingCondition.USED,
    enum: ListingCondition,
    required: false,
  })
  @IsOptional()
  @ConditionalRequired([ListingStatus.PUBLISHED])
  @IsEnum(ListingCondition)
  condition?: ListingCondition;

  @ApiProperty({
    description: 'Статус объявления',
    example: ListingStatus.TEMPLATE,
    enum: ListingStatus,
    required: true,
  })
  @IsEnum(ListingStatus)
  status: ListingStatus; // ← Обязательное поле

  // Файлы (документы)
  @ApiProperty({
    description: 'Массив base64 строк для документов (макс. 5)',
    example: ['data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ...'],
    required: false,
    isArray: true,
    maxItems: 5,
  })
  @IsOptional()
  @ConditionalRequired([ListingStatus.PUBLISHED])
  @IsArray()
  @IsString({ each: true })
  @ArrayMaxSize(5)
  files?: string[]; // Массив base64 строк для документов (макс. 5)

  // Фото (изображения)
  @ApiProperty({
    description: 'Массив base64 строк для изображений (макс. 10)',
    example: ['data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ...'],
    required: false,
    isArray: true,
    maxItems: 10,
  })
  @IsOptional()
  @ConditionalRequired([ListingStatus.PUBLISHED])
  @IsArray()
  @IsString({ each: true })
  @ArrayMaxSize(10)
  photos?: string[]; // Массив base64 строк для изображений (макс. 10)

  // Характеристики (спецификации)
  @ApiProperty({
    description: 'Массив характеристик объявления (минимум 5, максимум 10)',
    example: [
      { specificationId: 1, value: 'Белый' },
      { specificationId: 2, value: '128 ГБ' },
    ],
    required: false,
    isArray: true,
    type: [CreateListingSpecificationDto],
  })
  @IsOptional()
  @IsArray()
  @ArrayMinSize(5)
  @ArrayMaxSize(10)
  @ValidateNested({ each: true })
  @Type(() => CreateListingSpecificationDto)
  specifications?: CreateListingSpecificationDto[];

  // Геолокация
  @ApiProperty({
    description: 'Массив геолокаций объявления',
    example: [
      {
        latitude: 55.7558,
        longitude: 37.6173,
        address: 'г. Алматы, ул. Абая 123',
        city: "Москва",
        country: "Россия"
      },
    ],
    required: false,
    type: [CreateMapLocationDto],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateMapLocationDto)
  maps?: CreateMapLocationDto[];

  @ApiProperty({
    description: "Контакты объявления",
    type: ListingContactDto,
    required: false,
    nullable: true,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => ListingContactDto)
  contacts?: ListingContactDto | null;

  constructor(
    status: ListingStatus,
    categoryId: number,
    subcategoryId: number,
    subsubcategoryId: number,
    contacts: ListingContactDto | null,
    title?: string,
    description?: string,
    price?: number,
    currencyId?: number,
    priceUnitId?: number,
    condition?: ListingCondition,
    files?: string[],
    photos?: string[],
    maps?: CreateMapLocationDto[],
    specifications?: CreateListingSpecificationDto[],
  ) {
    this.status = status; // ← Обязательное поле
    this.categoryId = categoryId;
    this.subcategoryId = subcategoryId;
    this.subsubcategoryId = subsubcategoryId;
    this.contacts = contacts;
    if (title !== undefined) {
      this.title = title;
    }
    if (description !== undefined) {
      this.description = description;
    }
    if (price !== undefined) {
      this.price = price;
    }
    if (currencyId !== undefined) {
      this.currencyId = currencyId;
    }
    if (priceUnitId !== undefined) {
      this.priceUnitId = priceUnitId;
    }
    if (condition !== undefined) {
      this.condition = condition;
    }
    if (files !== undefined) {
      this.files = files;
    }
    if (photos !== undefined) {
      this.photos = photos;
    }
    if (maps !== undefined) {
      this.maps = maps;
    }
    if (specifications !== undefined) {
      this.specifications = specifications;
    }
  }
}