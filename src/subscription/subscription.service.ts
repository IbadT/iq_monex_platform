import { prisma } from '@/lib/prisma';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ChangeListingSlotDto } from './dto/change-listing-slot.dto';
import { PAYMENT_ITEM_TYPE } from '@/payments/enums/payment-status.enum';
import { PrismaClient } from 'prisma/generated/client';
import { ChangeSlotResponseDto } from './dto/response/change-slot-response.dto';
import { GetAvailableSlotResponseDto } from './dto/response/get-available-slot-response.dto';
import { SlotMapper } from './mappers/slots.mapper';
import { SlotPackageResponseDto } from './dto/response/slot-package-response.dto';

@Injectable()
export class SubscriptionService {
  async getUserAvailableSlots(
    userId: string,
  ): Promise<GetAvailableSlotResponseDto[]> {
    // const cacheKey = "empty/slots"
    const availableSlots = await prisma.userSlot.findMany({
      where: {
        userId,
        expiresAt: {
          gt: new Date(),
        },
        sourceType: {
          // in: ['SUBSCRIPTION', 'SLOT_PACKAGE'],
          in: [PAYMENT_ITEM_TYPE.SUBSCRIPTION, PAYMENT_ITEM_TYPE.SLOT_PACKAGE],
        },
        listingSlot: null,
      },
      include: {
        listingSlot: true,
      },
      orderBy: {
        slotIndex: 'asc',
      },
    });

    if (availableSlots.length === 0) {
      throw new NotFoundException(
        'Нет доступных слотов для создания объявления',
      );
    }

    // return availableSlots;
    return SlotMapper.availableSlotsListToResponse(availableSlots);
  }

  async changeListingSlot(
    userId: string,
    body: ChangeListingSlotDto,
  ): Promise<ChangeSlotResponseDto> {
    return await prisma.$transaction(async (tx: PrismaClient) => {
      // 1. Находим объявление и проверяем, что оно принадлежит пользователю
      const listing = await tx.listing.findFirst({
        where: {
          id: body.listingId,
          userId,
        },
        include: {
          listingSlot: true,
        },
      });

      if (!listing) {
        throw new NotFoundException(
          'Объявление не найдено или не принадлежит пользователю',
        );
      }

      if (!listing.listingSlot) {
        throw new NotFoundException('Объявление не привязано к слоту');
      }

      // 2. Находим текущий слот и целевой слот
      const [fromSlot, toSlot] = await Promise.all([
        tx.userSlot.findFirst({
          where: {
            id: body.fromSlotId,
            userId,
            expiresAt: { gt: new Date() },
          },
          include: { listingSlot: true },
        }),
        tx.userSlot.findFirst({
          where: {
            id: body.toSlotId,
            userId,
            expiresAt: { gt: new Date() },
            listingSlot: null, // Целевой слот должен быть свободным
          },
        }),
      ]);

      if (!fromSlot) {
        throw new NotFoundException('Исходный слот не найден или неактивен');
      }

      if (!toSlot) {
        throw new NotFoundException(
          'Целевой слот не найден, неактивен или занят',
        );
      }

      if (!fromSlot.listingSlot) {
        throw new NotFoundException('В исходном слоте нет объявления');
      }

      if (fromSlot.listingSlot.listingId !== body.listingId) {
        throw new NotFoundException(
          'В исходном слоте находится другое объявление',
        );
      }

      // 3. Перемещаем объявление в новый слот
      await tx.listingSlot.update({
        where: {
          id: listing.listingSlot.id,
        },
        data: {
          userSlotId: toSlot.id,
        },
      });

      return {
        message: 'Объявление успешно перемещено',
        fromSlotId: fromSlot.id,
        toSlotId: toSlot.id,
        listingId: listing.id,
      };
    });
  }

  async getUserSlots(userId: string): Promise<GetAvailableSlotResponseDto[]> {
    const slots = await prisma.userSlot.findMany({
      where: {
        userId,
      },
      include: {
        listingSlot: true,
      },
    });

    return SlotMapper.availableSlotsListToResponse(slots);
  }

  async getUserPackages(userId: string): Promise<SlotPackageResponseDto[]> {
    const packages = await prisma.slotPackage.findMany({
      where: {
        userId,
      },
    });

    return SlotMapper.slotPackageListToResponse(packages);
  }

  async getUserSubscription(userId: string) {
    return await prisma.subscription.findFirst({
      where: {
        userId,
      },
    });
  }

  // async createPackage(userId: string) {
  //   return await prisma.slotPackage.create({
  //     data: {}
  //   })
  // }
}
