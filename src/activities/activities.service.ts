import { Injectable, BadRequestException, ConflictException } from '@nestjs/common';
import { AddActivityToUserDto, ActivityAction } from '@/users/dto/add-activity-to-user.dto';
import { ActivityProcessData } from '@/users/interfaces/activity.interface';
import { prisma } from '@/lib/prisma';
import { CacheService } from '@/cache/cacheService.service';

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
              const activity = await prisma.activity.create({
                data: {
                  name: body.activity
                }
              })
              // Очищаем кэш
              await this.cacheService.del(`activities/users:${userId}`);
              await this.cacheService.del(`activities`);
              return await prisma.userActivity.create({
                data: {
                  userId,
                  activityId: activity.id
                }
              })
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

    for (const activityDto of activities) {
      switch (activityDto.action) {
        case ActivityAction.CREATE:
          // Создаем новую активность
          if (!activityDto.activity) {
            throw new BadRequestException('Activity name is required for CREATE action');
          }

          const newActivity = await tx.activity.create({
            data: {
              name: activityDto.activity,
            },
          });

          // Создаем связь пользователя с активностью
          await tx.userActivity.create({
            data: {
              userId: userId,
              activityId: newActivity.id,
            },
          });
          break;

        case ActivityAction.UPDATE:
          // Обновляем существующую активность
          if (!activityDto.id) {
            throw new BadRequestException('Activity ID is required for UPDATE action');
          }

          if (!activityDto.activity) {
            throw new BadRequestException('Activity name is required for UPDATE action');
          }

          // Проверяем, что активность существует
          const existingActivity = await tx.activity.findUnique({
            where: { id: activityDto.id },
          });

          if (!existingActivity) {
            throw new BadRequestException(`Activity with id ${activityDto.id} not found`);
          }

          // Обновляем активность
          await tx.activity.update({
            where: { id: activityDto.id },
            data: {
              name: activityDto.activity,
            },
          });

          // Проверяем, есть ли связь с пользователем
          const existingUserActivity = await tx.userActivity.findUnique({
            where: {
              userId_activityId: {
                userId: userId,
                activityId: activityDto.id,
              },
            },
          });

          if (!existingUserActivity) {
            // Создаем связь пользователя с активностью
            await tx.userActivity.create({
              data: {
                userId: userId,
                activityId: activityDto.id,
              },
            });
          }
          break;

        case ActivityAction.DELETE:
          // Удаляем связь пользователя с активностью
          if (!activityDto.id) {
            throw new BadRequestException('Activity ID is required for DELETE action');
          }

          await tx.userActivity.delete({
            where: {
              userId_activityId: {
                userId: userId,
                activityId: activityDto.id,
              },
            },
          });
          break;

        case ActivityAction.IGNORE:
          // Пропускаем обработку
          break;

        default:
          throw new BadRequestException(`Unknown activity action: ${activityDto.action}`);
      }
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
