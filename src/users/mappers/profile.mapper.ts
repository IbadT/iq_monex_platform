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

// Mock for FileKind
let FileKind: any;
try {
  const enums = require('prisma/generated/enums');
  FileKind = enums.FileKind;
} catch (error) {
  // Mock for tests
  FileKind = {
    DOCUMENT: 'DOCUMENT',
    PHOTO: 'PHOTO',
  };
}
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
    currentUserId: string,
  ): FullProfileResponseDto {
    // Активности
    const activities =
      user.userActivities?.map(
        (ua: any) => new ActivityResponseDto(ua.activity.id, ua.activity.name),
      ) || [];

    // Юр лицо (обязательное поле - всегда должно быть)
    const legalEntityType = new LegalEntityResponseDto(
      user.profile.legalEntityType.id,
      user.profile.legalEntityType.code,
      user.profile.legalEntityType.name,
    );

    // Валюта (обязательное поле - всегда должно быть)
    const currency = new CurrenciesResponseDto(
      user.profile.currency.id,
      user.profile.currency.symbol,
      user.profile.currency.name,
      user.profile.currency.code,
    );

    // Файлы и изображения
    const avatar = user.files?.find((f: any) => f.kind === FileKind.AVATAR);
    const images =
      user.files?.filter((f: any) => f.kind === FileKind.PHOTO) || [];
    const files =
      user.files?.filter((f: any) => f.kind === FileKind.DOCUMENT) || [];

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
            l.userId,
            l.listingId,
            l.address,
            l.latitude,
            l.longitude,
            l.type,
          ),
      ) || [];

    // Проверка в избранном
    const isFavorite =
      currentUserId && user.favorites && user.favorites.length > 0;

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
