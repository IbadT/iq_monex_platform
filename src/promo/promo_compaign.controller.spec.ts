import { Test, TestingModule } from '@nestjs/testing';
import { PromoController } from './promo.controller';
import { PromoCompaignService } from './promo_compaign.service';
import { PromoParticipantService } from './promo_participant.service';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { RolesGuard } from '@/common/guards/roles.guard';

describe('PromoCompaignController', () => {
  let controller: PromoController;

  beforeEach(async () => {
    // Mock prisma
    const prisma = require('@/lib/prisma').prisma;
    prisma.promoCampaign = {
      findUnique: jest.fn(),
      create: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      count: jest.fn(),
      findFirst: jest.fn(),
    };
    prisma.promoCampaignParticipant = {
      count: jest.fn(),
    };

    const mockPromoCompaignService = {
      create: jest.fn(),
      promoCompaignsList: jest.fn(),
      promoCompaignCount: jest.fn(),
      changeStatus: jest.fn(),
      getUserStatus: jest.fn(),
      checkAndSwitchCampaigns: jest.fn(),
      getActiveCampaignForJoin: jest.fn(),
    };

    const mockPromoParticipantService = {
      getUserCampaignStatus: jest.fn(),
      joinCampaign: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [PromoController],
      providers: [
        {
          provide: PromoCompaignService,
          useValue: mockPromoCompaignService,
        },
        {
          provide: PromoParticipantService,
          useValue: mockPromoParticipantService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<PromoController>(PromoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
