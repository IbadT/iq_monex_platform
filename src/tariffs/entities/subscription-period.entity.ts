export class SubscriptionPeriodEntity {
  id: string;
  subscriptionId: string;
  days: number;
  startAt: Date;
  endAt: Date;

  paymentId: string | null;

  createdAt: Date;

  constructor(
    id: string,
    subscriptionId: string,
    days: number,
    startAt: Date,
    endAt: Date,
    paymentId: string | null,
    createdAt: Date,
  ) {
    this.id = id;
    this.subscriptionId = subscriptionId;
    this.days = days;
    this.startAt = startAt;
    this.endAt = endAt;
    this.paymentId = paymentId;
    this.createdAt = createdAt;
  }
}
