import { Decimal } from '@prisma/client/runtime/index-browser';

export class MapLocationEntity {
  id: string;

  userId: string;

  listingId: string;

  type: string; // TODO: добавить enum

  address: string;

  latitude: Decimal;

  longitude: Decimal;

  geoHash: string;

  createdAt: Date;
  updatedAt: Date;

  constructor(
    id: string,
    userId: string,
    listingId: string,
    type: string,
    address: string,
    latitude: Decimal,
    longitude: Decimal,
    geoHash: string,
    createdAt: Date,
    updatedAt: Date,
  ) {
    this.id = id;
    this.userId = userId;
    this.listingId = listingId;
    this.type = type;
    this.address = address;
    this.latitude = latitude;
    this.longitude = longitude;
    this.geoHash = geoHash;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
