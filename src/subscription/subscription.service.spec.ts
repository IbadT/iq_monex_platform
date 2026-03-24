import { Test, TestingModule } from '@nestjs/testing';
import { SubscriptionService } from './subscription.service';
import { NotFoundException } from '@nestjs/common';

describe('SubscriptionService', () => {
  let service: SubscriptionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SubscriptionService],
    }).compile();

    service = module.get<SubscriptionService>(SubscriptionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getUserAvailableSlots', () => {
    it('should return available slots for user', async () => {
      const userId = 'user-123';

      const mockAvailableSlots = [
        {
          id: 'slot-1',
          userId,
          expiresAt: new Date(Date.now() + 1000000),
          sourceType: 'SUBSCRIPTION',
          listingSlot: null,
        },
        {
          id: 'slot-2',
          userId,
          expiresAt: new Date(Date.now() + 1000000),
          sourceType: 'SLOT_PACKAGE',
          listingSlot: null,
        },
      ];

      // Mock prisma methods
      const prisma = require('@/lib/prisma').prisma;
      prisma.userSlot.findMany = jest
        .fn()
        .mockResolvedValue(mockAvailableSlots);

      const result = await service.getUserAvailableSlots(userId);

      expect(prisma.userSlot.findMany).toHaveBeenCalledWith({
        where: {
          userId,
          expiresAt: {
            gt: expect.any(Date),
          },
          sourceType: {
            in: ['SUBSCRIPTION', 'SLOT_PACKAGE'],
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
      expect(result).toEqual(mockAvailableSlots);
    });

    it('should throw NotFoundException if no available slots', async () => {
      const userId = 'user-123';

      // Mock prisma methods
      const prisma = require('@/lib/prisma').prisma;
      prisma.userSlot.findMany = jest.fn().mockResolvedValue([]);

      await expect(service.getUserAvailableSlots(userId)).rejects.toThrow(
        new NotFoundException('Нет доступных слотов для создания объявления'),
      );
    });
  });
});
