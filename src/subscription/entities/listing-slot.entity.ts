export class ListingSlotEntity {
  id: string;
  listingId: string;
  userSlotId: string;
  assignedAt: Date;
  releasedAt: Date | null;
  releaseReason: string | null;
  createdAt: Date;
  updatedAt: Date;

  constructor(
    id: string,
    listingId: string,
    userSlotId: string,
    assignedAt: Date,
    releasedAt: Date | null,
    releaseReason: string | null,
    createdAt: Date,
    updatedAt: Date,
  ) {
    this.id = id;
    this.listingId = listingId;
    this.userSlotId = userSlotId;
    this.assignedAt = assignedAt;
    this.releasedAt = releasedAt;
    this.releaseReason = releaseReason;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
