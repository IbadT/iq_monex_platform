import {
  Injectable,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import {
  AddActivityToUserDto,
  ActivityAction,
} from '@/users/dto/add-activity-to-user.dto';
import { ActivityProcessData } from '@/users/interfaces/activity.interface';
import { prisma } from '@/lib/prisma';
import { CacheService } from '@/cache/cacheService.service';
import { PrismaClient } from 'prisma/generated/client';

@Injectable()
export class ActivitiesService {
  constructor(private readonly cacheService: CacheService) {}

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
      throw new BadRequestException('Activity name is required for CREATE action');
    }

    // Сначала проверим, существует ли активность с таким именем
    let activity = await tx.activity.findFirst({
      where: { name: body.activity },
    });

    if (!activity) {
      // Если не существует, создаем новую
      activity = await tx.activity.create({
        data: {
          name: body.activity,
        },
      });
    }

    // Очищаем кэш
    await this.cacheService.del(`activities/users:${userId}`);
    await this.cacheService.del(`activities`);

    try {
      return await tx.userActivity.create({
        data: {
          userId,
          activityId: activity.id,
        },
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('User already has this activity');
      }
      throw error;
    }
  }

  private async handleBindActivity(
    body: AddActivityToUserDto,
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
    body: AddActivityToUserDto,
    userId: string,
    tx: PrismaClient,
  ) {
    if (!body.id) {
      throw new BadRequestException('Activity ID is required for UPDATE action');
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

    // Если указано новое название активности, обновляем или создаем активность
    if (body.activity) {
      let activity = await tx.activity.findFirst({
        where: { name: body.activity },
      });

      if (!activity) {
        activity = await tx.activity.create({
          data: { name: body.activity },
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

    throw new BadRequestException('Activity name is required for UPDATE action');
  }

  private async handleDeleteActivity(
    body: AddActivityToUserDto,
    userId: string,
    tx: PrismaClient,
  ) {
    if (!body.id) {
      throw new BadRequestException('Activity ID is required for DELETE action');
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

    for (const activity of activities) {
      await this.processActivityAction(activity, userId, tx);
    }
  }

  private async processActivityAction(
    activity: AddActivityToUserDto,
    userId: string,
    tx: PrismaClient,
  ): Promise<any> {
    switch (activity.action) {
      case ActivityAction.CREATE:
        return await this.handleCreateActivity(activity, userId, tx);

      case ActivityAction.BIND:
        return await this.handleBindActivity(activity, userId, tx);

      case ActivityAction.UPDATE:
        return await this.handleUpdateActivity(activity, userId, tx);

      case ActivityAction.DELETE:
        return await this.handleDeleteActivity(activity, userId, tx);

      case ActivityAction.IGNORE:
        return null;

      default:
        throw new BadRequestException(
          `Unknown activity action: ${activity.action}`,
        );
    }
  }

  async getActivities() {
    const cacheKey = `activities`;
    const cachedData = await this.cacheService.get(cacheKey);
    if (cachedData) return cachedData;

    const activities = await prisma.activity.findMany();
    await this.cacheService.set({
      baseKey: cacheKey,
      ttl: 3600,
      value: activities,
    });

    return activities;
  }

  async getUserActivities(userId: string) {
    const cacheKey = `activities/users:${userId}`;
    const cachedData = await this.cacheService.get(cacheKey);
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

    await this.cacheService.set({
      baseKey: cacheKey,
      ttl: 3600,
      value: activities,
    });

    return activities;
  }
}
