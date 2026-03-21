import { Test, TestingModule } from '@nestjs/testing';
import { PaymentsService } from './payments.service';
import { SubscriptionService } from '@/subscription/subscription.service';
import { YookassaService } from 'nestjs-yookassa';
import { CacheService } from '@/cache/cacheService.service';
import { AppLogger } from '@/common/logger/logger.service';
import { TariffsService } from '@/tariffs/tariffs.service';
import { CreatePaymentDto, PaymentType } from './dto/create-payment.dto';

describe('PaymentsService', () => {
  let service: PaymentsService;

  beforeEach(async () => {
    const mockSubscriptionService = {
      getUserAvailableSlots: jest.fn(),
      getUserSlots: jest.fn(),
      getUserSubscription: jest.fn().mockResolvedValue(null),
    };

    const mockYooKassaService = {
      createPayment: jest.fn().mockResolvedValue({
        id: 'payment-123',
        status: 'pending',
        confirmation_url: 'https://yookassa.ru/confirm',
      }),
      CHANNELS: {
        NOTIFICATIONS: 'notifications',
      },
    } as any;

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
        PaymentsService,
        {
          provide: SubscriptionService,
          useValue: mockSubscriptionService,
        },
        {
          provide: YookassaService,
          useValue: mockYooKassaService,
        },
        {
          provide: TariffsService,
          useValue: {
            getTariffById: jest.fn().mockResolvedValue({
              id: 'tariff-123',
              name: 'Test Tariff',
              price: 1000,
              currencyCode: 'RUB',
              baseDays: 30,
            }),
          },
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

    service = module.get<PaymentsService>(PaymentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createPayment', () => {
    it('should throw BadRequestException for EXTEND_PACKAGES without packageIds', async () => {
      const userId = 'user-123';
      const createPaymentDto: CreatePaymentDto = new CreatePaymentDto(
        PaymentType.EXTEND_PACKAGES,
        '1000',
      );

      await expect(
        service.createPayment(userId, createPaymentDto),
      ).rejects.toThrow('Для продления пакетов необходимо указать packageIds');
    });
  });
});
