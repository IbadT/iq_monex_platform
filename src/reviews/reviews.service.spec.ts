import { Test, TestingModule } from '@nestjs/testing';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { AppLogger } from '@/common/logger/logger.service';
import { CacheService } from '@/cache/cacheService.service';
import { S3Service } from '@/s3/s3.service';
import { RabbitmqService } from '@/rabbitmq/rabbitmq.service';
import { NotFoundException } from '@nestjs/common';

describe('ReviewsService', () => {
  let service: ReviewsService;

  beforeEach(async () => {
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

    const mockS3Service = {
      uploadFile: jest.fn(),
      deleteFile: jest.fn(),
      getFileUrl: jest.fn(),
      getContentTypeFromBase64: jest.fn(),
      getFileSizeFromBase64: jest.fn(),
    };

    const mockRabbitmqService = {
      sendMessage: jest.fn(),
      sendReviewFileUpload: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReviewsService,
        {
          provide: CacheService,
          useValue: mockCacheService,
        },
        {
          provide: AppLogger,
          useValue: mockLogger,
        },
        {
          provide: S3Service,
          useValue: mockS3Service,
        },
        {
          provide: RabbitmqService,
          useValue: mockRabbitmqService,
        },
      ],
    }).compile();

    service = module.get<ReviewsService>(ReviewsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a review successfully', async () => {
      const authorId = 'user-123';
      const createReviewDto: CreateReviewDto = new CreateReviewDto(
        '123e4567-e89b-12d3-a456-426614174000',
        'Great listing',
        'Excellent product, highly recommend',
        5,
        ['data:image/png;base64,test']
      );

      // Mock prisma methods at the top level
      const prisma = require('@/lib/prisma').prisma;
      
      // Mock findFirst for listing check
      prisma.listing.findFirst = jest.fn().mockResolvedValue({
        id: '123e4567-e89b-12d3-a456-426614174000',
        status: 'PUBLISHED',
      });
      
      // Mock the entire transaction
      prisma.$transaction = jest.fn().mockResolvedValue('review-123');

      const result = await service.create(authorId, createReviewDto);

      expect(prisma.$transaction).toHaveBeenCalled();
      expect(result).toBe('review-123');
    });

    it('should throw NotFoundException if listing not found', async () => {
      const authorId = 'user-123';
      const createReviewDto: CreateReviewDto = new CreateReviewDto(
        '123e4567-e89b-12d3-a456-426614174999',
        'Great listing',
        'Excellent product, highly recommend',
        5,
        ['data:image/png;base64,test']
      );

      // Mock prisma methods
      const prisma = require('@/lib/prisma').prisma;
      
      // Mock findFirst for listing check
      prisma.listing.findFirst = jest.fn().mockResolvedValue(null); // Listing not found

      await expect(service.create(authorId, createReviewDto)).rejects.toThrow(
        new NotFoundException('Объявления с id: 123e4567-e89b-12d3-a456-426614174999 не найдено')
      );
    });
  });
});
