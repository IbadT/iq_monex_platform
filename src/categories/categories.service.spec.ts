import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesService } from './categories.service';
import { CacheService } from '@/cache/cacheService.service';
import { AppLogger } from '@/common/logger/logger.service';

describe('CategoriesService', () => {
  let service: CategoriesService;
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
        CategoriesService,
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

    service = module.get<CategoriesService>(CategoriesService);
    cacheService = module.get<jest.Mocked<CacheService>>(CacheService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('categoriesList', () => {
    it('should return cached categories', async () => {
      const cacheKey = 'categories';
      
      const mockCategories = [
        {
          id: 1,
          name: 'Electronics',
          subcategories: [
            {
              id: 2,
              name: 'Phones',
              subSubcategories: [
                { id: 3, name: 'Smartphones' },
                { id: 4, name: 'Accessories' },
              ],
            },
          ],
        },
      ];

      cacheService.get = jest.fn().mockResolvedValue(mockCategories);

      const result = await service.categoriesList();

      expect(cacheService.get).toHaveBeenCalledWith(cacheKey);
      expect(result).toEqual(mockCategories);
    });

    it('should fetch from database when cache is empty', async () => {
      const cacheKey = 'categories';
      
      const mockCategories = [
        {
          id: 1,
          name: 'Books',
          subcategories: [
            {
              id: 2,
              name: 'Fiction',
              subSubcategories: [
                { id: 3, name: 'Novels' },
                { id: 4, name: 'Poetry' },
              ],
            },
          ],
        },
      ];

      // Mock cache miss
      cacheService.get = jest.fn().mockResolvedValue(null);
      
      // Mock prisma methods
      const prisma = require('@/lib/prisma').prisma;
      prisma.category.findMany = jest.fn().mockResolvedValue(mockCategories);
      
      // Mock cache set
      cacheService.set = jest.fn().mockResolvedValue(true);

      const result = await service.categoriesList();

      expect(cacheService.get).toHaveBeenCalledWith(cacheKey);
      expect(prisma.category.findMany).toHaveBeenCalled();
      expect(cacheService.set).toHaveBeenCalledWith({
        baseKey: cacheKey,
        ttl: 3600,
        value: mockCategories,
      });
      expect(result).toEqual(mockCategories);
    });
  });
});
