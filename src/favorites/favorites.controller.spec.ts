import { Test, TestingModule } from '@nestjs/testing';
import { FavoriteController } from './favorites.controller';
import { FavoriteService } from './favorites.service';
import { JwtTokenService } from '@/auth/jwt/jwt.service';
import { AppLogger } from '@/common/logger/logger.service';

describe('FavoritesController', () => {
  let controller: FavoriteController;
  let favoritesService: jest.Mocked<FavoriteService>;

  beforeEach(async () => {
    const mockFavoriteService = {
      getById: jest.fn(),
      getList: jest.fn(),
      create: jest.fn(),
      delete: jest.fn(),
    };

    const mockJwtTokenService = {
      issueTokens: jest.fn(),
      verityToken: jest.fn(),
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
      controllers: [FavoriteController],
      providers: [
        {
          provide: FavoriteService,
          useValue: mockFavoriteService,
        },
        {
          provide: JwtTokenService,
          useValue: mockJwtTokenService,
        },
        {
          provide: AppLogger,
          useValue: mockAppLogger,
        },
      ],
    }).compile();

    controller = module.get<FavoriteController>(FavoriteController);
    favoritesService =
      module.get<jest.Mocked<FavoriteService>>(FavoriteService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getById', () => {
    it('should return favorite by id', async () => {
      const result = {
        id: '123-e456-7890-abcd-ef1234567890',
        userId: '123-e456-7890-abcd-ef1234567890',
        type: 'LISTING',
        listingId: '123-e456-7890-abcd-ef1234567890',
        targetUserId: null,
        createdAt: new Date(),
        listing: null,
      };

      favoritesService.getById.mockResolvedValue(result);

      const response = await controller.getFavorites(
        '123-e456-7890-abcd-ef1234567890',
      );

      expect(favoritesService.getById).toHaveBeenCalledWith(
        '123-e456-7890-abcd-ef1234567890',
      );
      expect(response).toEqual(result);
    });
  });
});
