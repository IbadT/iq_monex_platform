import { Injectable, BadRequestException, ConflictException } from '@nestjs/common';
import { AddActivityToUserDto, ActivityAction } from '@/users/dto/add-activity-to-user.dto';
import { ActivityProcessData } from '@/users/interfaces/activity.interface';
import { prisma } from '@/lib/prisma';
import { CacheService } from '@/cache/cacheService.service';
import { PrismaClient } from 'prisma/generated/client';

@Injectable()
export class ActivitiesService {
  constructor(private readonly cacheService: CacheService) {}

        async addUserActivity(userId: string, body: AddActivityToUserDto) {
          try {
            if (body.id) {
              await this.cacheService.del(`activities/users:${userId}`);
              await this.cacheService.del(`activities`);
              return await prisma.userActivity.create({
                data: {
                  userId,
                  activityId: body.id
                }
              })
            } else if (body.activity) {
              // Сначала проверим, существует ли активность с таким именем
              let activity = await prisma.activity.findFirst({
                where: { name: body.activity }
              });
              
              if (!activity) {
                // Если не существует, создаем новую
                activity = await prisma.activity.create({
                  data: {
                    name: body.activity
                  }
                });
              }
              
              // Очищаем кэш
              await this.cacheService.del(`activities/users:${userId}`);
              await this.cacheService.del(`activities`);
              
              try {
                return await prisma.userActivity.create({
                  data: {
                    userId,
                    activityId: activity.id
                  }
                });
              } catch (error) {
                if (error.code === 'P2002') {
                  throw new ConflictException('User already has this activity');
                }
                throw error;
              }
            }
      
            throw new BadRequestException('Activity id or activity name is required');
          } catch (error) {
            if (error.code === 'P2002') {
              throw new ConflictException('User already has this activity');
            }
            throw error;
          }
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
    tx: PrismaClient
  ): Promise<any> {
    switch (activity.action) {
      case ActivityAction.CREATE:
        return await this.handleCreateActivity(activity, userId, tx);
      
      case ActivityAction.UPDATE:
        return await this.handleUpdateActivity(activity, userId, tx);
      
      case ActivityAction.DELETE:
        return await this.handleDeleteActivity(activity, userId, tx);
      
      case ActivityAction.IGNORE:
        return null;
      
      default:
        throw new BadRequestException(`Unknown activity action: ${activity.action}`);
    }
  }

  private async handleCreateActivity(activity: AddActivityToUserDto, userId: string, tx: PrismaClient) {
    if (!activity.activity) {
      throw new BadRequestException('Activity name is required for CREATE action');
    }

    // Сначала проверим, существует ли активность с таким именем
    let activityRecord = await tx.activity.findFirst({
      where: { name: activity.activity }
    });
    
    if (!activityRecord) {
      // Если не существует, создаем новую
      activityRecord = await tx.activity.create({
        data: {
          name: activity.activity,
        },
      });
    }
    
    // Создаем связь пользователя с активностью
    try {
      await tx.userActivity.create({
        data: {
          userId: userId,
          activityId: activityRecord.id,
        },
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('User already has this activity');
      }
      throw error;
    }
  }

  private async handleUpdateActivity(activity: AddActivityToUserDto, userId: string, tx: PrismaClient) {
    if (!activity.id) {
      throw new BadRequestException('Activity ID is required for UPDATE action');
    }

    if (!activity.activity) {
      throw new BadRequestException('Activity name is required for UPDATE action');
    }

    // Проверяем, что активность существует
    const existingActivity = await tx.activity.findUnique({
      where: { id: activity.id },
    });

    if (!existingActivity) {
      throw new BadRequestException(`Activity with id ${activity.id} not found`);
    }

    // Обновляем активность
    try {
      await tx.activity.update({
        where: { id: activity.id },
        data: {
          name: activity.activity,
        },
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException(`Activity with name "${activity.activity}" already exists`);
      }
      throw error;
    }

    // Проверяем, есть ли связь с пользователем
    const currentUserActivity = await tx.userActivity.findUnique({
      where: {
        userId_activityId: {
          userId: userId,
          activityId: activity.id,
        },
      },
    });

    if (!currentUserActivity) {
      // Создаем связь пользователя с активностью
      await tx.userActivity.create({
        data: {
          userId: userId,
          activityId: activity.id,
        },
      });
    }
  }

  private async handleDeleteActivity(activity: AddActivityToUserDto, userId: string, tx: PrismaClient) {
    if (!activity.id) {
      throw new BadRequestException('Activity ID is required for DELETE action');
    }

    await tx.userActivity.delete({
      where: {
        userId_activityId: {
          userId: userId,
          activityId: activity.id,
        },
      },
    });
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
        userId
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
