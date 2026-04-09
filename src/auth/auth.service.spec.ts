import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { HashService } from './hash.service';
import { UsersService } from '@/users/users.service';
import { JwtTokenService } from './jwt/jwt.service';
import { AppLogger } from '@/common/logger/logger.service';
import { CacheService } from '@/cache/cacheService.service';
import { RabbitmqService } from '@/rabbitmq/rabbitmq.service';
import { ConfigService } from '@nestjs/config';
import { LoginUserDto } from './dto/request/login-user.dto';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { User } from '@/users/entities/user.entity';
import { RoleType } from '@/users/enums/role-type.enum';
import { LoginResponseDto } from './dto/response/login-response.dto';
import { UserLoginResponseDto } from './dto/response/user-login-response.dto';
import { PromoParticipantService } from '@/promo/promo_participant.service';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: jest.Mocked<UsersService>;
  let hashService: jest.Mocked<HashService>;
  let jwtTokenService: jest.Mocked<JwtTokenService>;
  let logger: jest.Mocked<AppLogger>;

  beforeEach(async () => {
    const mockUsersService = {
      getUserByEmailWithPassword: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      findById: jest.fn(),
      removePassword: jest.fn(),
    };

    const mockHashService = {
      hash: jest.fn(),
      compare: jest.fn(),
    };

    const mockJwtTokenService = {
      issueTokens: jest.fn(),
      verifyToken: jest.fn(),
      decodeToken: jest.fn(),
    };

    const mockCacheService = {
      get: jest.fn(),
      set: jest.fn(),
      del: jest.fn(),
    };

    const mockRabbitmqService = {
      sendMessage: jest.fn(),
      sendEmailVerification: jest.fn(),
      sendPasswordReset: jest.fn(),
    };

    const mockLogger = {
      log: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
      debug: jest.fn(),
      verbose: jest.fn(),
      logAuth: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: HashService,
          useValue: mockHashService,
        },
        {
          provide: JwtTokenService,
          useValue: mockJwtTokenService,
        },
        {
          provide: CacheService,
          useValue: mockCacheService,
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
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
            getOrThrow: jest.fn(),
          },
        },
        {
          provide: PromoParticipantService,
          useValue: {
            joinActiveCampaign: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<jest.Mocked<UsersService>>(UsersService);
    hashService = module.get<jest.Mocked<HashService>>(HashService);
    jwtTokenService = module.get<jest.Mocked<JwtTokenService>>(JwtTokenService);
    logger = module.get<jest.Mocked<AppLogger>>(AppLogger);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('login', () => {
    it('should successfully login user with valid credentials', async () => {
      const loginUserDto: LoginUserDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      const mockUser: any = {
        id: 'user-123',
        email: 'test@example.com',
        name: 'Test User',
        accountNumber: '12345678',
        isVerified: true,
        password: 'hashed-password',
        rating: 0,
        reviewsCount: 0,
        roleId: 'role-123',
        role: {
          id: 'role-123',
          role: 'USER',
          code: 'USER',
          type: RoleType.USER,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        profile: {
          id: 'profile-123',
          userId: 'user-123',
          legalEntityTypeId: 1,
          currencyId: 1,
          avatarUrl: null,
          phone: null,
          email: null,
          telegram: null,
          siteUrl: null,
          description: null,
          createdAt: new Date(),
          updatedAt: new Date(),
          legalEntityType: {
            id: 1,
            data: {},
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          currency: {
            id: 1,
            symbol: 'RUB',
            code: 'RUB',
            name: {},
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        },
        workers: [],
        receivedReviews: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockTokens = {
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      };

      const expectedUser: User = {
        id: mockUser.id,
        email: mockUser.email,
        name: mockUser.name,
        accountNumber: mockUser.accountNumber,
        isVerified: mockUser.isVerified,
        rating: 0,
        reviewsCount: 0,
        profile: null,
        workers: [],
        receivedReviews: [],
        userActivities: [],
        locations: [],
        favorites: [],
        favoritedBy: [],
        createdAt: mockUser.createdAt,
        updatedAt: mockUser.updatedAt,
      };

      usersService.getUserByEmailWithPassword.mockResolvedValue(mockUser);
      hashService.compare.mockResolvedValue(true);
      jwtTokenService.issueTokens.mockResolvedValue(mockTokens);

      const result = await service.login(loginUserDto);

      expect(usersService.getUserByEmailWithPassword).toHaveBeenCalledWith(
        loginUserDto.email,
      );
      expect(hashService.compare).toHaveBeenCalledWith(
        mockUser.password,
        loginUserDto.password,
      );
      expect(jwtTokenService.issueTokens).toHaveBeenCalledWith(
        mockUser.id,
        mockUser.role.role,
        mockUser.name,
        mockUser.email,
      );
      expect(logger.logAuth).toHaveBeenCalledWith(
        'login_success',
        mockUser.id,
        loginUserDto.email,
      );
      expect(result).toEqual(
        new LoginResponseDto(
          mockTokens.accessToken,
          mockTokens.refreshToken,
          new UserLoginResponseDto(expectedUser.id, expectedUser.email),
        ),
      );
    });

    it('should throw NotFoundException if user does not exist', async () => {
      const loginUserDto: LoginUserDto = {
        email: 'nonexistent@example.com',
        password: 'password123',
      };

      usersService.getUserByEmailWithPassword.mockResolvedValue(null);

      await expect(service.login(loginUserDto)).rejects.toThrow(
        new NotFoundException(
          'Пользователь с email: nonexistent@example.com не найден',
        ),
      );

      expect(logger.logAuth).toHaveBeenCalledWith(
        'login_failed_user_not_found',
        undefined,
        loginUserDto.email,
      );
      expect(hashService.compare).not.toHaveBeenCalled();
      expect(jwtTokenService.issueTokens).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedException if password is invalid', async () => {
      const loginUserDto: LoginUserDto = {
        email: 'test@example.com',
        password: 'wrong-password',
      };

      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        name: 'Test User',
        accountNumber: '12345678',
        isVerified: true,
        password: 'hashed-password',
        rating: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        reviewsCount: 0,
        roleId: 'role-123',
        isBanned: false,
        banReason: null,
        role: {
          id: 'role-123',
          role: 'USER',
          code: 'USER',
          type: RoleType.USER,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      };

      usersService.getUserByEmailWithPassword.mockResolvedValue(mockUser);
      hashService.compare.mockResolvedValue(false);

      await expect(service.login(loginUserDto)).rejects.toThrow(
        new UnauthorizedException('Неверный пароль'),
      );

      expect(logger.logAuth).toHaveBeenCalledWith(
        'login_failed_invalid_password',
        mockUser.id,
        loginUserDto.email,
      );
      expect(jwtTokenService.issueTokens).not.toHaveBeenCalled();
    });
  });
});
