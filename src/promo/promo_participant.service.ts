import { Injectable, BadRequestException } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { prisma } from '@/lib/prisma';
import { PromoCompaignService } from './promo_compaign.service';
// import {
//   // PromoParticipantStatus,
//   // PromoCampaignStatus,
//   // SlotSource,
// } from 'prisma/generated/enums';
import { PromoCampaign } from 'prisma/generated/client';
import { PromoCampaignStatus, PromoParticipantStatus } from './enums/promo-status.enum';
import { SlotSource } from '@/subscription/enums/slotSource.enum';

@Injectable()
export class PromoParticipantService {
  constructor(private readonly promoCampaignService: PromoCompaignService) {}

  // Присоединение пользователя к активной кампании (при регистрации)
  async joinActiveCampaign(userId: string) {
    // Проверить, не участвует ли уже
    const existing = await prisma.promoCampaignParticipant.findFirst({
      where: { userId },
    });
    if (existing) {
      return existing; // Уже участвует
    }

    // Получить активную кампанию
    const campaign = await this.promoCampaignService.getActiveCampaignForJoin();
    if (!campaign) {
      return null; // Нет активных кампаний
    }

    // Проверить, не заблокирована ли кампания (тумблер сработал)
    if (campaign.isLocked) {
      throw new BadRequestException('Campaign is locked - no new participants allowed');
    }

    // Проверить лимит
    const currentCount = await prisma.promoCampaignParticipant.count({
      where: { campaignId: campaign.id },
    });
    if (currentCount >= campaign.maxParticipants) {
      throw new BadRequestException('Campaign is full');
    }

    // Создать участника
    const participant = await prisma.promoCampaignParticipant.create({
      data: {
        campaignId: campaign.id,
        userId,
        status: PromoParticipantStatus.PENDING,
      },
    });

    // Обновить счётчик участников
    await prisma.promoCampaign.update({
      where: { id: campaign.id },
      data: { currentParticipants: { increment: 1 } },
    });

    // Начислить бонусы СРАЗУ (слоты и подписка)
    try {
      await this.applyPromoBenefits(userId, campaign, participant.id);
      console.log(`User ${userId} joined campaign and received promo benefits immediately`);
    } catch (error) {
      console.error(`Failed to apply promo benefits for user ${userId}:`, error);
      // Не прерываем регистрацию, если не удалось начислить бонусы
    }

    return participant;
  }

  // Обновление статуса участника (для cron или вручную)
  async updateParticipantStatus(
    participantId: string,
    status: PromoParticipantStatus,
  ) {
    return await prisma.promoCampaignParticipant.update({
      where: { id: participantId },
      data: { status },
    });
  }

  // Cron-задача: проверка условий каждый час (для более точного контроля)
  @Cron(CronExpression.EVERY_HOUR)
  async checkParticipantConditions() {
    // Получить всех участников с активными кампаниями (PENDING или IN_PROGRESS)
    const participants = await prisma.promoCampaignParticipant.findMany({
      where: {
        status: {
          in: [
            PromoParticipantStatus.PENDING,
            PromoParticipantStatus.IN_PROGRESS,
          ],
        },
        droppedOut: false,
        campaign: { status: PromoCampaignStatus.ACTIVE },
      },
      include: { campaign: true },
    });

    for (const participant of participants) {
      await this.checkAndUpdateParticipantStatus(participant);
    }
  }

  // Немедленная проверка конкретного пользователя (вызывается при изменении объявлений)
  async checkUserConditions(userId: string): Promise<void> {
    const participant = await prisma.promoCampaignParticipant.findFirst({
      where: {
        userId,
        status: {
          in: [
            PromoParticipantStatus.PENDING,
            PromoParticipantStatus.IN_PROGRESS,
          ],
        },
        droppedOut: false,
        campaign: { status: PromoCampaignStatus.ACTIVE },
      },
      include: { campaign: true },
    });

    if (participant) {
      await this.checkAndUpdateParticipantStatus(participant);
    }
  }

