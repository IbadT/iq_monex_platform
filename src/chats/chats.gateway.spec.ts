import { Test, TestingModule } from '@nestjs/testing';
import { ChatsGateway } from './chats.gateway';
import { ChatsService } from './chats.service';
import { RedisPubSubService } from '@/cache/redis-pubsub.service';
import { NotificationsService } from '@/notifications/notifications.service';
import { AppLogger } from '@/common/logger/logger.service';
import { RedisPresenceService } from '@/cache/redis-presence.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

describe('ChatsGateway', () => {
  let gateway: ChatsGateway;

  beforeEach(async () => {
    const mockRedisPubSubService = {
      publish: jest.fn(),
      subscribe: jest.fn(),
      unsubscribe: jest.fn(),
      CHANNELS: {
        NOTIFICATIONS: 'notifications',
      },
    };

    const mockNotificationsService = {
      sendNotification: jest.fn(),
    };

    const mockLogger = {
      log: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
      debug: jest.fn(),
      verbose: jest.fn(),
    };

    const mockRedisPresenceService = {
      addUser: jest.fn(),
      removeUser: jest.fn(),
      getUsers: jest.fn(),
      isUserOnline: jest.fn(),
    };

    const mockJwtService = {
      verifyAsync: jest.fn().mockResolvedValue({
        id: 'user-123',
        email: 'test@example.com',
      }),
    };

    const mockConfigService = {
      getOrThrow: jest.fn().mockReturnValue('test-secret'),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChatsGateway,
        ChatsService,
        {
          provide: RedisPubSubService,
          useValue: mockRedisPubSubService,
        },
        {
          provide: NotificationsService,
          useValue: mockNotificationsService,
        },
        {
          provide: AppLogger,
          useValue: mockLogger,
        },
        {
          provide: RedisPresenceService,
          useValue: mockRedisPresenceService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    gateway = module.get<ChatsGateway>(ChatsGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
