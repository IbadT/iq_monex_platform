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
          targetType: 'LISTING',
          targetId: 'listing-789',
          createdAt: new Date(),
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
          listing: true,
        },
      });
      expect(cacheService.set).toHaveBeenCalledWith({
        baseKey: cacheKey,
        ttl: 900,
        value: mockFavorites,
      });
      expect(result).toEqual(mockFavorites);
    });
  });
});
