import { Decimal } from '@prisma/client/runtime/index-browser';
import { SubscriptionEntity } from './subscription.entity';

export class TariffEntity {
  id: string;
  code: string;
  name: string;
  description: string;
  baseSlots: number;
  baseDays: number;
  maxTotalDays: number;
  isExtendable: boolean;
  price: Decimal;
  currencyCode: string;
  isActive: boolean;

  subscriptions?: SubscriptionEntity[] | undefined;

  createdAt: Date;
  updatedAt: Date;

  constructor(
    id: string,
    code: string,
    name: string,
    description: string,
    baseSlots: number,
    baseDays: number,
    maxTotalDays: number,
    isExtendable: boolean,
    price: Decimal,
    currencyCode: string,
    isActive: boolean,
    createdAt: Date,
    updatedAt: Date,
    subscriptions?: SubscriptionEntity[] | undefined,
  ) {
    this.id = id;
    this.code = code;
    this.name = name;
    this.description = description;
    this.baseSlots = baseSlots;
    this.baseDays = baseDays;
    this.maxTotalDays = maxTotalDays;
    this.isExtendable = isExtendable;
    this.price = price;
    this.currencyCode = currencyCode;
    this.isActive = isActive;
    this.subscriptions = subscriptions;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
