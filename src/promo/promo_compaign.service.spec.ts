import { Test, TestingModule } from '@nestjs/testing';
import { PromoCompaignService } from './promo_compaign.service';

describe('PromoCompaignService', () => {
  let service: PromoCompaignService;

  beforeEach(async () => {
    // Mock prisma
    const prisma = require('@/lib/prisma').prisma;
    prisma.promoCampaign = {
      findUnique: jest.fn(),
      create: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      count: jest.fn(),
    };
    prisma.promoCampaignParticipant = {
      count: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [PromoCompaignService],
    }).compile();

    service = module.get<PromoCompaignService>(PromoCompaignService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
