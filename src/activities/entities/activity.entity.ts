import { UserActivityEntity } from './user-activity.entity';

export class ActivityEntity {
  id: number;
  name: string;

  // Relation
  userActivities?: UserActivityEntity[];

  createdAt: Date;
  updatedAt: Date;

  //   toResponse(): Pick<ActivityEntity, 'id' | 'name'> {
  //     return {
  //       id: this.id,
  //       name: this.name,
  //     };
  //   }

  constructor(id: number, name: string, createdAt: Date, updatedAt: Date) {
    this.id = id;
    this.name = name;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
