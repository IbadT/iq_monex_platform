export class ListingLikeEntity {
  id: string;

  listingId: string;

  userId: string;

  createdAt: Date;

  constructor(id: string, listingId: string, userId: string, createdAt: Date) {
    this.id = id;
    this.listingId = listingId;
    this.userId = userId;
    this.createdAt = createdAt;
  }
}
