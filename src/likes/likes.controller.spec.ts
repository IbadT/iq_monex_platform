import { Test, TestingModule } from '@nestjs/testing';
import { LikesController } from './likes.controller';
import { LikesService } from './likes.service';
import { SendLikeDto } from '@/listings/dto/request/send-like.dto';
import { JwtPayload } from '@/common/interfaces/jwt-payload.interface';
import { JwtTokenService } from '@/auth/jwt/jwt.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

describe('LikesController', () => {
  let controller: LikesController;
  let likeService: jest.Mocked<LikesService>;

  beforeEach(async () => {
    const mockLikeService = {
      toggleLike: jest.fn(),
      getListingLikes: jest.fn(),
    };

    const mockJwtTokenService = {
      issueTokens: jest.fn(),
      verifyToken: jest.fn(),
      decodeToken: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [LikesController],
      providers: [
        {
          provide: LikesService,
          useValue: mockLikeService,
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

    controller = module.get<LikesController>(LikesController);
    likeService = module.get<jest.Mocked<LikesService>>(LikesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('toggleLike', () => {
    it('should toggle like', async () => {
      const listingId = '123-e456-7890-abcd-ef1234567890';
      const userId = '123-e456-7890-abcd-ef1234567891';

      const sendLikeDto = new SendLikeDto(listingId);
      const user: JwtPayload = {
        id: userId,
        name: 'Test User',
        email: 'test@example.com',
      };

      const result = {
        id: listingId,
        message: 'Лайк успешно добавлен',
        action: 'liked',
        like: {
          id: '123-e456-7890-abcd-ef1234567892',
          listingId,
          userId,
          createdAt: new Date(),
          user: {
            id: userId,
            name: 'Test User',
          },
          listing: {
            id: listingId,
            title: 'Test Listing',
            likesCount: 1,
            version: 1,
          },
        },
      };

      likeService.toggleLike.mockResolvedValue(result);

      const response = await controller.toggleLike(sendLikeDto, user);

      expect(likeService.toggleLike).toHaveBeenCalledWith(listingId, userId);
      expect(response).toEqual(result);
    });
  });
});
