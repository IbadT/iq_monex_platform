import { Test, TestingModule } from '@nestjs/testing';
import { DictionariesController } from './dictionaries.controller';
import { DictionariesService } from './dictionaries.service';
import { ConfigService } from '@nestjs/config';
import { CacheService } from '@/cache/cacheService.service';
import { AppLogger } from '@/common/logger/logger.service';

describe('DictionariesController', () => {
  let controller: DictionariesController;

  beforeEach(async () => {
    const mockConfigService = {
      get: jest.fn(),
    };

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
      controllers: [DictionariesController],
      providers: [
        DictionariesService,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
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

    controller = module.get<DictionariesController>(DictionariesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
