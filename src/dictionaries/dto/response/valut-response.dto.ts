import { VALUT_CODE } from '@/dictionaries/enums/valut-code.enum';
import { Decimal } from '@prisma/client/runtime/client';

// Тип для одной валюты
export interface CurrencyDetails {
  ID: string;
  NumCode: string;
  CharCode: string;
  Nominal: number;
  Name: string;
  Value: number;
  Previous: number;
}

// Тип для ответа ЦБ РФ
export interface CbrResponse {
  Date: string;
  PreviousDate: string;
  PreviousURL: string;
  Timestamp: string;
  Valute: Record<string, CurrencyDetails>;
}

// Тип для результата с курсами
export type CurrencyRates = Record<VALUT_CODE, number>;

// Тип для сохранения в БД
export interface CurrencyRateEntity {
  id: number;
  code: string;
  nominal: number;
  rate: Decimal;
  //   name: string;
  //   value: number;
  date: Date;
}