  // Проверка и обновление статуса участника
  // Логика: пользователь должен УДЕРЖИВАТЬ 10 активных объявлений в течение 7 дней
  private async checkAndUpdateParticipantStatus(participant: any) {
    const { userId, campaign, id: participantId } = participant;

    // Подсчитать активные объявления пользователя
    const activeListingsCount = await prisma.listing.count({
      where: {
        userId,
        status: 'PUBLISHED', // Активные объявления
      },
    });

    const now = new Date();
    const hasEnoughListings = activeListingsCount >= campaign.requiredActiveListings;

    if (hasEnoughListings) {
      // У пользователя достаточно объявлений
      if (participant.status === PromoParticipantStatus.PENDING) {
        // Первый раз достигли 10 объявлений - переход в IN_PROGRESS, таймер запускается
        await prisma.promoCampaignParticipant.update({
          where: { id: participantId },
          data: {
            status: PromoParticipantStatus.IN_PROGRESS,
            conditionReachedAt: now, // Начало отсчета 7 дней
          },
        });
        console.log(`User ${userId} reached 10 listings, 7-day timer started`);
      } else if (participant.status === PromoParticipantStatus.IN_PROGRESS) {
        // Проверяем, прошло ли 7 дней с момента первого достижения 10 объявлений
        const conditionReachedAt = participant.conditionReachedAt;
        if (conditionReachedAt) {
          const daysSinceConditionMet = Math.floor(
            (now.getTime() - conditionReachedAt.getTime()) / (1000 * 60 * 60 * 24),
          );
          if (daysSinceConditionMet >= campaign.requiredDays) {
            // Условие выполнено полностью (10 объявлений + 7 дней подряд) - ELIGIBLE
            await prisma.promoCampaignParticipant.update({
              where: { id: participantId },
              data: { status: PromoParticipantStatus.ELIGIBLE },
            });
            console.log(`User ${userId} completed 7 days with 10 listings - ELIGIBLE`);
          }
        }
      }
      // Если ELIGIBLE - ничего не делаем, акция уже защищена
    } else {
      // У пользователя меньше 10 объявлений
      if (participant.status === PromoParticipantStatus.IN_PROGRESS) {
        // Проверяем, прошло ли 7 дней с момента conditionReachedAt
        const conditionReachedAt = participant.conditionReachedAt;
        if (conditionReachedAt) {
          const daysSinceConditionMet = Math.floor(
            (now.getTime() - conditionReachedAt.getTime()) / (1000 * 60 * 60 * 24),
          );
          if (daysSinceConditionMet >= campaign.requiredDays) {
            // Прошло более 7 дней и условия не выполнены (меньше 10 объявлений) - ВЫЛЕТ
            console.log(`User ${userId} failed to maintain 10 listings for 7 days - DROPPING OUT`);
            await this.dropOutFromCampaign(participantId, campaign.id, 'FAILED_REQUIREMENTS');
            // Отзываем бонусы (слоты и подписку)
            await this.revokePromoBenefits(userId, participantId);
          } else {
            // Ещё есть время (меньше 7 дней прошло) - сброс в PENDING, таймер сбрасывается
            await prisma.promoCampaignParticipant.update({
              where: { id: participantId },
              data: {
                status: PromoParticipantStatus.PENDING,
                conditionLostAt: now,
                conditionReachedAt: null, // Сбрасываем таймер
              },
            });
            console.log(`User ${userId} dropped below 10 listings, timer reset`);
          }
        }
      }
      // Если PENDING - остаёмся в PENDING (ждём когда наберёт 10)
      // Если ELIGIBLE - ничего не делаем, акция уже защищена навсегда
    }
  }

  // Вылет пользователя из акции (возврат места только если кампания не заблокирована)
  private async dropOutFromCampaign(
    participantId: string,
    campaignId: string,
    reason: string,
  ) {
    await prisma.$transaction(async (tx) => {
      // Получаем информацию о кампании
      const campaign = await tx.promoCampaign.findUnique({
        where: { id: campaignId },
        select: { isLocked: true },
      });

      // Обновляем статус участника
      await tx.promoCampaignParticipant.update({
        where: { id: participantId },
        data: {
          status: PromoParticipantStatus.FAILED,
          droppedOut: true,
          droppedOutAt: new Date(),
          dropReason: reason,
        },
      });

      // Уменьшаем счётчик участников ТОЛЬКО если кампания не заблокирована
      // Если isLocked = true, место не возвращается (акция недоступна для новых участников)
      if (!campaign?.isLocked) {
        await tx.promoCampaign.update({
          where: { id: campaignId },
          data: {
            currentParticipants: {
              decrement: 1,
            },
          },
        });
        console.log(`User dropped out from campaign ${campaignId}, slot returned. Reason: ${reason}`);
      } else {
        console.log(`User dropped out from locked campaign ${campaignId}. Slot NOT returned (campaign is locked). Reason: ${reason}`);
      }
    });
  }

