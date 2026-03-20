import {
  ListingCondition,
  ListingStatus,
  FILE_KIND,
} from '../enums/listing-status.enum';
import { FileEntity } from './file.entity';

// Интерфейс для данных из Prisma
export interface PrismaListing {
  id: string;
  userId: string;
  categoryId: number;
  rating: number | null; // Float в Prisma
  reviewsCount: number;
  title: string | null;
  description: string | null;
  status: ListingStatus;
  price: number | null;
  currencyId: number | null;
  priceUnitId: number | null;
  condition: ListingCondition | null;
  viewsCount: number;
  favoritesCount: number;
  likesCount: number;
  version: number;
  publishedAt: Date | null;
  archivedAt: Date | null;
  autoDeleteAt: Date | null;
  lastUsedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  files: FileEntity[]; // File из Prisma
}

// Интерфейс для условий where
export interface ListingWhereCondition {
  id?: {
    not: string;
  };
  status?: ListingStatus;
  categoryId?: number;
  price?: {
    gte: number;
    lte: number;
  };
}

export class ListingEntity {
  id: string;

  userId: string;
  categoryId: number;

  rating: number;
  reviewsCount: number;

  title?: string | null;
  description?: string | null;

  status: ListingStatus;

  price?: number | null;
  currencyId?: number | null;

  priceUnitId?: number | null;
  condition?: ListingCondition | null;

  viewsCount: number;
  favoritesCount: number;
  likesCount: number;

  version: number;

  publishedAt?: Date | null;
  archivedAt?: Date | null;
  autoDeleteAt?: Date | null;

  lastUsedAt?: Date | null;

  createdAt: Date;
  updatedAt: Date;

  constructor(
    id: string,
    userId: string,
    categoryId: number,
    rating: number,
    reviewsCount: number,
    title?: string | null,
    description?: string | null,
    status: ListingStatus = ListingStatus.DRAFT,
    price?: number | null,
    currencyId?: number | null,
    priceUnitId?: number | null,
    condition?: ListingCondition | null,
    viewsCount: number = 0,
    favoritesCount: number = 0,
    likesCount: number = 0,
    version: number = 1,
    publishedAt?: Date | null,
    archivedAt?: Date | null,
    autoDeleteAt?: Date | null,
    lastUsedAt?: Date | null,
    createdAt: Date = new Date(),
    updatedAt: Date = new Date(),
  ) {
    this.id = id;
    this.userId = userId;
    this.categoryId = categoryId;
    this.rating = rating;
    this.reviewsCount = reviewsCount;
    this.title = title ?? null;
    this.description = description ?? null;
    this.status = status;
    this.price = price ?? null;
    this.currencyId = currencyId ?? null;
    this.priceUnitId = priceUnitId ?? null;
    this.condition = condition ?? null;
    this.viewsCount = viewsCount;
    this.favoritesCount = favoritesCount;
    this.likesCount = likesCount;
    this.version = version;
    this.publishedAt = publishedAt ?? null;
    this.archivedAt = archivedAt ?? null;
    this.autoDeleteAt = autoDeleteAt ?? null;
    this.lastUsedAt = lastUsedAt ?? null;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}

export class ListingEntityWithFiles extends ListingEntity {
  files: FileEntity[];
  photos: FileEntity[];

  static fromPrismaWithFiles(listing: PrismaListing): ListingEntityWithFiles {
    const entity = new ListingEntity(
      listing.id,
      listing.userId,
      listing.categoryId,
      listing.rating ?? 0,
      listing.reviewsCount ?? 0,
      listing.title,
      listing.description,
      listing.status,
      listing.price,
      listing.currencyId,
      listing.priceUnitId,
      listing.condition,
      listing.viewsCount,
      listing.favoritesCount,
      listing.likesCount,
      listing.version,
      listing.publishedAt,
      listing.archivedAt,
      listing.autoDeleteAt,
      listing.lastUsedAt,
      listing.createdAt,
      listing.updatedAt,
    );

    const entityWithFiles = new ListingEntityWithFiles(entity, listing.files);
    return entityWithFiles.toResult(listing.files);
  }

  toResult(files: FileEntity[]) {
    this.files = files;

    // Разделяем файлы на фотографии и документы
    this.photos = files.filter((file) => file.kind === FILE_KIND.PHOTO);
    this.files = files.filter((file) => file.kind === FILE_KIND.DOCUMENT);

    return this;
  }

  constructor(data: ListingEntity, files: FileEntity[]) {
    super(
      data.id,
      data.userId,
      data.categoryId,
      data.rating,
      data.reviewsCount,
      data.title,
      data.description,
      data.status,
      data.price,
      data.currencyId,
      data.priceUnitId,
      data.condition,
      data.viewsCount,
      data.favoritesCount,
      data.likesCount,
      data.version,
      data.publishedAt,
      data.archivedAt,
      data.autoDeleteAt,
      data.lastUsedAt,
      data.createdAt,
      data.updatedAt,
    );
    this.files = files;
    this.photos = []; // Инициализируем пустым массивом
  }
}
