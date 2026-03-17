import { Test, TestingModule } from '@nestjs/testing';
import { ReviewsController } from './reviews.controller';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { JwtPayload } from '@/common/interfaces/jwt-payload.interface';
import { JwtTokenService } from '@/auth/jwt/jwt.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AppLogger } from '@/common/logger/logger.service';

describe('ReviewsController', () => {
  let controller: ReviewsController;
  let reviewsService: jest.Mocked<ReviewsService>;

  beforeEach(async () => {
    const mockReviewsService = {
      getUserReviews: jest.fn(),
      createReviewToUser: jest.fn(),
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
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
      controllers: [ReviewsController],
      providers: [
        {
          provide: ReviewsService,
          useValue: mockReviewsService,
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

    controller = module.get<ReviewsController>(ReviewsController);
    reviewsService = module.get<jest.Mocked<ReviewsService>>(ReviewsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a review for listing', async () => {
      const user: JwtPayload = { 
        id: 'user-123', 
        name: 'Test User', 
        email: 'test@example.com' 
      };
      
      const createReviewDto: CreateReviewDto = new CreateReviewDto(
        'listing-123',
        'Great listing',
        'Excellent product, highly recommend',
        5,
        ['data:image/png;base64,test']
      );

      const mockReviewResponse = 'review-123';

      reviewsService.create.mockResolvedValue(mockReviewResponse);

      const result = await controller.create(user, createReviewDto);

      expect(reviewsService.create).toHaveBeenCalledWith(user.id, createReviewDto);
      expect(result).toEqual(mockReviewResponse);
    });
  });
});
