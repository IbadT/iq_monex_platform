import { LegalEntityType } from '@/categories/entities/legal-entity-type.entity';
import { CurrencyEntity } from '@/dictionaries/entities/currency.entity';

export class ProfileEntity {
  id: string;
  userId: string;
  legalEntityTypeId: number;
  currencyId: number;
  avatarUrl: string | null;
  phone: string | null;
  email: string | null;
  telegram: string | null;
  siteUrl: string | null;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
  legalEntityType: LegalEntityType;
  currency: CurrencyEntity;

  constructor(
    id: string,
    userId: string,
    legalEntityTypeId: number,
    currencyId: number,
    avatarUrl: string | null,
    phone: string | null,
    email: string | null,
    telegram: string | null,
    siteUrl: string | null,
    description: string | null,
    createdAt: Date,
    updatedAt: Date,
    legalEntityType: LegalEntityType,
    currency: CurrencyEntity,
  ) {
    this.id = id;
    this.userId = userId;
    this.legalEntityTypeId = legalEntityTypeId;
    this.currencyId = currencyId;
    this.avatarUrl = avatarUrl;
    this.phone = phone;
    this.email = email;
    this.telegram = telegram;
    this.siteUrl = siteUrl;
    this.description = description;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.legalEntityType = legalEntityType;
    this.currency = currency;
  }
}
