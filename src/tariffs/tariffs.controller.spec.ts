import { Test, TestingModule } from '@nestjs/testing';
import { TariffsController } from './tariffs.controller';
import { TariffsService } from './tariffs.service';
import { AppLogger } from '@/common/logger/logger.service';
import { JwtTokenService } from '@/auth/jwt/jwt.service';
import { Reflector } from '@nestjs/core';

describe('TariffsController', () => {
  let controller: TariffsController;

  beforeEach(async () => {
    const mockTariffsService = {
      getAllTariffs: jest.fn(),
      getTariffById: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [TariffsController],
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
        {
          provide: JwtTokenService,
          useValue: {
            verifyToken: jest.fn(),
            issueTokens: jest.fn(),
          },
        },
        {
          provide: Reflector,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    })
      .overrideProvider(TariffsService)
      .useValue(mockTariffsService)
      .compile();

    controller = module.get<TariffsController>(TariffsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
