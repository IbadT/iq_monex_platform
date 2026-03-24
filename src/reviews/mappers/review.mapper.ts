import {
  ReviewResponseDto,
  ReviewLikeDto,
  ReviewAuthorDto,
  ReviewFileDto,
} from '../dto/response/review-by-id-response.dto';

export class ReviewMapper {
  static toResponse(review: any): ReviewResponseDto {
    // Преобразуем лайки
    const likes =
      review.likes?.map(
        (like: any) => new ReviewLikeDto(like.id, like.userId),
      ) || [];

    // Преобразуем автора
    const author = new ReviewAuthorDto(review.author.id, review.author.name);

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
}
