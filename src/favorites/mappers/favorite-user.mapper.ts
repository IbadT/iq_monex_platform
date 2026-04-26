import {
  FavoriteUserProfileResponseDto,
  UserProfileDto,
  UserDto,
  ActivityDto,
} from '../dto/response/favorite-user-profile-response.dto';
import { ListingStatus } from '@/listings/enums/listing-status.enum';
import { MapLocationType } from '@/listings/dto/request/create-map-location.dto';
import { FileKind } from '../../../prisma/generated/enums';

export class FavoriteUserMapper {
  static toResponse(favorite: any): FavoriteUserProfileResponseDto {
    // Get account number
    const accountNumber = favorite.targetUser?.accountNumber || '';

    // Count offices and warehouses from locations
    const officesCount =
      favorite.targetUser?.locations?.filter(
        (loc: any) =>
          loc.type === MapLocationType.MAIN_OFFICE ||
          loc.type === MapLocationType.OFFICE,
      ).length || 0;

    const warehousesCount =
      favorite.targetUser?.locations?.filter(
        (loc: any) => loc.type === MapLocationType.WAREHOUSE,
      ).length || 0;

    // Count workers
    const workersCount = favorite.targetUser?.workers?.length || 0;

    // Count only PUBLISHED listings
    const listingsCount =
      favorite.targetUser?.listings?.filter(
        (listing: any) => listing.status === ListingStatus.PUBLISHED,
      ).length || 0;

    // Get gallery photos (PHOTO kind)
    const photos =
      favorite.targetUser?.files
        ?.filter((file: any) => file.kind === FileKind.PHOTO)
        .map((file: any) => file.url) || [];

    const userProfile = favorite.targetUser?.profile
      ? new UserProfileDto(
          favorite.targetUser.profile.id || '',
          favorite.targetUser.profile.userId || '',
          favorite.targetUser.profile.legalEntityTypeId || 0,
          favorite.targetUser.profile.currencyId || 0,
          favorite.targetUser.profile.avatarUrl || null,
          favorite.targetUser.profile.phone || null,
          favorite.targetUser.profile.email || null,
          favorite.targetUser.profile.siteUrl || null,
          favorite.targetUser.profile.description || null,
          accountNumber,
          officesCount,
          warehousesCount,
          workersCount,
          listingsCount,
          photos,
        )
      : null;

    // Map activities
    const activities =
      favorite.targetUser?.userActivities?.map(
        (ua: any) =>
          new ActivityDto(ua.activity?.id || 0, ua.activity?.name || ''),
      ) || [];

    // Get city and country from locations
    const firstLocation = favorite.targetUser?.locations?.[0];
    const city = firstLocation?.city || null;
    const country = firstLocation?.country || null;

    const userDto = new UserDto(
      favorite.targetUser?.id || '',
      favorite.targetUser?.name || '',
      favorite.targetUser?.rating || null,
      favorite.targetUser?.reviewsCount || 0,
      userProfile,
      activities,
      true, // isFavorite is always true in favorites list
      city,
      country,
    );

    return new FavoriteUserProfileResponseDto(
      favorite.id,
      favorite.userId,
      favorite.type,
      favorite.targetUserId || '',
      favorite.createdAt,
      userDto,
    );
  }

  static toResponseList(favorites: any[]): FavoriteUserProfileResponseDto[] {
    return favorites.map((favorite) => this.toResponse(favorite));
  }
}
