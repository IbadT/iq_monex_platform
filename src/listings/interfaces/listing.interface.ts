import { ListingCondition, ListingStatus } from '../enums/listing-status.enum';

export interface IListing {
  subcategoryId?: number;
  title?: string;
  description?: string;
  price?: number;
  currencyId?: number;
  priceUnitId?: number;
  condition?: ListingCondition;
  status: ListingStatus;
}
