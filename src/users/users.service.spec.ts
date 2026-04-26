import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { AppLogger } from '@/common/logger/logger.service';
import { CacheService } from '@/cache/cacheService.service';
import { WorkersService } from '@/workers/workers.service';
import { MapLocationsService } from '@/map_locations/map_locations.service';
import { ActivitiesService } from '@/activities/activities.service';
import { SearchService } from '@/search/search.service';
import { S3Service } from '@/s3/s3.service';
import { RabbitmqService } from '@/rabbitmq/rabbitmq.service';
import { UserCoreService } from './user-core.service';
import { ProfileService } from './profile.service';
import { FileService } from '@/s3/file.service';
import { ViewTrackerService } from '@/view-tracker/view-tracker.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/response/user-response.dto';
const prisma = require('@/lib/prisma').prisma;

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    // Mock prisma methods
    const prisma = require('@/lib/prisma').prisma;

    prisma.user = {
      findUnique: jest.fn(),
      update: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
    };

    prisma.profile = {
      findUnique: jest.fn(),
      update: jest.fn(),
      create: jest.fn(),
    };

    prisma.file = {
      findFirst: jest.fn(),
      delete: jest.fn(),
      create: jest.fn(),
    };

    prisma.$transaction = jest.fn((callback) => callback(prisma));

    const mockCacheService = {
      getUserById: jest.fn(),
      setUserById: jest.fn(),
      delUserById: jest.fn(),
      del: jest.fn(),
    };

    const mockWorkersService = {
      createWorker: jest.fn(),
      changeWorkerActiveStatus: jest.fn(),
      getUserWorkers: jest.fn(),
      getRoles: jest.fn(),
    };

    const mockMapLocationsService = {
      createMapLocation: jest.fn(),
      updateMapLocation: jest.fn(),
      deleteMapLocation: jest.fn(),
      getMapLocationsByUserId: jest.fn(),
    };

    const mockActivitiesService = {
      getAllActivities: jest.fn(),
      getActivityById: jest.fn(),
      processActivities: jest.fn(),
    };

    const mockSearchService = {
      searchUsers: jest.fn(),
      indexProfile: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: AppLogger,
          useValue: {
            log: jest.fn(),
            error: jest.fn(),
            warn: jest.fn(),
          },
        },
        {
          provide: CacheService,
          useValue: mockCacheService,
        },
        {
          provide: WorkersService,
          useValue: mockWorkersService,
        },
        {
          provide: MapLocationsService,
          useValue: mockMapLocationsService,
        },
        {
          provide: ActivitiesService,
          useValue: mockActivitiesService,
        },
        {
          provide: SearchService,
          useValue: mockSearchService,
        },
        {
          provide: S3Service,
          useValue: {
            upload: jest.fn(),
            deleteObject: jest.fn(),
            deleteAllObjects: jest.fn(),
            listObjects: jest.fn(),
            generateFileName: jest.fn(),
          },
        },
        {
          provide: RabbitmqService,
          useValue: {
            sendFileUpload: jest.fn(),
            sendReviewFileUpload: jest.fn(),
          },
        },
        {
          provide: UserCoreService,
          useValue: {
            updateUserCore: jest.fn(),
          },
        },
        {
          provide: ProfileService,
          useValue: {
            create: jest.fn(),
            update: jest.fn(),
            findById: jest.fn(),
          },
        },
        {
          provide: FileService,
          useValue: {
            processUserAvatar: jest.fn(),
            replaceUserFilesArray: jest.fn(),
            enqueueFilesUpload: jest.fn(),
            enqueueAvatarUploadIfNeeded: jest.fn(),
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
        include: {
          role: true,
        },
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
        include: {
          role: true,
        },
      });
      expect(result).toBeNull();
    });
  });

  describe('updateUser', () => {
    it('should update user successfully', async () => {
      const userId = 'user-123';
      const updateData = new UpdateUserDto(
        null, // avatar
        1, // legalEntityId
        'Updated Name', // name
        1, // currencyId
        [], // activities
      );

      const mockUpdatedUser = {
        id: userId,
        name: 'Updated Name',
        email: 'test@example.com',
        accountNumber: '12345678',
        isVerified: true,
        rating: 0,
        reviewsCount: 0,
        profile: null,
        workers: [],
        receivedReviews: [],
        role: { id: 'role-123', name: 'User', code: 'USER', role: 'User' },
        createdAt: new Date(),
        updatedAt: new Date(),
        avatar: null,
      };

      // Mock prisma methods
      const prisma = require('@/lib/prisma').prisma;
      prisma.user.findUnique.mockResolvedValue(mockUpdatedUser);
      prisma.user.update.mockResolvedValue(mockUpdatedUser);
      prisma.profile.findUnique.mockResolvedValue(null);

      const result = await service.updateUser(userId, updateData);

      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: userId },
        data: {
          name: updateData.name,
        },
        include: {
          workers: true,
          profile: {
            include: {
              legalEntityType: true,
              currency: true,
            },
          },
        },
      });
      expect(result).toEqual(
        new UserResponseDto(
          mockUpdatedUser.id,
          mockUpdatedUser.email,
          mockUpdatedUser.name,
          mockUpdatedUser.accountNumber,
          mockUpdatedUser.role,
          mockUpdatedUser.avatar,
        ),
      );
    });

    it('should update user with multiple fields', async () => {
      const userId = 'user-123';
      const updateData = new UpdateUserDto(
        null, // avatar
        1, // legalEntityId
        'Updated Name', // name
        1, // currencyId
        [], // activities
        'updated@example.com', // companyEmail
      );

      const mockUpdatedUser = {
        id: userId,
        name: 'Updated Name',
        email: 'updated@example.com',
        accountNumber: '12345678',
        isVerified: true,
        rating: 0,
        reviewsCount: 0,
        profile: null,
        workers: undefined,
        receivedReviews: undefined,
        role: { id: 'role-123', name: 'User', code: 'USER', role: 'User' },
        createdAt: new Date(),
        updatedAt: new Date(),
        avatar: null,
      };

      // Mock prisma.user.update
      prisma.user.findUnique = jest.fn().mockResolvedValue(mockUpdatedUser);
      prisma.user.update = jest.fn().mockResolvedValue(mockUpdatedUser);

      const result = await service.updateUser(userId, updateData);

      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: userId },
        data: {
          name: updateData.name,
        },
        include: {
          workers: true,
          profile: {
            include: {
              legalEntityType: true,
              currency: true,
            },
          },
        },
      });
      expect(result).toEqual(
        new UserResponseDto(
          mockUpdatedUser.id,
          mockUpdatedUser.email,
          mockUpdatedUser.name,
          mockUpdatedUser.accountNumber,
          mockUpdatedUser.role,
          mockUpdatedUser.avatar,
        ),
      );
    });
  });
});
