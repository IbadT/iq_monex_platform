export enum VALUT_CODE {
  RUB = 'RUB',
  BYN = 'BYN',
  KZT = 'KZT',
  USD = 'USD',
  EUR = 'EUR',
  CNY = 'CNY',
}

export const CURRENCY_SYMBOL: Record<VALUT_CODE, string> = {
  [VALUT_CODE.RUB]: '₽',
  [VALUT_CODE.USD]: '$',
  [VALUT_CODE.EUR]: '€',
  [VALUT_CODE.CNY]: '¥',
  [VALUT_CODE.KZT]: '₸',
  [VALUT_CODE.BYN]: 'Br',
};
