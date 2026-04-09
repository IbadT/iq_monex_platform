// profile.mapper.ts
import { ActivityResponseDto } from '@/activities/dto/response/activity-response.dto';
import { LegalEntityResponseDto } from '@/categories/dto/response/legal-entity.response.dto';
import { CurrenciesResponseDto } from '@/dictionaries/dto/response/currencies-response.dto';
import {
  GetAllProfilesResponseDto,
  PaginationResponseDto,
  ProfileResponseDto,
} from '../dto/response/profile-response.dto';
import { FullProfileResponseDto } from '../dto/response/full-profile-response.dto';
import { UserWorkerResponseDto } from '@/workers/dto/response/worker-response.dto';
import { RoleResponseDto } from '@/workers/dto/response/role-response.dto';
import { ListingFileResponseDto } from '@/listings/dto/response/listing-file-response.dto';
import { MapLocationResponseDto } from '@/map_locations/dto/response/map-enterprice.response.dto';

interface UserActivityWithActivity {
  activity: {
    id: number;
    name: string;
  };
}

export class ProfileMapper {
  static toResponse(profile: any): ProfileResponseDto {
    // Преобразуем активности
    const activities =
      profile.user?.userActivities?.map(
        (ua: UserActivityWithActivity) =>
          new ActivityResponseDto(ua.activity.id, ua.activity.name),
      ) || [];

    // Преобразуем тип юр лица
    const legalEntityType = new LegalEntityResponseDto(
      profile.legalEntityType.id,
      profile.legalEntityType.code,
      profile.legalEntityType.name,
    );

    // Преобразуем валюту
    const currency = new CurrenciesResponseDto(
      profile.currency.id,
      profile.currency.symbol,
      profile.currency.name,
      profile.currency.code,
    );

    const rating = profile.user.rating;
    const commentsCount = profile.user.reviewsCount;

    return new ProfileResponseDto(
      profile.id,
      profile.avatarUrl,
      profile.phone,
      profile.email,
      profile.telegram,
      profile.siteUrl,
      profile.description,
      legalEntityType,
      currency,
      activities,
      rating,
      commentsCount,
    );
  }

  static toResponseList(profiles: any[]): ProfileResponseDto[] {
    return profiles.map((profile) => this.toResponse(profile));
  }

  static toGetAllResponse(
    profiles: any[],
    total: number,
    limit: number,
    offset: number,
  ): GetAllProfilesResponseDto {
    const rows = this.toResponseList(profiles);
    const pagination = new PaginationResponseDto(total, limit, offset);

    return new GetAllProfilesResponseDto(rows, pagination);
  }

  static toFullResponse(
    user: any,
    currentUserId: string | undefined,
    isFavoriteParam?: boolean,
  ): FullProfileResponseDto {
    // Активности
    const activities =
      user.userActivities?.map(
        (ua: any) => new ActivityResponseDto(ua.activity.id, ua.activity.name),
      ) || [];

    // Юр лицо (опциональное поле)
    const legalEntityType = user.profile?.legalEntityType
      ? new LegalEntityResponseDto(
          user.profile.legalEntityType.id,
          user.profile.legalEntityType.code,
          user.profile.legalEntityType.name,
        )
      : null;

    // Валюта (опциональное поле)
    const currency = user.profile?.currency
      ? new CurrenciesResponseDto(
          user.profile.currency.id,
          user.profile.currency.symbol,
          user.profile.currency.name,
          user.profile.currency.code,
        )
      : null;

    // Файлы и изображения
    const avatar = user.files?.find((f: any) => f.kind === 'AVATAR' && f.ownerType === 'USER');

    const images: ListingFileResponseDto[] =
      user.files
        ?.filter((f: any) => f.kind === 'PHOTO' && f.ownerType === 'USER')
        .map(
          (f: any) =>
            new ListingFileResponseDto(
              f.id,
              f.url,
              f.fileType,
              f.isPrimary || false,
            ),
        ) || [];

    const files: ListingFileResponseDto[] =
      user.files
        ?.filter((f: any) => f.kind === 'DOCUMENT' && f.ownerType === 'USER')
        .map(
          (f: any) =>
            new ListingFileResponseDto(
              f.id,
              f.url,
              f.fileType,
              f.isPrimary || false,
            ),
        ) || [];

    // Рейтинг
    const ratings = user.receivedReviews?.map((r: any) => r.rating) || [];
    const averageRating =
      ratings.length > 0
        ? ratings.reduce((a: number, b: number) => a + b, 0) / ratings.length
        : user.rating || 0;

    // Сотрудники
    const workers =
      user.workers?.map(
        (w: any) =>
          new UserWorkerResponseDto(
            w.id,
            w.name,
            w.email,
            w.phone,
            w.roleId,
            w.userId,
            w.isActive,
            new RoleResponseDto(
              w.role.id,
              w.role.code,
              w.role.role,
              w.role.type,
            ),
          ),
      ) || [];

    // Локации
    const maps =
      user.locations?.map(
        (l: any) =>
          new MapLocationResponseDto(
            l.id,
            l.type,
            l.address,
            l.latitude,
            l.longitude,
            l.country,
            l.city,
            l.userId,
            l.listingId,
          ),
      ) || [];

    // Проверка в избранном
    console.log('[DEBUG Mapper] currentUserId:', currentUserId);
    console.log('[DEBUG Mapper] isFavoriteParam:', isFavoriteParam);
    // Используем переданный isFavorite, или проверяем через include если есть
    const isFavorite = isFavoriteParam !== undefined 
      ? isFavoriteParam 
      : (currentUserId && user.favorites && user.favorites.length > 0);
    console.log('[DEBUG Mapper] isFavorite result:', isFavorite);

    return new FullProfileResponseDto(
      user.id,
      avatar?.url || null,
      user.profile?.phone || null,
      user.profile?.email || null,
      user.profile?.telegram || null,
      user.profile?.siteUrl || null,
      user.profile?.description || null,
      legalEntityType, // Всегда есть
      currency, // Всегда есть
      activities,
      files,
      images,
      isFavorite,
      averageRating,
      user.receivedReviews?.length || 0,
      workers,
      maps,
    );
  }
}
