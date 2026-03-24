import { TariffResponseDto } from '../dto/response/tariff-response.dto';
import { TariffEntity } from '../entities/tariff.entity';

export class TariffMapper {
  static toResponse = (tariff: TariffEntity): TariffResponseDto => {
    return new TariffResponseDto(
      tariff.id,
      tariff.code,
      tariff.name,
      tariff.description,
      tariff.baseSlots,
      tariff.baseDays,
      tariff.maxTotalDays,
      tariff.isExtendable,
      +tariff.price,
      tariff.currencyCode,
      tariff.isActive,
    );
  };

  static toResponseList = (tariffs: TariffEntity[]): TariffResponseDto[] => {
    return tariffs.map(
      (tariff) =>
        new TariffResponseDto(
          tariff.id,
          tariff.code,
          tariff.name,
          tariff.description,
          tariff.baseSlots,
          tariff.baseDays,
          tariff.maxTotalDays,
          tariff.isExtendable,
          +tariff.price,
          tariff.currencyCode,
          tariff.isActive,
        ),
    );
  };
}
