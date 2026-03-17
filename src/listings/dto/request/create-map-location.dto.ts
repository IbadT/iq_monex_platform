import { IsDecimal, IsEnum } from 'class-validator';

export enum MapLocationType {
  OFFICE = 'OFFICE',
  WAREHOUSE = 'WAREHOUSE',
  OTHER = 'OTHER',
}

export class CreateMapLocationDto {
  @IsEnum(MapLocationType, {
    message: 'Неверный тип помещения',
  })
  type: MapLocationType;

  @IsDecimal()
  latitude: number;

  @IsDecimal()
  longtitude: number;

  constructor(type: MapLocationType, latitude: number, longtitude: number) {
    this.type = type;
    this.latitude = latitude;
    this.longtitude = longtitude;
  }
}
