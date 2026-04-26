import {
  Injectable,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import {
  UpdateUserActivityDto,
  UpdateActivityAction,
} from '@/users/dto/update-user-activity.dto';
import {
  AddActivityToUserDto,
  ActivityAction,
} from '@/users/dto/add-activity-to-user.dto';
import { ActivityProcessData } from '@/users/interfaces/activity.interface';
import { prisma } from '@/lib/prisma';
import { CacheService } from '@/cache/cacheService.service';
import { PrismaClient } from '../../prisma/generated/client';
import {
  ActivityGroupResponseDto,
  ActivityInGroupDto,
} from './dto/response/activity-group-response.dto';
import { UserActivityResponseDto } from './dto/response/user-activity.response.dto';
import { AppLogger } from '@/common/logger/logger.service';

@Injectable()
export class ActivitiesService {
  constructor(
    private readonly cacheService: CacheService,
    private readonly logger: AppLogger,
  ) {}

  async addUserActivity(userId: string, body: AddActivityToUserDto) {
    try {
      switch (body.action) {
        case ActivityAction.CREATE:
          return await this.handleCreateActivity(body, userId, prisma);

        case ActivityAction.BIND:
          return await this.handleBindActivity(body, userId, prisma);

        case ActivityAction.UPDATE:
          return await this.handleUpdateActivity(body, userId, prisma);

        case ActivityAction.DELETE:
          return await this.handleDeleteActivity(body, userId, prisma);

        case ActivityAction.IGNORE:
          return null;

        default:
          throw new BadRequestException(`Unknown action: ${body.action}`);
      }
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('User already has this activity');
      }
      throw error;
    }
  }

  private async handleCreateActivity(
    body: AddActivityToUserDto,
    userId: string,
    tx: PrismaClient,
  ) {
    if (!body.activity) {
      throw new BadRequestException(
        'Activity name is required for CREATE action',
      );
    }

    this.logger.debug(
      `[handleCreateActivity] Creating activity: ${body.activity} for user ${userId}`,
    );

    // Сначала проверим, существует ли активность с таким именем
    let activity = await tx.activity.findFirst({
      where: { name: body.activity },
    });

    if (!activity) {
      // Если не существует, создаем новую в группе "Прочее" (id=99)
      // Генерируем ID в диапазоне 9000+ для кастомных активностей
      const maxCustomActivity = await tx.activity.findFirst({
        where: { groupId: 99 },
        orderBy: { id: 'desc' },
      });
      const newId = maxCustomActivity ? maxCustomActivity.id + 1 : 9001;

      activity = await tx.activity.create({
        data: {
          id: newId,
          name: body.activity,
          groupId: 99, // Группа "Прочее"
        },
      });
      this.logger.debug(
        `[handleCreateActivity] Created new activity: ${activity.id} in group 99`,
      );
    } else {
      this.logger.debug(
        `[handleCreateActivity] Found existing activity: ${activity.id}`,
      );
    }

    // Проверяем сколько файлов есть перед созданием userActivity
    const filesBeforeActivity = await tx.file.count({
      where: { userId },
    });
    this.logger.log(
      `[handleCreateActivity] Files before userActivity creation: ${filesBeforeActivity}`,
    );

    // Очищаем кэш
    await this.cacheService.del(`activities/users:${userId}`);
    await this.cacheService.del(`activities`);

    try {
      const result = await tx.userActivity.create({
        data: {
          userId,
          activityId: activity.id,
        },
      });

      // Проверяем сколько файлов осталось после создания userActivity
      const filesAfterActivity = await tx.file.count({
        where: { userId },
      });
      this.logger.log(
        `[handleCreateActivity] Files after userActivity creation: ${filesAfterActivity}`,
      );

      return result;
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('User already has this activity');
      }
      if (error instanceof Error) {
        this.logger.error(
          `[handleCreateActivity] ERROR: ${error.message}`,
          error.stack,
        );
      }
      throw error;
    }
  }

  private async handleBindActivity(
    body: UpdateUserActivityDto | AddActivityToUserDto,
    userId: string,
    tx: PrismaClient,
  ) {
    if (!body.id) {
      throw new BadRequestException('Activity ID is required for BIND action');
    }

    // Проверяем существование активности
    const activity = await tx.activity.findUnique({
      where: { id: body.id },
    });

    if (!activity) {
      throw new BadRequestException(`Activity with ID ${body.id} not found`);
    }

    // Очищаем кэш
    await this.cacheService.del(`activities/users:${userId}`);
    await this.cacheService.del(`activities`);

    try {
      return await tx.userActivity.create({
        data: {
          userId,
          activityId: body.id,
        },
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('User already has this activity');
      }
      throw error;
    }
  }

  private async handleUpdateActivity(
    body: UpdateUserActivityDto | AddActivityToUserDto,
    userId: string,
    tx: PrismaClient,
  ) {
    if (!body.id) {
      throw new BadRequestException(
        'Activity ID is required for UPDATE action',
      );
    }

    // Находим существующую связь пользователя с активностью
    const userActivity = await tx.userActivity.findFirst({
      where: {
        userId,
        activityId: body.id,
      },
    });

    if (!userActivity) {
      throw new BadRequestException('User activity not found');
    }

    // Если указано новое название активности (только для AddActivityToUserDto),
    // обновляем или создаем активность
    if ('activity' in body && body.activity) {
      let activity = await tx.activity.findFirst({
        where: { name: body.activity },
      });

      if (!activity) {
        // Создаем новую активность в группе "Прочее" (id=99)
        const maxCustomActivity = await tx.activity.findFirst({
          where: { groupId: 99 },
          orderBy: { id: 'desc' },
        });
        const newId = maxCustomActivity ? maxCustomActivity.id + 1 : 9001;

        activity = await tx.activity.create({
          data: {
            id: newId,
            name: body.activity,
            groupId: 99,
          },
        });
      }

      // Очищаем кэш
      await this.cacheService.del(`activities/users:${userId}`);
      await this.cacheService.del(`activities`);

      return await tx.userActivity.update({
        where: { id: userActivity.id },
        data: { activityId: activity.id },
      });
    }

    // Для UpdateUserActivityDto просто проверяем существование связи
    return userActivity;
  }

  private async handleDeleteActivity(
    body: UpdateUserActivityDto | AddActivityToUserDto,
    userId: string,
    tx: PrismaClient,
  ) {
    if (!body.id) {
      throw new BadRequestException(
        'Activity ID is required for DELETE action',
      );
    }

    // Находим и удаляем связь пользователя с активностью
    const userActivity = await tx.userActivity.findFirst({
      where: {
        userId,
        activityId: body.id,
      },
    });

    if (!userActivity) {
      throw new BadRequestException('User activity not found');
    }

    // Очищаем кэш
    await this.cacheService.del(`activities/users:${userId}`);
    await this.cacheService.del(`activities`);

    return await tx.userActivity.delete({
      where: { id: userActivity.id },
    });
  }

  async processActivities(data: ActivityProcessData) {
    const { userId, activities, tx } = data;

    if (!activities || activities.length === 0) {
      return;
    }

    try {
      for (const activity of activities) {
        await this.processActivityAction(activity, userId, tx);
      }
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error(
          `[Activities] ERROR in processActivities: ${error.message}`,
          error.stack,
        );
      }
      throw error;
    }
  }

  private async processActivityAction(
    activity: UpdateUserActivityDto,
    userId: string,
    tx: PrismaClient,
  ): Promise<any> {
    switch (activity.action) {
      case UpdateActivityAction.CREATE:
        return await this.handleBindActivity(activity, userId, tx);

      case UpdateActivityAction.UPDATE:
        return await this.handleUpdateActivity(activity, userId, tx);

      case UpdateActivityAction.DELETE:
        return await this.handleDeleteActivity(activity, userId, tx);

      case UpdateActivityAction.IGNORE:
        return null;

      default:
        throw new BadRequestException(
          `Unknown activity action: ${activity.action}`,
        );
    }
  }

  async getActivityGroups() {
    const cacheKey = `activity-groups`;
    const cachedData = await this.cacheService.get(cacheKey);
    if (cachedData) return cachedData;

    const groups = await prisma.activityGroup.findMany({
      include: { activities: true },
      orderBy: { id: 'asc' },
    });

    await this.cacheService.set({
      baseKey: cacheKey,
      ttl: 3600,
      value: groups,
    });

    return groups;
  }

  async getActivities(): Promise<ActivityGroupResponseDto[]> {
    const cacheKey = `activities`;
    const cachedData =
      await this.cacheService.get<ActivityGroupResponseDto[]>(cacheKey);
    if (cachedData) return cachedData;

    const groups = await prisma.activityGroup.findMany({
      include: { activities: true },
      orderBy: { id: 'asc' },
    });

    const response = groups.map(
      (group) =>
        new ActivityGroupResponseDto(
          group.id,
          group.name,
          group.activities.map(
            (activity) =>
              new ActivityInGroupDto(
                activity.id,
                activity.name,
                activity.groupId,
              ),
          ),
        ),
    );

    await this.cacheService.set({
      baseKey: cacheKey,
      ttl: 3600,
      value: response,
    });

    return response;
  }

  async getUserActivities(userId: string): Promise<UserActivityResponseDto[]> {
    const cacheKey = `activities/users:${userId}`;
    const cachedData =
      await this.cacheService.get<UserActivityResponseDto[]>(cacheKey);
    if (cachedData) return cachedData;

    const activities = await prisma.userActivity.findMany({
      where: {
        userId,
      },
      include: {
        activity: true,
      },
      orderBy: {
        activity: {
          name: 'asc',
        },
      },
    });

    const response = activities.map(
      (userActivity) =>
        new UserActivityResponseDto(
          userActivity.id,
          userActivity.userId,
          userActivity.activityId,
          userActivity.activity,
        ),
    );

    await this.cacheService.set({
      baseKey: cacheKey,
      ttl: 3600,
      value: response,
    });

    return response;
  }
}
