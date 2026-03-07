import { IsEnum, IsOptional } from 'class-validator';

// export type Language = 'ru' | 'en' | 'kz';
// export const validLanguages: Language[] = ['ru', 'en', 'kz'];

export enum Language {
  RU = 'ru',
  EN = 'en',
  KZ = 'kz',
}

// Для валидации списка значений
export const LanguageValues = Object.values(Language);

export class GetCurrencyDto {
  @IsEnum(Language, {
    message: 'Язык должен быть ru, en или kz',
  })
  @IsOptional()
  lang?: Language = Language.RU;
}
