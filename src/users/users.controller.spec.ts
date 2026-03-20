import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtPayload } from '@/common/interfaces/jwt-payload.interface';
import { JwtTokenService } from '@/auth/jwt/jwt.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: jest.Mocked<UsersService>;

  beforeEach(async () => {
    const mockUsersService = {
      getUserById: jest.fn(),
      getUserByAccountNumber: jest.fn(),
      getUserFavoritesProfiles: jest.fn(),
      addFavoriteToUser: jest.fn(),
      makeComplaintToUser: jest.fn(),
      seedRoles: jest.fn(),
      updateUser: jest.fn(),
    };

    const mockJwtTokenService = {
      issueTokens: jest.fn(),
      verifyToken: jest.fn(),
      decodeToken: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
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

    controller = module.get<UsersController>(UsersController);
    usersService = module.get<jest.Mocked<UsersService>>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('updateProfile', () => {
    it('should update user profile', async () => {
      const user: JwtPayload = {
        id: 'user-123',
        name: 'Test User',
        email: 'test@example.com',
      };

      const updateUserDto: UpdateUserDto = new UpdateUserDto('Updated Name');

      const mockUpdatedUser = {
        id: user.id,
        name: 'Updated Name',
        email: user.email || 'test@example.com',
        accountNumber: '12345678',
        isVerified: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        rating: null,
        password: 'hashed-password',
        reviewsCount: 0,
        roleId: 'role-123',
      };

      usersService.updateUser.mockResolvedValue(mockUpdatedUser);

      const result = await controller.updateProfile(user, updateUserDto);

      expect(usersService.updateUser).toHaveBeenCalledWith(
        user.id,
        updateUserDto,
      );
      expect(result).toEqual(mockUpdatedUser);
    });
  });
});
