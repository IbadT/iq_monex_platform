// src/search/interfaces/listing.search.interface.ts

export interface IListingSearchBody {
  id: string;
  title: string;
  content: string;
  authorId: string;
  createdAt?: Date;
  updatedAt?: Date;
  price?: number;
  subcategoryId?: string;
  location?: {
    lat: number;
    lon: number;
  };
  tags?: string[];
  status: 'active' | 'inactive' | 'deleted';
  contacts?: {
    id: string;
    phone: string | null;
    email: string | null;
    type: string;
  } | null;
}

export interface IListingSearchResult {
  _index: string;
  _id: string;
  _score: number;
  _source: IListingSearchBody;
}

export interface IListingSearchResponse {
  hits: {
    total: {
      value: number;
      relation: 'eq' | 'gte';
    };
    max_score: number | null; // Только number | null, без undefined
    hits: IListingSearchResult[];
  };
  took: number;
  timed_out: boolean;
}

export interface ISearchListingsParams {
  text?: string;
  subcategoryId?: string;
  authorId: string;
  status?: IListingSearchBody['status'];
  minPrice?: number;
  maxPrice?: number;
  location?: {
    lat: number;
    lon: number;
    distance: string;
  };
  tags?: string[];
  sort?: Array<{
    field: keyof IListingSearchBody | '_score';
    order: 'asc' | 'desc';
  }>;
  pagination?: {
    from: number;
    size: number;
  };
}
