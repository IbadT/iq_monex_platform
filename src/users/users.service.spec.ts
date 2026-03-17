import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { AppLogger } from '@/common/logger/logger.service';
import { CacheService } from '@/cache/cacheService.service';
const prisma = require('@/lib/prisma').prisma;

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const mockCacheService = {
      getUserById: jest.fn(),
      setUserById: jest.fn(),
      delUserById: jest.fn(),
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

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: CacheService,
          useValue: mockCacheService,
        },
        {
          provide: AppLogger,
          useValue: mockLogger,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getUserByEmailWithPassword', () => {
    it('should return user by email', async () => {
      const email = 'test@example.com';
      
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
      };

      // Mock prisma.user.findUnique
      
      prisma.user.findUnique = jest.fn().mockResolvedValue(mockUser);

      const result = await service.getUserByEmailWithPassword(email);

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email },
      });
      expect(result).toEqual(mockUser);
    });

    it('should return null if user not found', async () => {
      const email = 'nonexistent@example.com';

      // Mock prisma.user.findUnique
      
      prisma.user.findUnique = jest.fn().mockResolvedValue(null);

      const result = await service.getUserByEmailWithPassword(email);

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email },
      });
      expect(result).toBeNull();
    });
  });

  describe('updateUser', () => {
    it('should update user successfully', async () => {
      const userId = 'user-123';
      const updateData = { name: 'Updated Name' };

      const mockUpdatedUser = {
        id: userId,
        name: 'Updated Name',
        email: 'test@example.com',
        accountNumber: '12345678',
        isVerified: true,
        password: 'hashed-password',
        rating: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        reviewsCount: 0,
        roleId: 'role-123',
      };

      // Mock prisma.user.update
      prisma.user.update = jest.fn().mockResolvedValue(mockUpdatedUser);

      const result = await service.updateUser(userId, updateData);

      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: userId },
        data: updateData,
      });
      expect(result).toEqual(mockUpdatedUser);
    });

    it('should update user with multiple fields', async () => {
      const userId = 'user-123';
      const updateData = { 
        name: 'Updated Name',
        email: 'updated@example.com'
      };

      const mockUpdatedUser = {
        id: userId,
        name: 'Updated Name',
        email: 'updated@example.com',
        accountNumber: '12345678',
        isVerified: true,
        password: 'hashed-password',
        rating: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        reviewsCount: 0,
        roleId: 'role-123',
      };

      // Mock prisma.user.update
      prisma.user.update = jest.fn().mockResolvedValue(mockUpdatedUser);

      const result = await service.updateUser(userId, updateData);

      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: userId },
        data: updateData,
      });
      expect(result).toEqual(mockUpdatedUser);
    });
  });
});
