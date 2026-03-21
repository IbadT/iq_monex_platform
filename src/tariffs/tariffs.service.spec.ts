import { Test, TestingModule } from '@nestjs/testing';
import { TariffsService } from './tariffs.service';
import { AppLogger } from '@/common/logger/logger.service';

describe('TariffsService', () => {
  let service: TariffsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TariffsService,
        {
          provide: AppLogger,
          useValue: {
            log: jest.fn(),
            error: jest.fn(),
            warn: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<TariffsService>(TariffsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
