import {
  FavoriteUserProfileResponseDto,
  UserProfileDto,
  UserDto,
  ActivityDto,
} from '../dto/response/favorite-user-profile-response.dto';

export class FavoriteUserMapper {
  static toResponse(favorite: any): FavoriteUserProfileResponseDto {
    const userProfile = favorite.targetUser?.profile
      ? new UserProfileDto(
          favorite.targetUser.profile.id || '',
          favorite.targetUser.profile.userId || '',
          favorite.targetUser.profile.legalEntityTypeId || 0,
          favorite.targetUser.profile.currencyId || 0,
          favorite.targetUser.profile.avatarUrl || null,
          favorite.targetUser.profile.phone || null,
          favorite.targetUser.profile.email || null,
          favorite.targetUser.profile.telegram || null,
          favorite.targetUser.profile.siteUrl || null,
          favorite.targetUser.profile.description || null,
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
