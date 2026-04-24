// profile.mapper.ts
import {
  ActivityGroupResponseDto,
  ActivityInGroupDto,
} from '@/activities/dto/response/activity-group-response.dto';
import { LegalEntityType } from '@/categories/entities/legal-entity-type.entity';
import { Language } from '@/dictionaries/dto/request/get-currency.dto';
import { CurrenciesResponseDto } from '@/dictionaries/dto/response/currencies-response.dto';
import {
  GetAllProfilesResponseDto,
  PaginationResponseDto,
  ProfileResponseDto,
} from '../dto/response/profile-response.dto';
import { FullProfileResponseDto } from '../dto/response/full-profile-response.dto';
import { UserWorkerResponseDto } from '@/workers/dto/response/worker-response.dto';
import { RoleResponseDto } from '@/workers/dto/response/role-response.dto';
import { NoteEmbeddedDto } from '@/notes/dto/note-embedded.dto';
import { ListingFileResponseDto } from '@/listings/dto/response/listing-file-response.dto';
import { MapLocationResponseDto } from '@/map_locations/dto/response/map-enterprice.response.dto';
import { NoteTargetType } from '@/notes';
import { BanResponseDto } from '../dto/response/ban-response.dto';

// interface UserActivityWithActivity {
//   activity: {
//     id: number;
//     name: string;
//     groupId: number;
//     group?: {
//       name: string;
//     };
//   };
// }

export class ProfileMapper {
  static toResponse(profile: any): ProfileResponseDto {
    // Преобразуем активности, группируя их по группам
    const activities = this.groupActivitiesByGroup(
      profile.user?.userActivities || [],
    );

    // Преобразуем тип юр лица через маппер с дефолтным языком RU (опциональное поле)
    const legalEntityType = profile.legalEntityType
      ? LegalEntityType.fromPromise({
          id: profile.legalEntityType.id,
          data: profile.legalEntityType.data,
        }).toResponse(Language.RU)
      : null;

    // Преобразуем валюту (опциональное поле)
    const currency = profile.currency
      ? new CurrenciesResponseDto(
          profile.currency.id,
          profile.currency.symbol,
          profile.currency.name,
          profile.currency.code,
        )
      : null;

    const rating = profile.user.rating;
    const commentsCount = profile.user.reviewsCount;

    // Формируем имя из legalEntityType (code + name) или используем user.name
    // const displayName = legalEntityType
    //   ? // ? `${legalEntityType.code} ${legalEntityType.name}`
    //     `${legalEntityType.code} ${profile.user?.name}`
    //   : profile.user?.name || '';

    // Бан информация
    const ban = new BanResponseDto(
      profile.user?.isBanned ?? false,
      profile.user?.banReason || null,
    );

    // Локации/адреса
    const maps =
      profile.user?.locations?.map(
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

    return new ProfileResponseDto(
      profile.id,
      profile.user?.id || '',
      profile.user?.accountNumber || '',
      profile.user?.name || '',
      profile.avatarUrl,
      profile.phone,
      profile.email,
      profile.siteUrl,
      profile.description,
      legalEntityType,
      currency,
      activities,
      rating,
      commentsCount,
      ban,
      maps,
      profile.user?.createdAt || new Date(),
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
    note?: NoteEmbeddedDto | null,
  ): FullProfileResponseDto {
    // Активности, сгруппированные по группам
    const activities = this.groupActivitiesByGroup(user.userActivities || []);

    // Юр лицо (опциональное поле) - данные хранятся в JSON поле data по локалям
    const legalEntityType = user.profile?.legalEntityType
      ? LegalEntityType.fromPromise({
          id: user.profile.legalEntityType.id,
          data: user.profile.legalEntityType.data,
        }).toResponse(Language.RU)
      : null;

    // Формируем имя из legalEntityType (code + name) или используем user.name
    // const displayName = legalEntityType
    //   ? // ? `${legalEntityType.code} ${legalEntityType.name}`
    //     `${legalEntityType.code} ${user.name}`
    //   : user.name || '';

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
    // Аватар берем только из profile.avatarUrl (единый источник истины)
    const avatarUrl = user.profile?.avatarUrl || null;

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
      user.workers?.map((w: any) => {
        // Получаем аватар из files
        const avatarFile = w.files?.find((f: any) => f.kind === 'AVATAR');
        const avatar = avatarFile?.url || null;

        return new UserWorkerResponseDto(
          w.id,
          w.name,
          w.email,
          w.phone,
          w.roleId,
          w.userId,
          w.isActive,
          new RoleResponseDto(w.role.id, w.role.code, w.role.role, w.role.type),
          avatar,
        );
      }) || [];

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
    const isFavorite =
      isFavoriteParam !== undefined
        ? isFavoriteParam
        : currentUserId && user.favorites && user.favorites.length > 0;
    console.log('[DEBUG Mapper] isFavorite result:', isFavorite);

    // Бан информация
    const ban = new BanResponseDto(
      user.isBanned ?? false,
      user.banReason || null,
    );

    return new FullProfileResponseDto(
      user.profile?.id || user.id,
      user.id,
      user.accountNumber || '',
      // displayName,
      user.name || '',
      avatarUrl,
      user.profile?.phone || null,
      user.profile?.email || null,
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
      note ?? null,
      ban,
      user.createdAt,
    );
  }

  static buildNoteEmbeddedDto(
    noteId: string | null,
    // targetType: 'USER' | 'LISTING',
    targetType: NoteTargetType,
    targetId: string,
  ): NoteEmbeddedDto | null {
    if (!noteId) return null;
    return new NoteEmbeddedDto(noteId, targetType, targetId);
  }

  /**
   * Группирует активности пользователя по группам активностей
   */
  static groupActivitiesByGroup(
    userActivities: any[],
  ): ActivityGroupResponseDto[] {
    // Группируем активности по groupId
    const groupsMap = new Map<
      number,
      { name: string; activities: ActivityInGroupDto[] }
    >();

    for (const ua of userActivities) {
      const activity = ua.activity;
      if (!activity) continue;

      const groupId = activity.groupId;
      const groupName = activity.group?.name || '';

      if (!groupsMap.has(groupId)) {
        groupsMap.set(groupId, {
          name: groupName,
          activities: [],
        });
      }

      const group = groupsMap.get(groupId)!;
      group.activities.push(
        new ActivityInGroupDto(activity.id, activity.name, groupId),
      );
    }

    // Преобразуем Map в массив ActivityGroupResponseDto
    const result: ActivityGroupResponseDto[] = [];
    for (const [id, { name, activities }] of groupsMap) {
      result.push(new ActivityGroupResponseDto(id, name, activities));
    }

    // Сортируем по id группы для стабильного порядка
    return result.sort((a, b) => a.id - b.id);
  }
}
