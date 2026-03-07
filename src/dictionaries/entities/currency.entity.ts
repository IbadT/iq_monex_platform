export class Currency {
  id: number;
  symbol: string;
  code: string;
  name: Record<string, string>;

  static fromPrisma(currency: Currency): Currency {
    return new Currency(
      currency.id,
      currency.symbol,
      currency.code,
      currency.name,
    );
  }

  toResponse(lang: string = 'ru') {
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