  // Применение бонусов к подписке пользователя
  private async applyPromoBenefits(
    userId: string,
    campaign: PromoCampaign,
    participantId: string,
  ) {
    await prisma.$transaction(async (tx) => {
      // Проверить, есть ли уже подписка у пользователя
      const existingSubscription = await tx.subscription.findFirst({
        where: { userId },
      });

      if (existingSubscription) {
        console.log(
          `User ${userId} already has a subscription, skipping promo benefits`,
        );
        return;
      }

      // Найти базовый тариф
      const baseTariff = await tx.tariff.findFirst({
        where: { code: 'BASE' },
      });

      if (!baseTariff) {
        console.error('Base tariff not found, cannot apply promo benefits');
        return;
      }

      // Создать подписку с бонусами
      const now = new Date();
      const freeEndAt = new Date(
        now.getTime() + campaign.initialFreeDays * 24 * 60 * 60 * 1000,
      );

      const newSubscription = await tx.subscription.create({
        data: {
          userId,
          tariffId: baseTariff.id,
          totalSlots: baseTariff.baseSlots,
        },
      });

      // Создать бесплатный период подписки
      await tx.subscriptionPeriod.create({
        data: {
          subscriptionId: newSubscription.id,
          days: campaign.initialFreeDays,
          startAt: now,
          endAt: freeEndAt,
          discountPercent: 100, // 100% = бесплатно
          periodType: 'FREE',
        },
      });

      // Рассчитать даты для скидочного периода (второй год)
      const discountStartAt = new Date(freeEndAt);
      const discountEndAt = new Date(
        discountStartAt.getTime() + campaign.subsequentDays * 24 * 60 * 60 * 1000,
      );

      // Создать скидочный период подписки (второй год со скидкой)
      // Это placeholder - реальная покупка будет через отдельный endpoint
      await tx.subscriptionPeriod.create({
        data: {
          subscriptionId: newSubscription.id,
          days: campaign.subsequentDays,
          startAt: discountStartAt,
          endAt: discountEndAt,
          discountPercent: campaign.subsequentDiscount, // 50% для второго года
          periodType: 'DISCOUNTED',
        },
      });

      // Создать слоты для подписки на весь период (бесплатный + скидочный)
      const totalDays = campaign.initialFreeDays + campaign.subsequentDays;
      const slotsExpiryDate = new Date(
        now.getTime() + totalDays * 24 * 60 * 60 * 1000,
      );

      const slots = [];
      for (let i = 1; i <= baseTariff.baseSlots; i++) {
        slots.push({
          userId,
          slotIndex: i,
          sourceType: SlotSource.SUBSCRIPTION,
          sourceId: newSubscription.id,
          subscriptionId: newSubscription.id,
          expiresAt: slotsExpiryDate,
        });
      }

      await tx.userSlot.createMany({ data: slots });

      // Обновить статус участника
      await tx.promoCampaignParticipant.update({
        where: { id: participantId },
        data: {
          freePeriodGranted: true,
          discountAvailableAt: discountStartAt,
          subscriptionId: newSubscription.id,
        },
      });

      console.log(
        `Applied promo benefits for user ${userId}: ${campaign.initialFreeDays} free days + ${campaign.subsequentDays} discounted days, ${baseTariff.baseSlots} slots created`,
      );
    });
  }

  // Отзыв бонусов при провале условий (удаление подписки и слотов)
  private async revokePromoBenefits(userId: string, participantId: string) {
    try {
      await prisma.$transaction(async (tx) => {
        // Получаем информацию об участнике
        const participant = await tx.promoCampaignParticipant.findUnique({
          where: { id: participantId },
          include: { subscription: true },
        });

        if (!participant?.subscriptionId) {
          console.log(`No subscription to revoke for user ${userId}`);
          return;
        }

        const subscriptionId = participant.subscriptionId;

        // Удаляем слоты, созданные для этой подписки
        const deletedSlots = await tx.userSlot.deleteMany({
          where: {
            userId,
            subscriptionId,
            sourceType: SlotSource.SUBSCRIPTION,
          },
        });
        console.log(`Revoked ${deletedSlots.count} slots for user ${userId}`);

        // Удаляем периоды подписки
        await tx.subscriptionPeriod.deleteMany({
          where: { subscriptionId },
        });

        // Удаляем подписку
        await tx.subscription.delete({
          where: { id: subscriptionId },
        });

        // Обновляем статус участника
        await tx.promoCampaignParticipant.update({
          where: { id: participantId },
          data: {
            subscriptionId: null,
            freePeriodGranted: false,
            discountAvailableAt: null,
          },
        });

        console.log(`Revoked promo benefits for user ${userId}: subscription and slots removed`);
      });
    } catch (error) {
      console.error(`Failed to revoke promo benefits for user ${userId}:`, error);
      // Не прерываем основной flow, но логируем ошибку
    }
  }

  // Использование скидки 50% на второй год
  async useDiscount(userId: string): Promise<{ success: boolean; message: string }> {
    const participant = await prisma.promoCampaignParticipant.findFirst({
      where: {
        userId,
        droppedOut: false,
        freePeriodGranted: true,
        discountUsed: false,
      },
      include: {
        campaign: true,
        subscription: {
          include: {
            periods: true,
          },
        },
      },
    });

    if (!participant) {
      return {
        success: false,
        message: 'Скидка недоступна: нет активной акции или скидка уже использована',
      };
    }

    // Проверяем, что скидочный период ещё не куплен
    const discountedPeriod = participant.subscription?.periods.find(
      (p: any) => p.periodType === 'DISCOUNTED' && p.paymentId,
    );

    if (discountedPeriod) {
      return {
        success: false,
        message: 'Скидочный период уже оплачен',
      };
    }

    // Проверяем, что скидка доступна (дата начала скидочного периода)
    const now = new Date();
    if (participant.discountAvailableAt && now < participant.discountAvailableAt) {
      return {
        success: false,
        message: `Скидка будет доступна с ${participant.discountAvailableAt.toISOString()}`,
      };
    }

    // Отмечаем скидку как использованную
    await prisma.promoCampaignParticipant.update({
      where: { id: participant.id },
      data: { discountUsed: true },
    });

    return {
      success: true,
      message: 'Скидка 50% на 360 дней доступна для покупки',
      discount: {
        percent: participant.campaign.subsequentDiscount,
        days: participant.campaign.subsequentDays,
        maxDays: 360, // Лимит на покупку
      },
    } as any;
  }
}
