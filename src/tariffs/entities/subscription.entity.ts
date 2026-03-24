import { SubscriptionPeriodEntity } from './subscription-period.entity';
import { UserSlotEntity } from '../../subscription/entities/user-slot.entity';

export class SubscriptionEntity {
  id: string;
  userId: string;
  tariffId: string;
  isActive: boolean;
  totalSlots: number;

  periods: SubscriptionPeriodEntity[];

  userSlots: UserSlotEntity[];

  createdAt: Date;
  updatedAt: Date;

  constructor(
    id: string,
    userId: string,
    tariffId: string,
    isActive: boolean,
    totalSlots: number,
    periods: SubscriptionPeriodEntity[],
    userSlots: UserSlotEntity[],
    createdAt: Date,
    updatedAt: Date,
  ) {
    this.id = id;
    this.userId = userId;
    this.tariffId = tariffId;
    this.isActive = isActive;
    this.totalSlots = totalSlots;
    this.periods = periods;
    this.userSlots = userSlots;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
