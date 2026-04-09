import { ListingCondition, ListingStatus } from '../enums/listing-status.enum';

export interface IListing {
  categoryId?: number | null;
  subcategoryId?: number | null;
  subsubcategoryId?: number | null;
  title?: string;
  description?: string;
  price?: number;
  currencyId?: number;
  priceUnitId?: number;
  condition?: ListingCondition;
  status: ListingStatus;
  contacts?: {
    id: string;
    type: string;
  } | null;
}
