import { ApiProperty } from '@nestjs/swagger';

export class ReviewLikeDto {
  @ApiProperty({
    description: 'ID лайка',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: 'string',
    format: 'uuid',
  })
  id: string;

  @ApiProperty({
    description: 'ID пользователя, который поставил лайк',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: 'string',
    format: 'uuid',
  })
  userId: string;

  constructor(id: string, userId: string) {
    this.id = id;
    this.userId = userId;
  }
}

export class ReviewAuthorDto {
  @ApiProperty({
    description: 'ID пользователя',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: 'string',
    format: 'uuid',
  })
  id: string;

  @ApiProperty({
    description: 'Имя пользователя',
    example: 'Иван Иванов',
    type: 'string',
  })
  name: string;

  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
  }
}

export class ReviewFileDto {
  @ApiProperty({
    description: 'ID файла',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: 'string',
    format: 'uuid',
  })
  id: string;

  @ApiProperty({
    description: 'URL файла',
    example: 'https://example.com/file.jpg',
    type: 'string',
  })
  url: string;

  @ApiProperty({
    description: 'Имя файла',
    example: 'photo_0.jpg',
    type: 'string',
  })
  fileName: string;

  @ApiProperty({
    description: 'Тип файла',
    example: 'image/jpeg',
    type: 'string',
  })
  fileType: string;

  @ApiProperty({
    description: 'Размер файла в байтах',
    example: 1024,
    type: 'number',
  })
  fileSize: number;

  constructor(
    id: string,
    url: string,
    fileName: string,
    fileType: string,
    fileSize: number,
  ) {
    this.id = id;
    this.url = url;
    this.fileName = fileName;
    this.fileType = fileType;
    this.fileSize = fileSize;
  }
}

export enum ReviewTargetType {
  LISTING = 'LISTING',
  USER = 'USER',
}

export class ReviewResponseDto {
  @ApiProperty({
    description: 'UUID отзыва',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: 'string',
    format: 'uuid',
  })
  id: string;

  @ApiProperty({
    description: 'ID автора отзыва',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: 'string',
    format: 'uuid',
  })
  authorId: string;

  @ApiProperty({
    description: 'ID объявления',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: 'string',
    format: 'uuid',
    required: false,
  })
  listingId: string | null;

  @ApiProperty({
    description: 'Тип цели отзыва',
    enum: ReviewTargetType,
    example: ReviewTargetType.LISTING,
  })
  targetType: ReviewTargetType;

  @ApiProperty({
    description: 'Заголовок отзыва',
    example: 'Отличное объявление',
    type: 'string',
    required: false,
  })
  title: string | null;

  @ApiProperty({
    description: 'Содержание отзыва',
    example:
      'Продавец очень вежливый, товар соответствует описанию. Рекомендую!',
    type: 'string',
  })
  content: string;

  @ApiProperty({
    description: 'Рейтинг от 1 до 5',
    example: 5,
    minimum: 1,
    maximum: 5,
    type: 'number',
  })
  rating: number;

  @ApiProperty({
    description: 'Дата создания отзыва',
    example: '2024-01-15T10:30:00Z',
    type: 'string',
    format: 'date-time',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Дата обновления отзыва',
    example: '2024-01-15T10:30:00Z',
    type: 'string',
    format: 'date-time',
  })
  updatedAt: Date;

  @ApiProperty({
    description: 'Список лайков отзыва',
    type: () => [ReviewLikeDto],
    required: false,
  })
  likes: ReviewLikeDto[] | null;

  @ApiProperty({
    description: 'Информация об авторе отзыва',
    type: () => ReviewAuthorDto,
  })
  author: ReviewAuthorDto;

  @ApiProperty({
    description: 'Список прикрепленных файлов',
    type: () => [ReviewFileDto],
    required: false,
  })
  files: ReviewFileDto[] | null;

  constructor(
    id: string,
    authorId: string,
    listingId: string | null,
    targetType: ReviewTargetType,
    title: string | null,
    content: string,
    rating: number,
    createdAt: Date,
    updatedAt: Date,
    author: ReviewAuthorDto,
    likes: ReviewLikeDto[] | null,
    files: ReviewFileDto[] | null,
  ) {
    this.id = id;
    this.authorId = authorId;
    this.listingId = listingId;
    this.targetType = targetType;
    this.title = title;
    this.content = content;
    this.rating = rating;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.author = author;
    this.likes = likes;
    this.files = files;
  }
}
