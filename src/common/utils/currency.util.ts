import { CurrencyEnum } from 'nestjs-yookassa';
import { VALUT_CODE } from '@/dictionaries/enums/valut-code.enum';

/**
 * Конвертирует код валюты из VALUT_CODE в CurrencyEnum для YooKassa
 * @param currency - код валюты (например, 'RUB', 'USD', 'EUR')
 * @returns CurrencyEnum для YooKassa
 */
export function convertCurrencyToYookassa(currency: string): CurrencyEnum {
  switch (currency) {
    case VALUT_CODE.USD:
      return CurrencyEnum.USD;
    case VALUT_CODE.EUR:
      return CurrencyEnum.EUR;
    case VALUT_CODE.CNY:
      return CurrencyEnum.CNY;
    case VALUT_CODE.KZT:
      return CurrencyEnum.KZT;
    case VALUT_CODE.BYN:
      return CurrencyEnum.BYN;
    case VALUT_CODE.RUB:
    default:
      return CurrencyEnum.RUB;
  }
}

/**
 * Проверяет является ли код валюты поддерживаемым
 * @param currency - код валюты
 * @returns true если валюта поддерживается
 */
export function isSupportedCurrency(currency: string): boolean {
  return Object.values(VALUT_CODE).includes(currency as VALUT_CODE);
}

/**
 * Возвращает список поддерживаемых валют
 * @returns массив кодов валют
 */
export function getSupportedCurrencies(): string[] {
  return Object.values(VALUT_CODE);
}
