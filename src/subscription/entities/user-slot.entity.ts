import { ListingSlotEntity } from './listing-slot.entity';

export class UserSlotEntity {
  id: string;
  userId: string;

  slotIndex: number;

  sourceType: string; // TODO: добавить enum
  sourceId: string;
  createdAt: Date;
  expiresAt: Date;

  listingSlot: ListingSlotEntity | null;

  slotPackageId: string | null;
  subscriptionId: string | null;

  constructor(
    id: string,
    userId: string,
    slotIndex: number,
    sourceType: string,
    sourceId: string,
    createdAt: Date,
    expiresAt: Date,
    listingSlot: ListingSlotEntity | null,
    slotPackageId: string | null,
    subscriptionId: string | null,
  ) {
    this.id = id;
    this.userId = userId;
    this.slotIndex = slotIndex;
    this.sourceType = sourceType;
    this.sourceId = sourceId;
    this.createdAt = createdAt;
    this.expiresAt = expiresAt;
    this.listingSlot = listingSlot;
    this.slotPackageId = slotPackageId;
    this.subscriptionId = subscriptionId;
  }
}
