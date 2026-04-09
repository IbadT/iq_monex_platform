import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { prisma } from '@/lib/prisma';
import { CreatePromoCompaignDto } from './dto/create-promo_compaign.dto';
import { PromoCampaignStatus } from './enums/promo-status.enum';

@Injectable()
export class PromoCompaignService {
  // Создание новой кампании
  async create(dto: CreatePromoCompaignDto) {
    // Проверка уникальности кода
    const existing = await prisma.promoCampaign.findUnique({
      where: { code: dto.code },
    });
    if (existing) {
      throw new BadRequestException('Campaign with this code already exists');
    }

    // Создание кампании
    const campaign = await prisma.promoCampaign.create({
      data: {
        code: dto.code,
        name: dto.name,
        status: dto.status || PromoCampaignStatus.ACTIVE,
        maxParticipants: dto.maxParticipants,
        initialFreeDays: dto.initialFreeDays,
        subsequentDiscount: dto.subsequentDiscount,
        subsequentDays: dto.subsequentDays,
        requiredActiveListings: dto.requiredActiveListings || 10,
        requiredDays: dto.requiredDays || 7,
      },
    });

    return campaign;
  }

  // Список активных кампаний (для админа)
  async promoCompaignsList() {
    return await prisma.promoCampaign.findMany({
      where: { status: PromoCampaignStatus.ACTIVE },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Подсчёт участников для активных кампаний
  async promoCompaignCount() {
    const campaigns = await prisma.promoCampaign.findMany({
      where: { status: PromoCampaignStatus.ACTIVE },
      select: {
        id: true,
        code: true,
        currentParticipants: true,
        maxParticipants: true,
      },
    });

    return campaigns.map((c) => ({
      id: c.id,
      code: c.code,
      currentParticipants: c.currentParticipants,
      maxParticipants: c.maxParticipants,
      isFull: c.currentParticipants >= c.maxParticipants,
    }));
  }

  // Изменение статуса кампании (для админа)
  async changeStatus(id: string, status: PromoCampaignStatus) {
    const campaign = await prisma.promoCampaign.findUnique({
      where: { id },
    });
    if (!campaign) {
      throw new NotFoundException('Campaign not found');
    }

    return await prisma.promoCampaign.update({
      where: { id },
      data: { status },
    });
  }

  // Получение статуса пользователя (для текущего пользователя)
  async getUserStatus(userId: string) {
    const participant = await prisma.promoCampaignParticipant.findFirst({
      where: { userId },
      include: {
        campaign: true,
      },
      orderBy: { joinedAt: 'desc' },
    });

    if (!participant) {
      return { hasPromo: false };
    }

    return {
      hasPromo: true,
      campaign: participant.campaign,
      status: participant.status,
      joinedAt: participant.joinedAt,
      conditionReachedAt: participant.conditionReachedAt,
      conditionLostAt: participant.conditionLostAt,
    };
  }

  // Логика тумблера: проверка и переключение кампаний
  async checkAndSwitchCampaigns() {
    const activeCampaigns = await prisma.promoCampaign.findMany({
      where: { status: PromoCampaignStatus.ACTIVE },
      orderBy: { createdAt: 'asc' }, // Сначала старая
    });

    for (const campaign of activeCampaigns) {
      // Обновить currentParticipants
      const count = await prisma.promoCampaignParticipant.count({
        where: { campaignId: campaign.id },
      });
      await prisma.promoCampaign.update({
        where: { id: campaign.id },
        data: { currentParticipants: count },
      });

      // Если лимит достигнут, заблокировать кампанию и создать новую
      if (count >= campaign.maxParticipants) {
        await prisma.promoCampaign.update({
          where: { id: campaign.id },
          data: {
            status: PromoCampaignStatus.COMPLETED,
            endAt: new Date(),
            isLocked: true, // Блокируем кампанию - новые участники не могут присоединиться
          },
        });

        // Создать следующую кампанию на основе типа
        await this.createNextCampaign(campaign);
      }
    }
  }

  // Создание следующей кампании
  private async createNextCampaign(previous: any) {
    let nextConfig;

    // Логика на основе предыдущей кампании
    if (previous.maxParticipants === 300) {
      // После первой (300), создать вторую (2000)
      nextConfig = {
        code: 'promo_2000',
        name: 'Акция для следующих 2000 пользователей',
        maxParticipants: 2000,
        initialFreeDays: 30,
        subsequentDiscount: 50,
        subsequentDays: 360,
      };
    } else if (previous.maxParticipants === 2000) {
      // После второй, завершить акции
      return;
    }

    if (nextConfig) {
      await this.create(nextConfig as CreatePromoCompaignDto);
    }
  }

  // Получение активной кампании для присоединения
  async getActiveCampaignForJoin() {
    return await prisma.promoCampaign.findFirst({
      where: { status: PromoCampaignStatus.ACTIVE },
      orderBy: { createdAt: 'asc' }, // Самая старая активная
    });
  }
}
