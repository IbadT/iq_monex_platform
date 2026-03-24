import { Language } from '@/dictionaries/dto/request/get-currency.dto';
import { JsonValue } from '@prisma/client/runtime/client';
import { LegalEntityResponseDto } from '../dto/response/legal-entity.response.dto';

export interface LegalEntityTypeData {
  code: string;
  name: string;
}

// Record<Language, LegalEntityTypeData>
export type LegalEntityTypeFullData = Record<Language, LegalEntityTypeData>;

export class LegalEntityTypeFromPromise {
  id: number;
  data: JsonValue;

  constructor(id: number, data: JsonValue) {
    this.id = id;
    this.data = data;
  }
}

export class LegalEntityType {
  constructor(
    public id: number,
    public data: LegalEntityTypeFullData,
  ) {}

  static fromPromise(prismaData: LegalEntityTypeFromPromise): LegalEntityType {
    // Приведение через unknown для обхода проверки типов
    const data = prismaData.data as unknown as LegalEntityTypeFullData;
    return new LegalEntityType(prismaData.id, data);
  }

  toResponse(lang: Language = Language.RU): LegalEntityResponseDto {
    const langData = this.data[lang] || this.data[Language.RU];
    return new LegalEntityResponseDto(this.id, langData.code, langData.name);
  }
}
