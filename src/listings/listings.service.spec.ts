import { Test, TestingModule } from '@nestjs/testing';
import { ListingsService } from './listings.service';
import { ListingQueryDto } from './dto/request/listing-query.dto';
import { ListingStatus, ListingCondition } from './enums/listing-status.enum';
import { CacheService } from '@/cache/cacheService.service';
import { S3Service } from '@/s3/s3.service';
import { SubscriptionService } from '@/subscription/subscription.service';
import { SearchService } from '@/search/search.service';
import { RabbitmqService } from '@/rabbitmq/rabbitmq.service';
import { AppLogger } from '@/common/logger/logger.service';
import { CategoriesService } from '@/categories/categories.service';
import { DictionariesService } from '@/dictionaries/dictionaries.service';
import { MapLocationsService } from '@/map_locations/map_locations.service';
import { FileService } from '@/s3/file.service';
import { PromoParticipantService } from '@/promo/promo_participant.service';
import { ViewTrackerService } from '@/view-tracker/view-tracker.service';

describe('ListingsService', () => {
  let service: ListingsService;

  beforeEach(async () => {
    const mockCacheService = {
      get: jest.fn(),
      set: jest.fn(),
      del: jest.fn(),
    };

    const mockS3Service = {
      uploadFile: jest.fn(),
      deleteFile: jest.fn(),
      getFileUrl: jest.fn(),
      getContentTypeFromBase64: jest.fn(),
      getFileSizeFromBase64: jest.fn(),
    };

    const mockSubscriptionService = {
      getUserAvailableSlots: jest.fn(),
      getUserSlots: jest.fn(),
    };

    const mockSearchService = {
      indexListing: jest.fn(),
      searchListings: jest.fn(),
      deleteListing: jest.fn(),
    };

    const mockRabbitmqService = {
      sendMessage: jest.fn(),
      sendListingFileUpload: jest.fn(),
    };

    const mockLogger = {
      log: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
      debug: jest.fn(),
      verbose: jest.fn(),
    };

    const mockCategoriesService = {
      checkCategoryById: jest.fn(),
    };

    const mockDictionariesService = {
      chechCurrencyById: jest.fn(),
      checkUnitMeasurement: jest.fn(),
    };

    const mockMapLocationsService = {
      createMapLocationsForListing: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ListingsService,
        {
          provide: CacheService,
          useValue: mockCacheService,
        },
        {
          provide: S3Service,
          useValue: mockS3Service,
        },
        {
          provide: SubscriptionService,
          useValue: mockSubscriptionService,
        },
        {
          provide: SearchService,
          useValue: mockSearchService,
        },
        {
          provide: RabbitmqService,
          useValue: mockRabbitmqService,
        },
        {
          provide: AppLogger,
          useValue: mockLogger,
        },
        {
          provide: CategoriesService,
          useValue: mockCategoriesService,
        },
        {
          provide: DictionariesService,
          useValue: mockDictionariesService,
        },
        {
          provide: MapLocationsService,
          useValue: mockMapLocationsService,
        },
        {
          provide: FileService,
          useValue: {
            processUserAvatar: jest.fn(),
            replaceUserFilesArray: jest.fn(),
            enqueueFilesUpload: jest.fn(),
            enqueueAvatarUploadIfNeeded: jest.fn(),
            replaceListingFilesArray: jest.fn(),
          },
        },
        {
          provide: PromoParticipantService,
          useValue: {
            checkUserConditions: jest.fn(),
          },
        },
        {
          provide: ViewTrackerService,
          useValue: {
            trackView: jest.fn(),
            hasViewed: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ListingsService>(ListingsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('listingList', () => {
    it('should return paginated listings with filters', async () => {
      const query: ListingQueryDto = {
        limit: 10,
        offset: 0,
        status: ListingStatus.PUBLISHED,
        condition: ListingCondition.NEW,
        search: 'test',
      };

      const mockListings = [
        {
          id: 'listing-1',
          title: 'Test Listing 1',
          description: 'Test description 1',
          status: ListingStatus.PUBLISHED,
          condition: ListingCondition.NEW,
          price: 1000,
          currency: { id: 1, code: 'RUB', symbol: '₽' },
          priceUnit: { id: 1, name: 'шт' },
          category: { id: 1, name: 'Electronics' },
          files: [
            { id: 'file-1', kind: 'PHOTO', url: 'photo1.jpg' },
            { id: 'file-2', kind: 'DOCUMENT', url: 'doc1.pdf' },
          ],
          locations: [{ id: 'loc-1', city: 'Moscow' }],
          specifications: [{ id: 'spec-1', name: 'Color', value: 'Black' }],
          userSpecifications: [],
          listingSlot: { id: 'slot-1', userSlot: { id: 'user-slot-1' } },
          user: { id: 'user-1', name: 'Test User', files: [] },
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'listing-2',
          title: 'Test Listing 2',
          description: 'Test description 2',
          status: ListingStatus.PUBLISHED,
          condition: ListingCondition.NEW,
          price: 2000,
          currency: { id: 1, code: 'RUB', symbol: '₽' },
          priceUnit: { id: 1, name: 'шт' },
          category: { id: 2, name: 'Books' },
          files: [{ id: 'file-3', kind: 'PHOTO', url: 'photo2.jpg' }],
          locations: [{ id: 'loc-2', city: 'St. Petersburg' }],
          specifications: [{ id: 'spec-2', name: 'Author', value: 'John Doe' }],
          userSpecifications: [],
          listingSlot: { id: 'slot-2', userSlot: { id: 'user-slot-2' } },
          user: { id: 'user-2', name: 'Test User 2', files: [] },
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      const expectedWhere = {
        status: ListingStatus.PUBLISHED,
        condition: ListingCondition.NEW,
        OR: [
          { title: { contains: 'test', mode: 'insensitive' } },
          { description: { contains: 'test', mode: 'insensitive' } },
        ],
      };

      // Mock prisma methods
      const prisma = require('@/lib/prisma').prisma;
      prisma.listing.count = jest.fn().mockResolvedValue(2);
      prisma.listing.findMany = jest.fn().mockResolvedValue(mockListings);

      const result = await service.listingList(query);

      expect(prisma.listing.count).toHaveBeenCalledWith({
        where: expectedWhere,
      });
      expect(prisma.listing.findMany).toHaveBeenCalledWith({
        where: expectedWhere,
        include: {
          category: true,
          subcategory: true,
          subsubcategory: true,
          currency: true,
          priceUnit: true,
          files: true,
          locations: true,
          specifications: {
            include: {
              specification: true,
            },
          },
          userSpecifications: {
            include: {
              userSpecification: true,
            },
          },
          listingSlot: {
            include: {
              userSlot: true,
            },
          },
          user: {
            select: {
              id: true,
              name: true,
              accountNumber: true,
              files: {
                select: {
                  url: true,
                },
                where: {
                  kind: 'AVATAR',
                },
              },
              profile: {
                select: {
                  avatarUrl: true,
                  legalEntityType: {
                    select: {
                      id: true,
                      data: true,
                    },
                  },
                },
              },
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: 10,
        skip: 0,
      });

      // Verify result has correct structure (DTOs, not plain objects)
      expect(result.rows).toHaveLength(2);
      expect(result.rows[0]).toHaveProperty('id', 'listing-1');
      expect(result.rows[0]).toHaveProperty('title', 'Test Listing 1');
      expect(result.rows[1]).toHaveProperty('id', 'listing-2');
      expect(result.pagination).toEqual({
        total: 2,
        limit: 10,
        offset: 0,
        hasMore: false,
      });
    });

    it('should return listings with default pagination values', async () => {
      const query: ListingQueryDto = {};

      const mockListings = [
        {
          id: 'listing-1',
          title: 'Test Listing',
          status: ListingStatus.PUBLISHED,
          currency: { id: 1, code: 'RUB', symbol: '₽' },
          priceUnit: { id: 1, name: 'шт' },
          category: { id: 1, name: 'Electronics' },
          files: [],
          locations: [],
          specifications: [],
          userSpecifications: [],
          listingSlot: { id: 'slot-1', userSlot: { id: 'user-slot-1' } },
          user: { id: 'user-1', name: 'Test User', files: [] },
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      // Mock prisma methods
      const prisma = require('@/lib/prisma').prisma;
      prisma.listing.count = jest.fn().mockResolvedValue(1);
      prisma.listing.findMany = jest.fn().mockResolvedValue(mockListings);

      const result = await service.listingList(query);

      expect(prisma.listing.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          take: 20,
          skip: 0,
        }),
      );

      expect(result.pagination).toEqual({
        total: 1,
        limit: 20,
        offset: 0,
        hasMore: false,
      });
    });
  });
});
