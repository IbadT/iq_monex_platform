import { UserActivityEntity } from './user-activity.entity';

export class ActivityEntity {
  id: number;
  name: string;
  groupId: number;
  groupName?: string;

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

  constructor(
    id: number,
    name: string,
    groupId: number,
    createdAt: Date,
    updatedAt: Date,
    groupName?: string,
  ) {
    this.id = id;
    this.name = name;
    this.groupId = groupId;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    if (groupName !== undefined) {
      this.groupName = groupName;
    }
  }
}
