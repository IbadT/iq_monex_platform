export interface ListingDocument {
  id: string;
  title: string | null;
  description: string | null;
  price: number | null;
  status: string;
  userId: string;
  categoryId: number | null;
  subcategoryId: number | null;
  subsubcategoryId: number | null;
  currencyId: number | null;
  priceUnitId: number | null;
  condition: string | null;
  createdAt: Date;
  updatedAt: Date;
  rating: number | null;
  reviewsCount: number;
  viewsCount: number;
  favoritesCount: number;
  likesCount: number;
  version: number;
  publishedAt: Date | null;
  archivedAt: Date | null;
  autoDeleteAt: Date | null;
  lastUsedAt: Date | null;
  // Связанные данные - как в Prisma
  category: {
    id: number;
    name: string;
    parentId: number | null;
  } | null;
  currency: {
    id: number;
    name: any;
    code: string;
    symbol: string;
  } | null;
  priceUnit: {
    id: number;
    name: any;
  } | null;
  locations?: Array<{
    id: string;
    createdAt: Date;
    updatedAt: Date;
    listingId: string;
    type: string;
    latitude: number;
    longitude: number;
    geoHash: string | null;
  }>;
  specifications?: Array<{
    id: string;
    listingId: string;
    specificationId: number;
    value: string;
    unitId: number | null;
    isRequired: boolean;
  }>;
  contacts?: {
    id: string;
    phone: string | null;
    email: string | null;
    type: string;
  } | null;
}
