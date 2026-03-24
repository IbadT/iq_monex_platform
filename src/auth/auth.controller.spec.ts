import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TokensDto } from './dto/tokens.dto';
import { LoginResponseDto } from './dto/response/login-response.dto';
import { User } from '@/users/entities/user.entity';
import { JwtTokenService } from './jwt/jwt.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: jest.Mocked<AuthService>;

  beforeEach(async () => {
    const mockAuthService = {
      login: jest.fn(),
      register: jest.fn(),
      refreshToken: jest.fn(),
      logout: jest.fn(),
      resetPassword: jest.fn(),
      confirmResetPassword: jest.fn(),
      getMe: jest.fn(),
    };

    const mockJwtTokenService = {
      issueTokens: jest.fn(),
      verifyToken: jest.fn(),
      decodeToken: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
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

    controller = module.get<AuthController>(AuthController);
    authService = module.get(AuthService);

    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should return login response with tokens', async () => {
      const loginDto = { email: 'test@example.com', password: 'password123' };
      const mockUser: User = {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        accountNumber: '12345678',
        isVerified: true,
        rating: 0,
        reviewsCount: 0,
        profile: null,
        workers: [],
        receivedReviews: [],
        userActivities: [],
        locations: [],
        favorites: [],
        favoritedBy: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const mockTokens: LoginResponseDto = {
        user: mockUser,
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      };

      authService.login.mockResolvedValue(mockTokens);

      const result = await controller.login(loginDto, {
        cookie: jest.fn(),
      } as any);

      expect(authService.login).toHaveBeenCalledWith(loginDto);
      expect(result).toEqual(mockTokens);
    });
  });

  describe('refreshToken', () => {
    it('should refresh tokens successfully', async () => {
      const mockRequest = { cookies: { refreshToken: 'refresh-token' } } as any;
      const mockTokens: TokensDto = {
        accessToken: 'new-access-token',
        refreshToken: 'new-refresh-token',
      };

      authService.refreshToken.mockResolvedValue(mockTokens);

      const result = await controller.refreshToken(mockRequest, {
        cookie: jest.fn(),
      } as any);

      expect(authService.refreshToken).toHaveBeenCalledWith({
        refreshToken: 'refresh-token',
      });
      expect(result).toEqual(mockTokens);
    });

    it('should throw BadRequestException if no refresh token in cookies', async () => {
      const mockRequest = { cookies: {} } as any;
      const error = new BadRequestException('Refresh token обязателен');

      authService.refreshToken.mockRejectedValue(error);

      await expect(
        controller.refreshToken(mockRequest, { cookie: jest.fn() } as any),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('logOut', () => {
    it('should logout successfully', async () => {
      const mockUser = { id: '1', email: 'test@example.com' };

      await controller.logOut(
        mockUser as any,
        { clearCookie: jest.fn() } as any,
      );

      expect(authService.logout).toHaveBeenCalledWith(mockUser.id);
    });
  });

  describe('resetPassword', () => {
    it('should send reset password email', async () => {
      const resetPasswordDto = { email: 'test@example.com' };
      const mockResponse = {
        message: 'Код для сброса пароля отправлен на ваш email',
        status: 200,
      };

      authService.resetPassword.mockResolvedValue(mockResponse);

      const result = await controller.resetPassword(resetPasswordDto);

      expect(authService.resetPassword).toHaveBeenCalledWith(resetPasswordDto);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('confirmResetPassword', () => {
    it('should confirm password reset', async () => {
      const confirmResetPasswordDto = {
        email: 'test@example.com',
        code: '123456',
        newPassword: 'newPassword123',
      };
      const mockResponse = { message: 'Пароль успешно изменен', status: 200 };

      authService.confirmResetPassword.mockResolvedValue(mockResponse);

      const result = await controller.confirmResetPassword(
        confirmResetPasswordDto,
      );

      expect(authService.confirmResetPassword).toHaveBeenCalledWith(
        confirmResetPasswordDto,
      );
      expect(result).toEqual(mockResponse);
    });
  });
});
