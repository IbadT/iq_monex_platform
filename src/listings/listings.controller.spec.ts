import { Test, TestingModule } from '@nestjs/testing';
import { ListingsController } from './listings.controller';
import { ListingsService } from './listings.service';
import { StatusQueryDto } from './dto/request/status-query.dto';
import { JwtTokenService } from '@/auth/jwt/jwt.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ListingStatus } from './enums/listing-status.enum';

describe('ListingsController', () => {
  let controller: ListingsController;
  let listingsService: jest.Mocked<ListingsService>;

  beforeEach(async () => {
    const mockListingsService = {
      listingList: jest.fn(),
      searchListings: jest.fn(),
      listingById: jest.fn(),
      getRecomendsByListingId: jest.fn(),
      listingsByUserId: jest.fn(),
      createListing: jest.fn(),
      changeListingStatus: jest.fn(),
      makeComplaintToListing: jest.fn(),
      editListingById: jest.fn(),
      deleteListingById: jest.fn(),
    };

    const mockJwtTokenService = {
      issueTokens: jest.fn(),
      verifyToken: jest.fn(),
      decodeToken: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ListingsController],
      providers: [
        {
          provide: ListingsService,
          useValue: mockListingsService,
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

    controller = module.get<ListingsController>(ListingsController);
    listingsService = module.get<jest.Mocked<ListingsService>>(ListingsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('listingById', () => {
    it('should return listing by id', async () => {
      const listingId = '123e4567-e89b-12d3-a456-426614174000';
      const query: StatusQueryDto = { status: ListingStatus.PUBLISHED };

      const mockListing = {
        id: listingId,
        title: 'Test Listing',
        description: 'Test Description',
        price: 1000,
        status: ListingStatus.PUBLISHED,
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: 'user-123',
        categoryId: 1,
        rating: 0,
        reviewsCount: 0,
        currencyId: null,
        priceUnitId: null,
        condition: null,
        viewsCount: 0,
        favoritesCount: 0,
        likesCount: 0,
        version: 1,
        publishedAt: new Date(),
        archivedAt: null,
        autoDeleteAt: null,
        lastUsedAt: null,
        files: [],
        photos: [],
        currency: null,
        priceUnit: null,
        locations: [],
        category: {
          id: 1,
          name: 'Test Category',
        },
        user: {
          id: 'user-123',
          name: 'Test User',
          email: 'test@example.com',
        },
        specifications: [],
      };

      listingsService.listingById.mockResolvedValue(mockListing as any);

      const result = await controller.listingById(listingId, query);

      expect(listingsService.listingById).toHaveBeenCalledWith(
        listingId,
        query,
        undefined,
      );
      expect(result).toEqual(mockListing);
    });
  });
});
