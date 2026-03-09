import {
  IsOptional,
  IsString,
  IsNumber,
  IsEnum,
  IsArray,
  ArrayMaxSize,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateMapLocationDto } from './create-map-location.dto';
import { ListingStatus } from '../../enums/listing-status.enum';
import { ConditionalRequired } from '../../decorators/conditional-required.decorator';

// Enum для состояния
enum ListingCondition {
  NEW = 'NEW',
  USED = 'USED',
}

export class CreateListingDto {
  @IsNumber()
  categoryId: number;

  @ConditionalRequired([ListingStatus.PUBLISHED])
  @IsString()
  title?: string;

  @ConditionalRequired([ListingStatus.PUBLISHED])
  @IsString()
  description?: string;

  @ConditionalRequired([ListingStatus.PUBLISHED])
  @Type(() => Number)
  price?: number;

  @ConditionalRequired([ListingStatus.PUBLISHED])
  @IsNumber()
  currencyId?: number;

  @ConditionalRequired([ListingStatus.PUBLISHED])
  @IsNumber()
  priceUnitId?: number;

  @ConditionalRequired([ListingStatus.PUBLISHED])
  @IsEnum(ListingCondition)
  condition?: ListingCondition;

  @IsOptional()
  @IsEnum(ListingStatus)
  status?: ListingStatus;

  // Файлы (документы)
  @ConditionalRequired([ListingStatus.PUBLISHED])
  @IsArray()
  @IsString({ each: true })
  @ArrayMaxSize(5)
  files?: string[]; // Массив base64 строк для документов (макс. 5)

  // Фото (изображения)
  @ConditionalRequired([ListingStatus.PUBLISHED])
  @IsArray()
  @IsString({ each: true })
  @ArrayMaxSize(10)
  photos?: string[]; // Массив base64 строк для изображений (макс. 10)

  // Геолокация
  @IsOptional()
  map?: CreateMapLocationDto;

  constructor(
    categoryId: number,
    title?: string,
    description?: string,
    price?: number,
    currencyId?: number,
    priceUnitId?: number,
    condition?: ListingCondition,
    status?: ListingStatus,
    files?: string[],
    photos?: string[],
    map?: CreateMapLocationDto,
  ) {
    this.categoryId = categoryId;

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
    if (status !== undefined) {
      this.status = status;
    }
    if (files !== undefined) {
      this.files = files;
    }
    if (photos !== undefined) {
      this.photos = photos;
    }
    if (map !== undefined) {
      this.map = map;
    }
  }
}
