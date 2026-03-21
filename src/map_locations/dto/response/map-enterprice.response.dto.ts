import { User } from '@/users/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';
import { MapLocationType } from '@/listings/dto/request/create-map-location.dto';

// map-location-response.dto.ts
export class MapLocationResponseDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  id: string;

  @ApiProperty({ enum: MapLocationType, example: 'OFFICE' })
  type: MapLocationType;

  @ApiProperty({ example: 'г. Москва, ул. Ленина, д. 1' })
  address: string;

  @ApiProperty({ example: 55.7558 })
  latitude: number;

  @ApiProperty({ example: 37.6173 })
  longitude: number;

  @ApiProperty({ type: () => User })
  user: User;

  constructor(
    id: string,
    type: MapLocationType,
    address: string,
    latitude: number,
    longitude: number,
    user: User,
  ) {
    this.id = id;
    this.type = type;
    this.address = address;
    this.latitude = latitude;
    this.longitude = longitude;
    this.user = user;
  }
}
