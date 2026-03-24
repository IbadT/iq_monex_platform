import { CurrenciesResponseDto } from '../dto/response/currencies-response.dto';

export class CurrencyEntity {
  id: number;
  symbol: string;
  code: string;
  name: Record<string, string>;

  static fromPrisma(currency: CurrencyEntity): CurrencyEntity {
    return new CurrencyEntity(
      currency.id,
      currency.symbol,
      currency.code,
      typeof currency.name === 'string'
        ? JSON.parse(currency.name)
        : currency.name,
    );
  }

  toResponse(lang: string = 'ru'): CurrenciesResponseDto {
    return {
      id: this.id,
      symbol: this.symbol,
      code: this.code,
      name: this.name[lang] || this.name['ru'],
    };
  }

  constructor(
    id: number,
    symbol: string,
    code: string,
    name: Record<string, string>,
  ) {
    this.id = id;
    this.symbol = symbol;
    this.code = code;
    this.name = name;
  }
}
