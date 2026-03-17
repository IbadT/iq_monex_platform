import { Test, TestingModule } from '@nestjs/testing';
import { NotificationsService } from './notifications.service';
import { RedisPubSubService } from '@/cache/redis-pubsub.service';

describe('NotificationsService', () => {
  let service: NotificationsService;

  beforeEach(async () => {
    const mockRedisPubSubService = {
      publish: jest.fn(),
      subscribe: jest.fn(),
      unsubscribe: jest.fn(),
      CHANNELS: {
        NOTIFICATIONS: 'notifications',
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationsService,
        {
          provide: RedisPubSubService,
          useValue: mockRedisPubSubService,
        },
      ],
    }).compile();

    service = module.get<NotificationsService>(NotificationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('sendNotification', () => {
    it('should send notification successfully', async () => {
      const notification = {
        userId: 'user-123',
        title: 'Test Notification',
        message: 'Test message',
        type: 'SYSTEM' as const,
      };

      const mockRedisPubSubService = service['redisPubSub'] as jest.Mocked<RedisPubSubService>;
      mockRedisPubSubService.publish = jest.fn().mockResolvedValue('published');

      const result = await service.sendNotification(notification);

      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
      expect(mockRedisPubSubService.publish).toHaveBeenCalled();
    });

    it('should generate unique notification ID', async () => {
      const notification = {
        userId: 'user-123',
        title: 'Test Notification',
        message: 'Test message',
        type: 'SYSTEM' as const,
      };

      const mockRedisPubSubService = service['redisPubSub'] as jest.Mocked<RedisPubSubService>;
      mockRedisPubSubService.publish = jest.fn().mockResolvedValue('published');

      const result1 = await service.sendNotification(notification);
      const result2 = await service.sendNotification(notification);

      expect(result1).not.toBe(result2);
      expect(mockRedisPubSubService.publish).toHaveBeenCalledTimes(2);
    });
  });
});
