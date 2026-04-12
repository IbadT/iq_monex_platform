import { Test, TestingModule } from '@nestjs/testing';
import { AttributesService } from './attributes.service';
import { CacheService } from '@/cache/cacheService.service';
import { AppLogger } from '@/common/logger/logger.service';
// import { Language } from '@/dictionaries/dto/request/get-currency.dto';

describe('AttributesService', () => {
  let service: AttributesService;

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
        AttributesService,
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

    service = module.get<AttributesService>(AttributesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('list', () => {
    // TODO: Redis cache is temporarily commented out in the service
    // Re-enable these tests when cache is restored
    /*
    it('should return cached specifications', async () => {
      const lang = Language.RU;
      const cacheKey = `specifications:${lang}`;

      const mockSpecifications = [
        {
          id: 1,
          name: 'Цвет', // Already transformed by Specification.toResponse(lang)
        },
        {
          id: 2,
          name: 'Размер', // Already transformed by Specification.toResponse(lang)
        },
      ];

      cacheService.get = jest.fn().mockResolvedValue(mockSpecifications);

      const result = await service.list(lang);

      expect(cacheService.get).toHaveBeenCalledWith(cacheKey);
      expect(result).toEqual([
        {
          id: 1,
          name: 'Цвет', // Transformed by Specification.toResponse(lang)
        },
        {
          id: 2,
          name: 'Размер', // Transformed by Specification.toResponse(lang)
        },
      ]);
    });

    it('should fetch from database when cache is empty', async () => {
      const lang = Language.EN;
      const cacheKey = `specifications:${lang}`;

      const mockSpecifications = [
        {
          id: 1,
          name: {
            ru: 'Цвет',
            en: 'Color',
            kz: 'Түс',
          },
        },
      ];

      // Mock cache miss
      cacheService.get = jest.fn().mockResolvedValue(null);

      // Mock prisma methods
      const prisma = require('@/lib/prisma').prisma;
      prisma.specification.findMany = jest
        .fn()
        .mockResolvedValue(mockSpecifications);

      // Mock cache set
      cacheService.set = jest.fn().mockResolvedValue(true);

      const result = await service.list(lang);

      expect(cacheService.get).toHaveBeenCalledWith(cacheKey);
      expect(prisma.specification.findMany).toHaveBeenCalled();
      expect(cacheService.set).toHaveBeenCalledWith({
        baseKey: cacheKey,
        ttl: 3600,
        value: [
          {
            id: 1,
            name: 'Color', // Transformed by Specification.toResponse(lang)
          },
        ],
      });
      expect(result).toEqual([
        {
          id: 1,
          name: 'Color', // Transformed by Specification.toResponse(lang)
        },
      ]);
    });
    */
  });
});
