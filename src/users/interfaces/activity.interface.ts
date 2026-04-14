import { PrismaClient } from '../../../prisma/generated/client';
import { AddActivityToUserDto } from '../dto/add-activity-to-user.dto';

export interface ActivityProcessData {
  userId: string;
  activities: AddActivityToUserDto[];
  tx: PrismaClient;
}
