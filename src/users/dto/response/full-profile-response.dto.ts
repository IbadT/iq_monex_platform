import { UserWorkerResponseDto } from '@/workers/dto/response/worker-response.dto';
import { ProfileResponseDto } from './profile-response.dto';
import { MapLocationResponseDto } from '@/map_locations/dto/response/map-enterprice.response.dto';
import { ActivityGroupResponseDto } from '@/activities/dto/response/activity-group-response.dto';
import { LegalEntityResponseDto } from '@/categories/dto/response/legal-entity.response.dto';
import { CurrenciesResponseDto } from '@/dictionaries/dto/response/currencies-response.dto';
import { ApiProperty } from '@nestjs/swagger';
import { ListingFileResponseDto } from '@/listings/dto/response/listing-file-response.dto';
import { NoteEmbeddedDto } from '@/notes/dto/note-embedded.dto';
import { BanResponseDto } from './ban-response.dto';

export class FullProfileResponseDto extends ProfileResponseDto {
  @ApiProperty({
    description: 'Информация сферы деятельности, сгруппированное по группам',
    type: () => [ActivityGroupResponseDto],
    isArray: true,
  })
  activities: ActivityGroupResponseDto[];

  @ApiProperty({
    description: 'Файлы профиля',
    example: '',
    type: () => [ListingFileResponseDto],
    isArray: true,
  })
  files: ListingFileResponseDto[];

  @ApiProperty({
    description: 'Картинки профиля',
    example: '',
    type: () => [ListingFileResponseDto],
    isArray: true,
  })
  images: ListingFileResponseDto[];

  @ApiProperty({
    description:
      'Находится ли этот профиль в избранном у запрашиваемом пользователе',
    example: false,
    type: 'string',
  })
  isFavorite: boolean;

  @ApiProperty({
    description: 'Рейтинг профиля',
    example: 5,
    type: 'integer',
  })
  rating: number;

  @ApiProperty({
    description: 'Количество комментариев',
    example: 12,
    type: 'integer',
  })
  commentsCount: number;

  @ApiProperty({
    description: 'Сотрудники компании',
    type: () => [UserWorkerResponseDto],
    isArray: true,
  })
  workers: UserWorkerResponseDto[];

  @ApiProperty({
    description: 'Локации компании',
    type: () => [MapLocationResponseDto],
    isArray: true,
  })
  maps: MapLocationResponseDto[];

  @ApiProperty({
    description: 'Личная заметка текущего пользователя о профиле',
    type: () => NoteEmbeddedDto,
    nullable: true,
  })
  note: NoteEmbeddedDto | null;

  @ApiProperty({
    description: 'Информация о бане пользователя',
    type: () => BanResponseDto,
  })
  ban: BanResponseDto;

  constructor(
    id: string,
    userId: string,
    accountNumber: string,
    name: string,
    avatarUrl: string | null,
    phone: string | null,
    email: string | null,
    telegram: string | null,
    siteUrl: string | null,
    description: string | null,
    legalEntityType: LegalEntityResponseDto | null,
    currency: CurrenciesResponseDto | null,
    activities: ActivityGroupResponseDto[],
    files: ListingFileResponseDto[],
    images: ListingFileResponseDto[],
    isFavorite: boolean,
    rating: number,
    commentsCount: number,
    workers: UserWorkerResponseDto[],
    maps: MapLocationResponseDto[],
    note: NoteEmbeddedDto | null,
    ban: BanResponseDto,
    createdAt: Date,
  ) {
    super(
      id,
      userId,
      accountNumber,
      name,
      avatarUrl,
      phone,
      email,
      telegram,
      siteUrl,
      description,
      legalEntityType,
      currency,
      activities,
      rating,
      commentsCount,
      ban,
      maps,
      createdAt,
    );
    this.activities = activities;
    this.files = files;
    this.images = images;
    this.isFavorite = isFavorite;
    this.rating = rating;
    this.commentsCount = commentsCount;
    this.workers = workers;
    this.maps = maps;
    this.note = note;
    this.ban = ban;
  }
}
