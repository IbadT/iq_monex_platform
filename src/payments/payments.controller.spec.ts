import { Test, TestingModule } from '@nestjs/testing';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto, PaymentType } from './dto/create-payment.dto';
import { JwtPayload } from '@/common/interfaces/jwt-payload.interface';
import { JwtTokenService } from '@/auth/jwt/jwt.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PaymentStatusEnum } from 'nestjs-yookassa';
import { AppLogger } from '@/common/logger/logger.service';

describe('PaymentsController', () => {
  let controller: PaymentsController;
  let paymentsService: jest.Mocked<PaymentsService>;

  beforeEach(async () => {
    const mockPaymentsService = {
      createPayment: jest.fn(),
      createDonation: jest.fn(),
      donationList: jest.fn(),
      paymentList: jest.fn(),
      tariffList: jest.fn(),
      subscriptionList: jest.fn(),
      subscriptionPeriodList: jest.fn(),
      paymentItemList: jest.fn(),
      slotPackageList: jest.fn(),
      userSlotList: jest.fn(),
      listingSlotList: jest.fn(),
      seedData: jest.fn(),
      validateYookassaAuth: jest.fn(),
      processWebhook: jest.fn(),
      handleCronExpired: jest.fn(),
    };

    const mockJwtTokenService = {
      issueTokens: jest.fn(),
      verifyToken: jest.fn(),
      decodeToken: jest.fn(),
    };

    const mockAppLogger = {
      log: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
      debug: jest.fn(),
      verbose: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaymentsController],
      providers: [
        {
          provide: PaymentsService,
          useValue: mockPaymentsService,
        },
        {
          provide: AppLogger,
          useValue: mockAppLogger,
        },
        {
          provide: JwtTokenService,
          useValue: mockJwtTokenService,
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn(),
            verifyAsync: jest.fn(),
            decode: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
            getOrThrow: jest.fn(() => 'test-secret'),
          },
        },
      ],
    }).compile();

    controller = module.get<PaymentsController>(PaymentsController);
    paymentsService = module.get<jest.Mocked<PaymentsService>>(PaymentsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createPayment', () => {
    it('should create a payment', async () => {
      const user: JwtPayload = {
        id: 'user-123',
        name: 'Test User',
        email: 'test@example.com',
      };

      const createPaymentDto: CreatePaymentDto = new CreatePaymentDto(
        PaymentType.BUY_BASE_SUBSCRIPTION,
        1000,
        'RUB',
        30,
        ['package-1'],
      );

      const mockPaymentResponse = {
        id: 'payment-123',
        confirmationUrl: 'https://yookassa.ru/confirm',
        amount: 1000,
        currency: 'RUB',
        status: PaymentStatusEnum.PENDING,
      };

      paymentsService.createPayment.mockResolvedValue(mockPaymentResponse);

      const result = await controller.createPayment(user, createPaymentDto);

      expect(paymentsService.createPayment).toHaveBeenCalledWith(
        user.id,
        createPaymentDto,
      );
      expect(result).toEqual(mockPaymentResponse);
    });
  });
});
