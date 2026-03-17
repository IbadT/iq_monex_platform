import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JwtTokenService } from '@/auth/jwt/jwt.service';
import { Reflector } from '@nestjs/core';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const mockJwtTokenService = {
      verifyToken: jest.fn().mockResolvedValue({
        id: 'user-123',
        email: 'test@example.com',
        name: 'Test User',
      }),
    };

    const mockReflector = {
      getAllAndOverride: jest.fn().mockReturnValue(false),
    };

    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        AppService,
        {
          provide: JwtTokenService,
          useValue: mockJwtTokenService,
        },
        {
          provide: Reflector,
          useValue: mockReflector,
        },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "Pong"', () => {
      expect(appController.getHello()).toBe('Pong');
    });
  });
});
