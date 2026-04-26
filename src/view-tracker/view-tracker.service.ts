import { Injectable } from '@nestjs/common';
import { prisma } from '@/lib/prisma';
import { ViewTargetType } from 'prisma/generated/enums';
// import { ViewTargetType } from '../../../prisma/generated/enums';

@Injectable()
export class ViewTrackerService {
  /**
   * Проверяет, был ли уже зафиксирован просмотр с данного IP для цели.
   * Если нет — создает запись и возвращает true (нужно инкрементировать счетчик).
   * Если да — возвращает false (просмотр уже засчитан, не инкрементировать).
   */
  async trackView(
    targetType: ViewTargetType,
    targetId: string,
    ipAddress: string,
    userAgent?: string,
  ): Promise<boolean> {
    // Проверяем, был ли уже просмотр с этого IP
    const alreadyViewed = await this.hasViewed(targetType, targetId, ipAddress);

    if (alreadyViewed) {
      // Уже просматривал — не увеличиваем счетчик
      return false;
    }

    // Создаем запись о просмотре
    await prisma.viewTracker.create({
      data: {
        targetType,
        targetId,
        ipAddress,
        userAgent: userAgent?.substring(0, 500) || null, // Ограничиваем длину
      },
    });

    // Новый уникальный просмотр — нужно увеличить счетчик
    return true;
  }

  /**
   * Проверяет, был ли просмотр без создания записи (для read-only операций)
   */
  async hasViewed(
    targetType: ViewTargetType,
    targetId: string,
    ipAddress: string,
  ): Promise<boolean> {
    const existing = await prisma.viewTracker.findUnique({
      where: {
        targetType_targetId_ipAddress: {
          targetType,
          targetId,
          ipAddress,
        },
      },
    });

    return !!existing;
  }
}
