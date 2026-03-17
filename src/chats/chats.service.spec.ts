import { Test, TestingModule } from '@nestjs/testing';
import { ChatsService } from './chats.service';
import { RedisPresenceService } from '@/cache/redis-presence.service';

describe('ChatsService', () => {
  let service: ChatsService;

  beforeEach(async () => {
    const mockRedisPresenceService = {
      addUser: jest.fn(),
      removeUser: jest.fn(),
      getUsers: jest.fn(),
      isUserOnline: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChatsService,
        {
          provide: RedisPresenceService,
          useValue: mockRedisPresenceService,
        },
      ],
    }).compile();

    service = module.get<ChatsService>(ChatsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('checkUserInChat', () => {
    it('should return true if user is in chat', async () => {
      const userId = 'user-123';
      const chatId = 'chat-123';

      const mockParticipant = {
        id: 'participant-123',
        userId,
        chatId,
        deletedAt: null,
      };

      // Mock prisma methods
      const prisma = require('@/lib/prisma').prisma;
      prisma.chatParticipant.findFirst = jest.fn().mockResolvedValue(mockParticipant);

      const result = await service.checkUserInChat(userId, chatId);

      expect(prisma.chatParticipant.findFirst).toHaveBeenCalledWith({
        where: {
          userId,
          chatId,
          deletedAt: null,
        },
      });
      expect(result).toBe(true);
    });

    it('should return false if user is not in chat', async () => {
      const userId = 'user-123';
      const chatId = 'chat-123';

      // Mock prisma methods
      const prisma = require('@/lib/prisma').prisma;
      prisma.chatParticipant.findFirst = jest.fn().mockResolvedValue(null);

      const result = await service.checkUserInChat(userId, chatId);

      expect(prisma.chatParticipant.findFirst).toHaveBeenCalledWith({
        where: {
          userId,
          chatId,
          deletedAt: null,
        },
      });
      expect(result).toBe(false);
    });
  });
});
