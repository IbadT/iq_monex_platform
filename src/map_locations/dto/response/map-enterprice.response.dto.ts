import { ApiProperty } from '@nestjs/swagger';
import { Decimal } from '@prisma/client/runtime/index-browser';

// Custom mock for MapLocationType
const MapLocationType = {
  MAIN_OFFICE: 'MAIN_OFFICE',
  OFFICE: 'OFFICE',
  WAREHOUSE: 'WAREHOUSE',
  DEAL: 'DEAL',
} as const;

type MapLocationType = (typeof MapLocationType)[keyof typeof MapLocationType];

// map-location-response.dto.ts
export class MapLocationResponseDto {
  @ApiProperty({
    description: 'Уникальный идентификатор локации',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id: string;

  @ApiProperty({
    description: 'Тип локации: MAIN_OFFICE (основной офис), OFFICE (офис), WAREHOUSE (склад), DEAL (сделка)',
    enum: MapLocationType,
    example: 'OFFICE',
  })
  type: string;

  @ApiProperty({
    description: 'Полный адрес локации',
    example: 'г. Москва, ул. Ленина, д. 1',
  })
  address: string;

  @ApiProperty({
    description: 'Географическая широта',
    example: 55.7558,
  })
  latitude: number;

  @ApiProperty({
    description: 'Географическая долгота',
    example: 37.6173,
  })
  longitude: number;

  @ApiProperty({
    description: 'Страна локации',
    example: 'Россия',
  })
  country: string;

  @ApiProperty({
    description: 'Город локации',
    example: 'Москва',
  })
  city: string;

  @ApiProperty({
    description: 'ID пользователя, которому принадлежит локация',
    example: '550e8400-e29b-41d4-a716-446655440000',
    type: 'string',
    nullable: true,
  })
  userId?: string | null;

  @ApiProperty({
    description: 'ID объявления, к которому привязана локация',
    example: '550e8400-e29b-41d4-a716-446655440001',
    type: 'string',
    nullable: true,
  })
  listingId?: string | null;

  // @ApiProperty({ type: () => User })
  // user: User;

  constructor(
    id: string,
    type: MapLocationType,
    address: string,
    latitude: Decimal,
    longitude: Decimal,
    country: string,
    city: string,
    userId?: string | null,
    listingId?: string | null,
    // user: User,
  ) {
    this.id = id;
    this.type = type;
    this.address = address;
    this.latitude = +latitude;
    this.longitude = +longitude;
    this.country = country;
    this.city = city;
    if (userId !== undefined) {
      this.userId = userId;
    }
    if (listingId !== undefined) {
      this.listingId = listingId;
    }
    // this.user = user;
  }
}
