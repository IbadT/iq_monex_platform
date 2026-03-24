// listing.mapper.ts
// import { ListingResposeDto } from './dto/response/listing-response.dto';
import { CategoryResponseDto } from '@/categories/dto/response/categories-response.dto';
import { CurrenciesResponseDto } from '@/dictionaries/dto/response/currencies-response.dto';
import { MapLocationResponseDto } from '@/map_locations/dto/response/map-enterprice.response.dto';
import { SpecificationResponseDto } from '@/attributes/dto/response/specification.dto';
import { ListingResposeDto } from '../dto/response/listing-response.dto';

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
            loc.userId,
            loc.listingId,
            loc.address,
            loc.latitude,
            loc.longitude,
            loc.type,
          ),
      ) || [];

    // Преобразуем спецификации
    const specifications =
      listing.specifications?.map(
        (spec: any) =>
          new SpecificationResponseDto(spec.id, spec.specificationId),
      ) || [];

    // Разделяем файлы
    const photos = listing.files?.filter((f: any) => f.kind === 'PHOTO') || [];
    const files =
      listing.files?.filter((f: any) => f.kind === 'DOCUMENT') || [];

    return new ListingResposeDto(
      listing.id,
      listing.categoryId,
      listing.title,
      listing.description,
      listing.price,
      listing.condition,
      listing.status,
      listing.viewsCount,
      listing.favoritesCount,
      category,
      currency, // Может быть null
      listing.priceUnit,
      photos,
      files, // Или как нужно в DTO
      locations,
      specifications,
    );
  }

  static toResponseList(listings: any[]): ListingResposeDto[] {
    return listings.map((l) => this.toResponse(l));
  }
}
