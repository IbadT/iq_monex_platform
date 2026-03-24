import { User } from '@sentry/nestjs';
import { ActivityEntity } from './activity.entity';

export class UserActivityEntity {
  id: string;
  userId: string;
  activityId: number;
  createdAt: Date;
  updatedAt: Date;

  // Relations
  user?: User;
  activity?: ActivityEntity;

  constructor(
    id: string,
    userId: string,
    activityId: number,
    createdAt: Date,
    updatedAt: Date,
  ) {
    this.id = id;
    this.userId = userId;
    this.activityId = activityId;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
