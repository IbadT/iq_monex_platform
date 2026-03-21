import { Test, TestingModule } from '@nestjs/testing';
import { ActivitiesController } from './activities.controller';
import { ActivitiesService } from './activities.service';
import { CacheService } from '@/cache/cacheService.service';
import { JwtTokenService } from '@/auth/jwt/jwt.service';
import { Reflector } from '@nestjs/core';

describe('ActivitiesController', () => {
  let controller: ActivitiesController;

  beforeEach(async () => {
    const mockActivitiesService = {
      getAllActivities: jest.fn(),
      getActivityById: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ActivitiesController],
      providers: [
        ActivitiesService,
        {
          provide: CacheService,
          useValue: {
            get: jest.fn(),
            set: jest.fn(),
            del: jest.fn(),
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
      .overrideProvider(ActivitiesService)
      .useValue(mockActivitiesService)
      .compile();

    controller = module.get<ActivitiesController>(ActivitiesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
