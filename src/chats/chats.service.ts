import { Injectable } from '@nestjs/common';
import { JoinChatDto } from './dto/join-chat.dto';
import { prisma } from '@/lib/prisma';
import { RedisPresenceService } from '@/cache/redis-presence.service';
import { ChatParticipant } from './interfaces/chat-participant.interface';

@Injectable()
export class ChatsService {
  constructor(private readonly redisPresenceService: RedisPresenceService) {}
  async checkUserInChat(userId: string, chatId: string): Promise<boolean> {
    const participant = await prisma.chatParticipant.findFirst({
      where: {
        userId,
        chatId,
        deletedAt: null,
      },
    });

    return !!participant;
  }

  async getChatMessages(dto: JoinChatDto) {
    const { chatId, limit, offset } = dto;

    return await prisma.message.findMany({
      where: { chatId },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit ?? 20,
      skip: offset ?? 0,
      include: {
        sender: {},
      },
    });
  }

  async createMessage({
    chatId,
    message,
    senderId,
  }: {
    chatId: string;
    message: string;
    senderId: string;
  }): Promise<any> {
    return await prisma.message.create({
      data: {
        chatId,
        senderId,
        message,
        isRead: false,
      },
    });
  }

  async markMessagesAsRead(messageIds: string[], userId: string) {
    return await prisma.message.updateMany({
      where: {
        id: {
          in: messageIds,
        },
        chat: {
          chatParticipants: {
            some: {
              userId,
            },
          },
        },
      },
      data: {
        isRead: true,
      },
    });
  }

  async getChatParticipants(chatId: string): Promise<ChatParticipant[]> {
    const participants = await prisma.chatParticipant.findMany({
      where: {
        chatId,
        deletedAt: null,
      },
      include: {
        user: true,
      },
    });

    return participants.map((participant: any) => ({
      userId: participant.userId,
      user: {
        id: participant.user.id,
        name: participant.user.name || '',
        email: participant.user.email,
      },
      chatId: participant.chatId,
      joinedAt: participant.createdAt,
    }));
  }

  // Получить время последнего посещения пользователя
  async getLastSeen(userId: string): Promise<string | null> {
    const presence = await this.redisPresenceService.getPresence(userId);
    return presence?.lastSeen || null;
  }

  // Обновить статус пользователя
  async updateUserStatus(
    userId: string,
    status: 'online' | 'offline',
  ): Promise<void> {
    if (status === 'offline') {
      // При выходе оффлайн - обновляем lastSeen через установку офлайн статуса
      // Используем системный socketId и serverId для обновления lastSeen
      await this.redisPresenceService.setOffline(
        userId,
        'system-offline',
        'system-server',
      );
    }
    // Для онлайн статуса обновление происходит через setOnline в RedisPresenceService
  }

  // Получить список контактов пользователя
  async getUserContacts(userId: string): Promise<string[]> {
    const participants = await prisma.chatParticipant.findMany({
      where: {
        userId,
        deletedAt: null,
      },
      include: {
        chat: {
          include: {
            chatParticipants: {
              where: {
                userId: {
                  not: userId, // Исключаем самого пользователя
                },
                deletedAt: null,
              },
              select: {
                userId: true,
              },
            },
          },
        },
      },
    });

    // Собираем уникальные ID контактов
    const contacts = new Set<string>();
    participants.forEach((participant: any) => {
      participant.chat.chatParticipants.forEach((contact: any) => {
        contacts.add(contact.userId);
      });
    });

    return Array.from(contacts);
  }
}
