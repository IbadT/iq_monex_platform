import { ApiProperty } from '@nestjs/swagger';

export class GetReviewsDto {
  @ApiProperty({
    description: 'ID отзыва',
    example: '4b41bdb4-f243-488c-8426-36a9546bbe67',
    type: 'string',
  })
  id: string;

  @ApiProperty({
    description: 'ID кто оставил отзыв',
    example: '4b41bdb4-f243-488c-8426-36a9546bbe67',
    type: 'string',
  })
  authorId: string;

  @ApiProperty({
    description:
      'На какое объявление или на какого пользователя ставится отзыв(LISTING или USER)',
    example: 'USER',
    type: 'string',
  })
  targetType: string;

  @ApiProperty({
    description: 'ID объявления которому ставится отзыв',
    example: '4b41bdb4-f243-488c-8426-36a9546bbe67',
    type: 'string',
  })
  listingId: string | null;

  @ApiProperty({
    description: 'ID пользователя которому ставится отзыв',
    example: '4b41bdb4-f243-488c-8426-36a9546bbe67',
    type: 'string',
  })
  targetUserId: string | null;

  @ApiProperty({
    description: 'Рейтинг',
    example: 5,
    type: 'integer',
  })
  rating: number;

  @ApiProperty({
    description: 'НЕ ИСПОЛЬЗОВАТЬ',
    deprecated: true,
    example: '',
    type: 'string',
  })
  title: string | null;

  @ApiProperty({
    description: 'Сообщение',
    example: 'Отличный мастер, рекомендую!',
    type: 'string',
  })
  content: string;

  @ApiProperty({
    description: 'Статус модерации',
    example: 'PENDING',
    type: 'string',
  })
  status: string;

  @ApiProperty({
    description: 'Количетсво лайков',
    example: 120,
    type: 'integer',
  })
  likesCount: number;

  @ApiProperty({
    description: 'Количество коментариев',
    example: 123,
    type: 'integer',
  })
  reportsCount: number;

  @ApiProperty({
    description: 'Ответ владельца',
    example: '',
    type: 'string',
  })
  replyContent: string | null;

  @ApiProperty({
    description: 'Время ответа',
    example: '',
    type: 'string',
  })
  replyAt: Date | null;

  @ApiProperty({
    description: 'Ответ автора',
    example: '',
    type: 'string',
  })
  replyAuthorId: string | null;

  @ApiProperty({
    description: 'Дата создания',
    example: '2026-03-22T16:24:33.144Z',
    type: 'string',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Дата обновления',
    example: '2026-03-22T16:24:33.144Z',
    type: 'string',
  })
  updatedAt: Date;

  constructor(
    id: string,
    authorId: string,
    targetType: string,
    listingId: string | null,
    targetUserId: string | null,
    rating: number,
    title: string | null,
    content: string,
    status: string,
    likesCount: number,
    reportsCount: number,
    replyContent: string,
    replyAt: Date | null,
    replyAuthorId: string | null,
    createdAt: Date,
    updatedAt: Date,
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
  }
}
