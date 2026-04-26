import { PrismaClient } from '../../../prisma/generated/client';
import { UpdateUserActivityDto } from '../dto/update-user-activity.dto';

export interface ActivityProcessData {
  userId: string;
  activities: UpdateUserActivityDto[];
  tx: PrismaClient;
}
