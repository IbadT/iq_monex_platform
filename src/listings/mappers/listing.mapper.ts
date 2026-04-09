import { CategoryResponseDto } from '@/categories/dto/response/categories-response.dto';
import { CurrenciesResponseDto } from '@/dictionaries/dto/response/currencies-response.dto';
import { MapLocationResponseDto } from '@/map_locations/dto/response/map-enterprice.response.dto';
import { ListingResposeDto } from '../dto/response/listing-response.dto';
import { ListingSpecificationResponseDto } from '../dto/response/listing-specification-response.dto';
import { ListingFileResponseDto } from '../dto/response/listing-file-response.dto';
import { ListingContactResponseDto } from '../dto/response/listing-contact-response.dto';
import { ListingSubscriptionResponseDto } from '../dto/response/listing-subscription-response.dto';
import { UserListingResponseDto } from '../dto/response/user-listing-response.dto';

export class ListingMapper {
  // static toResponse(listing: any): ListingResposeDto {
    static toResponse(
    listing: any,
    contactData?: { phone: string | null; email: string | null } | null,
    promoData?: { subscriptionStartDate: Date | null; promoEndDate: Date | null } | null,
    isFavorite?: boolean,
  ): ListingResposeDto {

    // Преобразуем категории (все 3 уровня)
    const category = listing.category
      ? new CategoryResponseDto(listing.category.id, listing.category.name)
      : null;
    const subcategory = listing.subcategory
      ? new CategoryResponseDto(listing.subcategory.id, listing.subcategory.name)
      : null;
    const subsubcategory = listing.subsubcategory
      ? new CategoryResponseDto(listing.subsubcategory.id, listing.subsubcategory.name)
      : null;

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

    const locations: MapLocationResponseDto[] =
      listing.locations?.map(
        (loc: any) =>
          new MapLocationResponseDto(
            loc.id,
            loc.type,
            loc.address,
            loc.latitude,
            loc.longitude,
            loc.country,
            loc.city,
            loc.userId,
            loc.listingId,
          ),
      ) || [];

    const specifications: ListingSpecificationResponseDto[] =
      listing.specifications?.map(
        (spec: any) =>
          new ListingSpecificationResponseDto(
            spec.specificationId,
            spec.specification?.name?.ru || spec.specification?.name || 'Unknown',
            spec.value,
          ),
      ) || [];

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

    // Формируем контакты для объявления (данные приходят из отдельного запроса)
    let contacts: ListingContactResponseDto | null = null;
    if (listing.contactId && listing.contactType && contactData) {
      contacts = new ListingContactResponseDto(
        listing.contactId,
        contactData.phone,
        contactData.email,
        listing.contactType,
      );
    }

    // Формируем данные подписки из promoData или создаем null
    const subscription = promoData
      ? new ListingSubscriptionResponseDto(
          promoData.subscriptionStartDate,
          promoData.promoEndDate,
        )
      : new ListingSubscriptionResponseDto(null, null);

    return new ListingResposeDto(
      listing.id,
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
      subcategory,
      subsubcategory,
      currency,
      listing.priceUnit,
      files,
      images,
      locations,
      specifications,
      user,
      contacts,
      subscription,
      isFavorite ?? false,
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
