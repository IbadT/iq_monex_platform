import { MapLocationType } from '@/listings/dto/request/create-map-location.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  Max,
  Min,
} from 'class-validator';

export class EnterpriceQueryDto {
  @ApiProperty({
    description: 'Радиус поиска в километрах от центра населённого пункта',
    example: 50,
    required: true,
    default: 50,
    minimum: 20,
    maximum: 100,
    type: Number,
  })
  @IsNumber()
  @Min(20)
  @Max(100)
  @Type(() => Number)
  radius: number;

  @ApiProperty({
    description: 'Широта центральной точки для поиска по геохешу',
    example: 55.7558,
    required: false,
    type: Number,
  })
  @IsNumber()
  @Type(() => Number)
  latitude: number;

  @ApiProperty({
    description: 'Долгота центральной точки для поиска по геохешу',
    example: 37.6173,
    required: false,
    type: Number,
  })
  @IsNumber()
  @Type(() => Number)
  longitude: number;

  @ApiProperty({
    description:
      'Типы локаций для фильтрации. Можно выбрать несколько значений',
    enum: MapLocationType,
    isArray: true,
    example: [MapLocationType.OFFICE, MapLocationType.WAREHOUSE],
    required: true,
  })
  @IsArray()
  @IsEnum(MapLocationType, { each: true })
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      // Поддерживаем форматы: "OFFICE,WAREHOUSE" или ["OFFICE","WAREHOUSE"]
      return value.includes(',')
        ? value.split(',').map((type) => type.trim())
        : [value];
    }
    return value;
  })
  filter: MapLocationType[];

  @ApiProperty({
    description:
      'ID активностей для фильтрации. Можно указать несколько ID через запятую или как массив',
    example: [1, 5, 10],
    required: false,
    type: [Number],
  })
  @IsArray()
  @IsOptional()
  @IsNumber({}, { each: true })
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      // Поддерживаем форматы: "1,5,10" или [1,5,10]
      return value.includes(',')
        ? value.split(',').map((id) => parseInt(id.trim()))
        : [parseInt(value)];
    }
    return value || [];
  })
  activityIds: number[];

  @ApiProperty({
    description: 'Показывать только пользователей с рейтингом выше 4 звёзд',
    example: false,
    required: true,
    default: false,
    type: Boolean,
  })
  // @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  rating: boolean;

  constructor(
    radius: number,
    latitude: number,
    longitude: number,
    filter: MapLocationType[],
    rating: boolean,
    activityIds?: number[],
  ) {
    this.radius = radius;
    this.latitude = latitude;
    this.longitude = longitude;
    this.filter = filter;
    this.activityIds = activityIds || [];
    this.rating = rating; // Используем значение по умолчанию false
  }
}
