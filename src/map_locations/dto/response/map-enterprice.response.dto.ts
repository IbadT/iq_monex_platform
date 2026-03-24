import { ApiProperty } from '@nestjs/swagger';
import { Decimal } from '@prisma/client/runtime/index-browser';

// Custom mock for MapLocationType
const MapLocationType = {
  OFFICE: 'OFFICE',
  WAREHOUSE: 'WAREHOUSE',
  PRODUCTION: 'PRODUCTION',
  RETAIL: 'RETAIL',
  OTHER: 'OTHER',
} as const;

type MapLocationType = typeof MapLocationType[keyof typeof MapLocationType];

// map-location-response.dto.ts
export class MapLocationResponseDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  id: string;

  @ApiProperty({ enum: MapLocationType, example: 'OFFICE' })
  // type: MapLocationType;
  type: string;

  @ApiProperty({ example: 'г. Москва, ул. Ленина, д. 1' })
  address: string;

  @ApiProperty({ example: 55.7558 })
  latitude: number;

  @ApiProperty({ example: 37.6173 })
  longitude: number;

  @ApiProperty({
    description: '',
    example: '',
    type: 'string',
  })
  userId?: string | null;

  @ApiProperty({
    description: '',
    example: '',
    type: 'string',
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
    userId?: string | null,
    listingId?: string | null,
    // user: User,
  ) {
    this.id = id;
    this.type = type;
    this.address = address;
    this.latitude = +latitude;
    this.longitude = +longitude;
    if (userId !== undefined) {
      this.userId = userId;
    }
    if (listingId !== undefined) {
      this.listingId = listingId;
    }
    // this.user = user;
  }
}
