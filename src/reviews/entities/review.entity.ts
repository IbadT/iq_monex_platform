import {
  ReviewStatus,
  ReviewTargetType,
} from '../../../prisma/generated/enums';

export class Review {
  id: string;

  authorId: string;

  targetType: ReviewTargetType;
  listingId: string | null;
  targetUserId: string | null;

  rating: number;
  title: string | null;
  content: string;

  status: ReviewStatus;

  likesCount: number;
  reportsCount: number;

  replyContent: string | null;
  replyAt: Date | null;
  replyAuthorId: string | null;

  createdAt: Date;
  updatedAt: Date;

  files: any[];
  likes: any[];

  constructor(
    id: string,
    authorId: string,
    targetType: ReviewTargetType,
    listingId: string | null,
    targetUserId: string | null,
    rating: number,
    title: string | null,
    content: string,
    status: ReviewStatus,
    likesCount: number,
    reportsCount: number,
    replyContent: string | null,
    replyAt: Date | null,
    replyAuthorId: string | null,
    createdAt: Date,
    updatedAt: Date,
    files: any[],
    likes: any[],
  ) {
    this.id = id;
    this.authorId = authorId;
    this.targetType = targetType;
    this.listingId = listingId;
    this.targetUserId = targetUserId;
    this.rating = rating;
    this.title = title;
    this.content = content;
    this.status = status;
    this.likesCount = likesCount;
    this.reportsCount = reportsCount;
    this.replyContent = replyContent;
    this.replyAt = replyAt;
    this.replyAuthorId = replyAuthorId;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.files = files;
    this.likes = likes;
  }
}
