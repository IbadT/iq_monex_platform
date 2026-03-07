export class CurrenciesResponseDto {
  id: number;
  symbol: string;
  name: string;

  constructor(id: number, symbol: string, name: string) {
    this.id = id;
    this.symbol = symbol;
    this.name = name;
  }
}
