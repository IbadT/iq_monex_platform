import { Test, TestingModule } from '@nestjs/testing';
import { LikesService } from './likes.service';
import { AppLogger } from '@/common/logger/logger.service';
import { NotFoundException } from '@nestjs/common';

describe('LikesService', () => {
  let service: LikesService;
  let logger: jest.Mocked<AppLogger>;

  beforeEach(async () => {
    const mockLogger = {
      log: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
      debug: jest.fn(),
      verbose: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LikesService,
        {
          provide: AppLogger,
          useValue: mockLogger,
        },
      ],
    }).compile();

    service = module.get<LikesService>(LikesService);
    logger = module.get<jest.Mocked<AppLogger>>(AppLogger);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('toggleLike', () => {
    it('should add a like when none exists', async () => {
      const listingId = 'listing-123';
      const userId = 'user-123';

      const mockListing = {
        id: listingId,
        version: 1,
        title: 'Test Listing',
        likesCount: 5,
      };

      const mockUser = {
        id: userId,
      };

      const mockLike = {
        id: 'like-123',
        listingId,
        userId,
        createdAt: new Date(),
        user: {
          id: userId,
          name: 'Test User',
        },
      };

      // Mock prisma methods
      const prisma = require('@/lib/prisma').prisma;
      const mockTransaction = jest.fn();
      
      prisma.$transaction = mockTransaction.mockImplementation(async (callback) => {
        const mockTx = {
          listing: {
            findUnique: jest.fn().mockResolvedValue(mockListing),
            update: jest.fn().mockResolvedValue({
              id: listingId,
              title: 'Test Listing',
              likesCount: 6,
              version: 2,
            }),
          },
          user: {
            findUnique: jest.fn().mockResolvedValue(mockUser),
          },
          listingLike: {
            findUnique: jest.fn().mockResolvedValue(null), // No existing like
            create: jest.fn().mockResolvedValue(mockLike),
          },
        };
        
        return await callback(mockTx);
      });

      const result = await service.toggleLike(listingId, userId);

      expect(logger.log).toHaveBeenCalledWith(`User ${userId} toggling like for listing ${listingId}`);
      expect(result).toEqual({
        message: 'Лайк успешно добавлен',
        action: 'liked',
        like: {
          ...mockLike,
          listing: {
            id: listingId,
            title: 'Test Listing',
            likesCount: 6,
            version: 2,
          },
        },
      });
    });

    it('should remove a like when it exists', async () => {
      const listingId = 'listing-123';
      const userId = 'user-123';

      const mockListing = {
        id: listingId,
        version: 1,
        likesCount: 5,
      };

      const mockUser = {
        id: userId,
      };

      const mockExistingLike = {
        id: 'like-123',
        listingId,
        userId,
        createdAt: new Date(),
      };

      // Mock prisma methods
      const prisma = require('@/lib/prisma').prisma;
      const mockTransaction = jest.fn();
      
      prisma.$transaction = mockTransaction.mockImplementation(async (callback) => {
        const mockTx = {
          listing: {
            findUnique: jest.fn().mockResolvedValue(mockListing),
            update: jest.fn().mockResolvedValue({
              id: listingId,
              likesCount: 4,
              version: 2,
            }),
          },
          user: {
            findUnique: jest.fn().mockResolvedValue(mockUser),
          },
          listingLike: {
            findUnique: jest.fn().mockResolvedValue(mockExistingLike), // Existing like
            delete: jest.fn().mockResolvedValue(mockExistingLike),
          },
        };
        
        return await callback(mockTx);
      });

      const result = await service.toggleLike(listingId, userId);

      expect(logger.log).toHaveBeenCalledWith(`User ${userId} toggling like for listing ${listingId}`);
      expect(result).toEqual({
        message: 'Лайк успешно удален',
        action: 'unliked',
        likesCount: 4,
        version: 2,
      });
    });

    it('should throw NotFoundException if listing does not exist', async () => {
      const listingId = 'nonexistent-listing';
      const userId = 'user-123';

      // Mock prisma methods
      const prisma = require('@/lib/prisma').prisma;
      const mockTransaction = jest.fn();
      
      prisma.$transaction = mockTransaction.mockImplementation(async (callback) => {
        const mockTx = {
          listing: {
            findUnique: jest.fn().mockResolvedValue(null), // Listing not found
          },
          user: {
            findUnique: jest.fn(),
          },
          listingLike: {
            findUnique: jest.fn(),
          },
        };
        
        return await callback(mockTx);
      });

      await expect(service.toggleLike(listingId, userId)).rejects.toThrow(
        new NotFoundException('Объявление с id: nonexistent-listing не найдено')
      );

      expect(logger.log).toHaveBeenCalledWith(`User ${userId} toggling like for listing ${listingId}`);
    });

    it('should throw NotFoundException if user does not exist', async () => {
      const listingId = 'listing-123';
      const userId = 'nonexistent-user';

      const mockListing = {
        id: listingId,
        version: 1,
      };

      // Mock prisma methods
      const prisma = require('@/lib/prisma').prisma;
      const mockTransaction = jest.fn();
      
      prisma.$transaction = mockTransaction.mockImplementation(async (callback) => {
        const mockTx = {
          listing: {
            findUnique: jest.fn().mockResolvedValue(mockListing),
          },
          user: {
            findUnique: jest.fn().mockResolvedValue(null), // User not found
          },
          listingLike: {
            findUnique: jest.fn(),
          },
        };
        
        return await callback(mockTx);
      });

      await expect(service.toggleLike(listingId, userId)).rejects.toThrow(
        new NotFoundException('Пользователь с id: nonexistent-user не найден')
      );

      expect(logger.log).toHaveBeenCalledWith(`User ${userId} toggling like for listing ${listingId}`);
    });
  });
});
