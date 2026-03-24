import { Decimal } from '@prisma/client/runtime/index-browser';
import { UserSlotEntity } from './user-slot.entity';

export class SlotPackageEntity {
  id: string;

  userId: string;

  slots: number;

  price: Decimal;

  expiresAt: Date;

  isActive: boolean;

  paymentId: string | null;

  userSlots?: UserSlotEntity[] | null;

  createdAt: Date;

  constructor(
    id: string,
    userId: string,
    slots: number,
    price: Decimal,
    expiresAt: Date,
    isActive: boolean,
    paymentId: string | null,
    createdAt: Date,
    userSlots?: UserSlotEntity[] | null,
  ) {
    this.id = id;
    this.userId = userId;
    this.slots = slots;
    this.price = price;
    this.expiresAt = expiresAt;
    this.isActive = isActive;
    this.paymentId = paymentId;
    this.createdAt = createdAt;
    if (userSlots !== undefined) {
      this.userSlots = userSlots;
    }
  }
}
