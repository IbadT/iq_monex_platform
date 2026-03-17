import { Test, TestingModule } from '@nestjs/testing';
import { SubscriptionController } from './subscription.controller';
import { SubscriptionService } from './subscription.service';
import { ChangeListingSlotDto } from './dto/change-listing-slot.dto';
import { JwtPayload } from '@/common/interfaces/jwt-payload.interface';
import { JwtTokenService } from '@/auth/jwt/jwt.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

describe('SubscriptionController', () => {
  let controller: SubscriptionController;
  let subscriptionService: jest.Mocked<SubscriptionService>;

  beforeEach(async () => {
    const mockSubscriptionService = {
      changeListingSlot: jest.fn(),
      getUserAvailableSlots: jest.fn(),
      getUserSlots: jest.fn(),
      getUserPackages: jest.fn(),
    };

    const mockJwtTokenService = {
      issueTokens: jest.fn(),
      verifyToken: jest.fn(),
      decodeToken: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [SubscriptionController],
      providers: [
        {
          provide: SubscriptionService,
          useValue: mockSubscriptionService,
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

    controller = module.get<SubscriptionController>(SubscriptionController);
    subscriptionService = module.get<jest.Mocked<SubscriptionService>>(SubscriptionService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('changeListingSlot', () => {
    it('should change listing slot', async () => {
      const user: JwtPayload = { 
        id: 'user-123', 
        name: 'Test User', 
        email: 'test@example.com' 
      };
      
      const changeListingSlotDto: ChangeListingSlotDto = new ChangeListingSlotDto(
        'listing-123',
        'slot-456',
        'slot-789'
      );

      const mockResponse = {
        message: 'Объявление успешно перемещено',
        fromSlotId: 'slot-456',
        toSlotId: 'slot-789',
        listingId: 'listing-123',
      };

      subscriptionService.changeListingSlot.mockResolvedValue(mockResponse);

      const result = await controller.changeListingSlot(user, changeListingSlotDto);

      expect(subscriptionService.changeListingSlot).toHaveBeenCalledWith(user.id, changeListingSlotDto);
      expect(result).toEqual(mockResponse);
    });
  });
});
