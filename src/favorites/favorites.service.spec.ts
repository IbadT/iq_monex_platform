import { Test, TestingModule } from '@nestjs/testing';
import { FavoriteService } from './favorites.service';
import { CacheService } from '@/cache/cacheService.service';
import { AppLogger } from '@/common/logger/logger.service';

describe('FavoriteService', () => {
  let service: FavoriteService;
  let cacheService: jest.Mocked<CacheService>;

  beforeEach(async () => {
    const mockCacheService = {
      get: jest.fn(),
      set: jest.fn(),
      del: jest.fn(),
    };

    const mockLogger = {
      log: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
      debug: jest.fn(),
      verbose: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FavoriteService,
        {
          provide: CacheService,
          useValue: mockCacheService,
        },
        {
          provide: AppLogger,
          useValue: mockLogger,
        },
      ],
    }).compile();

    service = module.get<FavoriteService>(FavoriteService);
    cacheService = module.get<jest.Mocked<CacheService>>(CacheService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getList', () => {
    it('should return cached favorites', async () => {
      const userId = 'user-123';
      const cacheKey = `favorites/userId:${userId}`;

      const mockFavorites = [
        {
          id: 'fav-1',
          userId,
          targetType: 'LISTING',
          targetId: 'listing-123',
          createdAt: new Date(),
        },
        {
          id: 'fav-2',
          userId,
          targetType: 'USER',
          targetId: 'user-456',
          createdAt: new Date(),
        },
      ];

      cacheService.get = jest.fn().mockResolvedValue(mockFavorites);

      const result = await service.getList(userId);

      expect(cacheService.get).toHaveBeenCalledWith(cacheKey);
      expect(result).toEqual(mockFavorites);
    });

    it('should fetch from database when cache is empty', async () => {
      const userId = 'user-123';
      const cacheKey = `favorites/userId:${userId}`;

      const mockFavorites = [
        {
          id: 'fav-3',
          userId,
          type: 'LISTING',
          listingId: 'listing-789',
          targetUserId: null,
          createdAt: new Date(),
          listing: null,
        },
      ];

      // Mock cache miss
      cacheService.get = jest.fn().mockResolvedValue(null);

      // Mock prisma methods
      const prisma = require('@/lib/prisma').prisma;
      prisma.favorite.findMany = jest.fn().mockResolvedValue(mockFavorites);

      // Mock cache set
      cacheService.set = jest.fn().mockResolvedValue(true);

      const result = await service.getList(userId);

      expect(cacheService.get).toHaveBeenCalledWith(cacheKey);
      expect(prisma.favorite.findMany).toHaveBeenCalledWith({
        where: {
          userId,
        },
        include: {
          listing: {
            include: {
              category: true,
              subcategory: true,
              subsubcategory: true,
              currency: true,
              priceUnit: true,
              files: true,
              locations: true,
              specifications: {
                include: {
                  specification: true,
                },
              },
              user: {
                select: {
                  id: true,
                  name: true,
                  files: {
                    where: { kind: 'AVATAR' },
                    select: { url: true },
                  },
                },
              },
            },
          },
        },
      });

      // Expect DTO objects, not raw database objects
      expect(result).toHaveLength(1);
      expect(result[0]).toHaveProperty('id', 'fav-3');
      expect(result[0]).toHaveProperty('userId', userId);
      expect(result[0]).toHaveProperty('type', 'LISTING');
      expect(result[0]).toHaveProperty('listingId', 'listing-789');
      expect(result[0]).toHaveProperty('targetUserId', null);
      expect(result[0]).toHaveProperty('listing', null);
      expect(result[0]).toHaveProperty('createdAt');

      // Check that cache was called with DTO objects
      expect(cacheService.set).toHaveBeenCalledWith({
        baseKey: cacheKey,
        ttl: 900,
        value: result, // Use the actual DTO result
      });
    });
  });
});
