export class ReviewLikeEntity {
  id: string;

  reviewId: string;

  userId: string;

  createdAt: Date;

  constructor(id: string, reviewId: string, userId: string, createdAt: Date) {
    this.id = id;
    this.reviewId = reviewId;
    this.userId = userId;
    this.createdAt = createdAt;
  }
}
