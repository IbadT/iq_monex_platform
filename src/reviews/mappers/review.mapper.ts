import {
  ReviewResponseDto,
  ReviewLikeDto,
  ReviewAuthorDto,
  ReviewFileDto,
} from '../dto/response/review-by-id-response.dto';
import { GetReviewsDto } from '../dto/response/get-reviews.dto';
import { ListingFileResponseDto } from '@/listings/dto/response/listing-file-response.dto';

export class ReviewMapper {
  static toResponse(review: any): ReviewResponseDto {
    // Преобразуем лайки
    const likes =
      review.likes?.map(
        (like: any) => new ReviewLikeDto(like.id, like.userId),
      ) || [];

    // Преобразуем автора
    const author = new ReviewAuthorDto(
      review.author.id,
      review.author.name,
      review.author?.files && review.author.files.length > 0
        ? review.author.files[0]?.url || ''
        : '',
    );

    // Преобразуем файлы
    const files =
      review.files?.map(
        (file: any) =>
          new ReviewFileDto(
            file.id,
            file.url,
            file.fileName,
            file.fileType,
            file.fileSize,
          ),
      ) || [];

    return new ReviewResponseDto(
      review.id,
      review.authorId,
      review.listingId,
      //   review.targetType as ReviewTargetType,
      review.targetType,
      review.title,
      review.content,
      review.rating,
      review.createdAt,
      review.updatedAt,
      author,
      likes,
      files,
    );
  }

  static toResponseList(reviews: any[]): ReviewResponseDto[] {
    return reviews.map((review) => this.toResponse(review));
  }

  static toGetReviewsDto(review: any): GetReviewsDto {
    // Получаем аватар автора из его файлов
    const avatarUrl =
      review.author?.files && review.author.files.length > 0
        ? review.author.files[0]?.url || ''
        : '';

    // Получаем картинки отзыва из ReviewFile
    const images =
      review.files?.map(
        (file: any) =>
          new ListingFileResponseDto(file.id, file.url, file.fileType, false),
      ) || [];

    return new GetReviewsDto(
      review.id,
      avatarUrl,
      images,
      review.authorId,
      review.author?.name || '',
      review.targetType,
      review.listingId,
      review.targetUserId,
      review.rating,
      review.title,
      review.content,
      review.status,
      review.likesCount || 0,
      review.reportsCount || 0,
      review.replyContent || null,
      review.replyAt || null,
      review.replyAuthorId || null,
      review.createdAt,
      review.updatedAt,
    );
  }

  static toGetReviewsDtoList(reviews: any[]): GetReviewsDto[] {
    return reviews.map((review) => this.toGetReviewsDto(review));
  }
}
