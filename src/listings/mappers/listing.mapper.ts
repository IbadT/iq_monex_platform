import { CategoryResponseDto } from '@/categories/dto/response/categories-response.dto';
import { CurrenciesResponseDto } from '@/dictionaries/dto/response/currencies-response.dto';
import { MapLocationResponseDto } from '@/map_locations/dto/response/map-enterprice.response.dto';
import { SpecificationResponseDto } from '@/attributes/dto/response/specification.dto';
import { ListingResposeDto } from '../dto/response/listing-response.dto';
import { ListingFileResponseDto } from '../dto/response/listing-file-response.dto';
import { UserListingResponseDto } from '../dto/response/user-listing-response.dto';

export class ListingMapper {
  static toResponse(listing: any): ListingResposeDto {
    // Преобразуем категорию
    const category = new CategoryResponseDto(
      listing.category.id,
      listing.category.name,
    );

    // Преобразуем валюту (с проверкой на null)
    let currency: CurrenciesResponseDto | null = null;
    if (listing.currency) {
      currency = new CurrenciesResponseDto(
        listing.currency.id,
        listing.currency.symbol,
        listing.currency.name,
        listing.currency.code,
      );
    }

    // Преобразуем локации
    const locations =
      listing.locations?.map(
        (loc: any) =>
          new MapLocationResponseDto(
            loc.id,
            loc.type,
            loc.address,
            loc.latitude,
            loc.longitude,
            loc.userId,
            loc.listingId,
          ),
      ) || [];

    // Преобразуем спецификации
    const specifications =
      listing.specifications?.map(
        (spec: any) =>
          new SpecificationResponseDto(spec.id, spec.specificationId),
      ) || [];

    // Разделяем файлы
    // const photos = listing.files?.filter((f: any) => f.kind === 'PHOTO') || [];
    // const files =
    //   listing.files?.filter((f: any) => f.kind === 'DOCUMENT') || [];

    const images: ListingFileResponseDto[] =
      listing.files
        ?.filter((f: any) => f.kind === 'PHOTO')
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
      listing.files
        ?.filter((f: any) => f.kind === 'DOCUMENT')
        .map(
          (f: any) =>
            new ListingFileResponseDto(f.id, f.url, f.fileType, false),
        ) || [];

    const user = ListingMapper.userListingToResponse(listing.user);

    return new ListingResposeDto(
      listing.id,
      listing.subcategoryId,
      listing.title,
      listing.description,
      listing.price,
      listing.condition,
      listing.status,
      listing.rating,
      listing.commentsCount || 0,
      listing.viewsCount,
      listing.favoritesCount,
      category,
      currency,
      listing.priceUnit,
      files,
      images,
      locations,
      specifications,
      user,
    );
  }

  static toResponseList(listings: any[]): ListingResposeDto[] {
    return listings.map((l) => this.toResponse(l));
  }

  static userListingToResponse(user: any): UserListingResponseDto {
    return {
      id: user.id,
      name: user.name,
      avatar: user.files && user.files.length > 0 ? user.files[0].url : null,
    };
  }
}
