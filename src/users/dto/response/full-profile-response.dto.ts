import { UserWorkerResponseDto } from '@/workers/dto/response/worker-response.dto';
import { ProfileResponseDto } from './profile-response.dto';
import { MapLocationResponseDto } from '@/map_locations/dto/response/map-enterprice.response.dto';
import { ActivityResponseDto } from '@/activities/dto/response/activity-response.dto';
import { LegalEntityResponseDto } from '@/categories/dto/response/legal-entity.response.dto';
import { CurrenciesResponseDto } from '@/dictionaries/dto/response/currencies-response.dto';
import { ApiProperty } from '@nestjs/swagger';

export class FullProfileResponseDto extends ProfileResponseDto {
  @ApiProperty({
    description: 'Информация сферы деятельности',
    type: () => [ActivityResponseDto],
    isArray: true,
  })
  activities: ActivityResponseDto[];

  @ApiProperty({
    description: 'Файлы профиля',
    example: '',
    type: 'string',
  })
  files: any[];

  @ApiProperty({
    description: 'Картинки профиля',
    example: '',
    type: 'string',
  })
  images: any[];

  @ApiProperty({
    description:
      'Находится ли этот профиль в избранном у запрашиваемом пользователе',
    example: false,
    type: 'string',
  })
  favorite: boolean;

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

  constructor(
    id: string,
    avatarUrl: string | null,
    phone: string | null,
    email: string | null,
    telegram: string | null,
    siteUrl: string | null,
    description: string | null,
    legalEntityType: LegalEntityResponseDto,
    currency: CurrenciesResponseDto,
    activities: ActivityResponseDto[],
    files: any[],
    images: any[],
    favorite: boolean,
    rating: number,
    commentsCount: number,
    workers: UserWorkerResponseDto[],
    maps: MapLocationResponseDto[],
  ) {
    super(
      id,
      avatarUrl,
      phone,
      email,
      telegram,
      siteUrl,
      description,
      legalEntityType,
      currency,
      activities,
    );
    this.activities = activities;
    this.files = files;
    this.images = images;
    this.favorite = favorite;
    this.rating = rating;
    this.commentsCount = commentsCount;
    this.workers = workers;
    this.maps = maps;
  }
}
