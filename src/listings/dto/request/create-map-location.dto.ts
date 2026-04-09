import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsOptional,
  IsNotEmpty,
  IsString,
  IsUUID,
  ValidateIf,
  IsNumber,
} from 'class-validator';

export enum MapLocationType {
  OFFICE = 'OFFICE',
  WAREHOUSE = 'WAREHOUSE',
}

export enum LocationAction {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  IGNORE = 'IGNORE',
  DELETE = 'DELETE',
}

export class CreateMapLocationDto {
  @ApiPropertyOptional({
    description:
      'ID локации (если указан, то обновляется или существующая локация уже есть в системе, если нет - создается новая)',
    example: 123,
    required: false,
  })
  @ValidateIf(
    (object: CreateMapLocationDto) =>
      object.action === LocationAction.UPDATE ||
      object.action === LocationAction.DELETE,
  )
  @IsOptional()
  @IsNotEmpty({ message: 'ID локации не должен быть пустым' })
  @IsUUID()
  id: string | null;

  @ApiProperty({
    description: 'Тип помещения',
    enum: MapLocationType,
    example: MapLocationType.OFFICE,
    required: true,
  })
  @IsEnum(MapLocationType, {
    message: 'Неверный тип помещения',
  })
  type: MapLocationType;

  @ApiProperty({
    description: 'Широта',
    example: 55.7558,
    required: true,
  })
  @IsNumber()
  latitude: number;

  @ApiProperty({
    description: 'Долгота',
    example: 37.6173,
    required: true,
  })
  @IsNumber()
  longitude: number;

  @ApiProperty({
    description: 'Адрес локации',
    example: 'г. Москва, ул. Тверская, д. 1',
    required: true,
  })
  @IsString({ message: 'Адрес должен быть строкой' })
  @IsNotEmpty({ message: 'Адрес обязателен' })
  address: string;

  @ApiProperty({
    description: "Страна",
    example: "Россия",
    required: true,
  })
  @IsString({ message: "Страна должна быть строкой" })
  @IsNotEmpty({ message: "Страна обязательна" })
  country: string;

  @ApiProperty({
    description: "Город",
    example: "Москва",
    required: true,
  })
  @IsString({ message: "Город должен быть строкой" })
  @IsNotEmpty({ message: "Город обязателен" })
  city: string;

  @ApiPropertyOptional({
    description:
      'Действие с локацией (CREATE - создать новую, UPDATE - обновить существующую, IGNORE - не трогать)',
    enum: LocationAction,
    example: LocationAction.CREATE,
    required: false,
  })
  @IsOptional()
  @IsEnum(LocationAction, {
    message: 'Неверное действие с локацией',
  })
  action?: LocationAction;

  constructor(
    id: string | null,
    type: MapLocationType,
    latitude: number,
    longitude: number,
    address: string,
    country: string,
    city: string,
    action?: LocationAction,
  ) {
    this.id = id;
    this.type = type;
    this.latitude = latitude;
    this.longitude = longitude;
    this.address = address;
    this.country = country;
    this.city = city;
    this.action = action || LocationAction.CREATE;
  }
}
