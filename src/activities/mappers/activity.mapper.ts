import { ActivityResponseDto } from '../dto/response/activity-response.dto';
import { ActivityEntity } from '../entities/activity.entity';

export class ActivityMapper {
  static fromEntityToDto(activity: ActivityEntity): ActivityResponseDto {
    return new ActivityResponseDto(
      activity.id,
      activity.name,
      activity.groupId,
      activity.groupName,
    );
  }

  static fromEntityListToDto(
    activities: ActivityEntity[],
  ): ActivityResponseDto[] {
    return activities.map((activity) => this.fromEntityToDto(activity));
  }
}
