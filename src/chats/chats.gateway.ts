import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatsService } from './chats.service';
import { RedisPubSubService } from '@/cache/redis-pubsub.service';
import { NotificationsService } from '@/notifications/notifications.service';
import { AppLogger } from '@/common/logger/logger.service';
import { ChatParticipant } from './interfaces/chat-participant.interface';
import { UseGuards } from '@nestjs/common';
import { WsJwtGuard } from '@/guards/ws-jwt.guard';
import { WsException } from '@nestjs/websockets';
import { JoinChatDto } from './dto/join-chat.dto';
import { SendMessageDto } from './dto/send-message.dto';
import { TypingDto } from './dto/typing.dto';
import { SocketWithUser } from '@/common/interfaces/socket-with-user.interface';

// сообщения
// получить список всех чатов
// получить чат по id
// удалить чат у одного пользователья
// закрепить чат(открепить чат)
// прочитать сообщение в чате
// отправить сообщение
// получить или создать чат с пользователем
// поиск сообщений по тексту + elasticsearch
// получить историю чата
// получить сообщения по id чата
// отправить файл картинку => для отправки сообщения - использовать base64
// установить статус файла uploading
// установить статус файла на completed

@WebSocketGateway({
  namespace: 'chats',
  cors: {
    origin: '*', // TODO: для продакшена изменить
    credentials: true,
  },
})
export class ChatsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  private userSocketMap = new Map<string, Set<string>>(); // userId -> Set<socketId>
  private socketUserMap = new Map<string, string>(); // socketId -> userId

  constructor(
    private readonly chatsService: ChatsService,
    private readonly redisPubSub: RedisPubSubService,
    private readonly notificationsService: NotificationsService,
    private readonly logger: AppLogger,
  ) {}

  // ============ ОНЛАЙН СТАТУС ============

  // подключение клиента
  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  // отключение клиента
  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    const userId = this.socketUserMap.get(client.id);
    if (userId) {
      // Удаляем соке из Set
      const userSockets = this.userSocketMap.get(userId);
      if (userSockets) {
        userSockets.delete(client.id);

        // Если больше нет советов - пользователь полностью офлайн
        if (userSockets.size === 0) {
          this.userSocketMap.delete(userId);
          this.broadcastUserStatus(userId, 'offline');
        }
      }

      this.socketUserMap.delete(client.id);
    }
  }

  // ============ АУТЕНТИФИКАЦИЯ ============

  @SubscribeMessage('authenticate')
  async handleAuthenticate(
    @MessageBody() dto: JoinChatDto,
    @ConnectedSocket() client: Socket,
  ) {
    const { userId } = dto;
    let userSockets = this.userSocketMap.get(userId);

    // Регистрируем сокет
    if (!userSockets) {
      userSockets = new Set();
      this.userSocketMap.set(userId, userSockets);
      // Первое подключение — статус онлайн
      this.broadcastUserStatus(userId, 'online');
    }

    userSockets.add(client.id);
    this.socketUserMap.set(client.id, userId);

    // Личная комната для уведомлений
    client.join(`user:${userId}`);

    // Отправляем список онлайн-друзей/контактов (опционально)
    const onlineContacts = await this.getOnlineContacts(userId);

    return {
      event: 'authenticated',
      data: {
        success: true,
        onlineContacts, // Кто из контактов онлайн
      },
    };
  }

  // ============ ЧАТ ============

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('join-chat')
  async handleJoinChat(
    @MessageBody() dto: JoinChatDto,
    @ConnectedSocket() client: Socket,
  ) {
    const { chatId } = dto;
    const userId = this.socketUserMap.get(client.id);

    if (!userId) {
      return { event: 'error', data: { message: 'Not authenticated' } };
    }

    const hasAccess = await this.chatsService.checkUserInChat(userId, chatId);
    if (!hasAccess) {
      return { event: 'error', data: { message: 'Access denied' } };
    }

    client.join(`chat:${chatId}`);

    // Получаем историю + онлайн-участников чата
    const [messages, onlineParticipants] = await Promise.all([
      this.chatsService.getChatMessages(dto),
      this.getOnlineParticipants(chatId),
    ]);

    // Уведомляем других, что пользователь вошёл в чат
    client.to(`chat:${chatId}`).emit('user-joined-chat', {
      chatId,
      userId,
      onlineAt: new Date().toISOString(),
    });

    return {
      event: 'joined-chat',
      data: {
        chatId,
        messages,
        onlineParticipants, // Кто сейчас в чате онлайн
      },
    };
  }

  // Отправка сообщения
  @UseGuards(WsJwtGuard)
  @SubscribeMessage('send-message')
  async handleSendMessage(
    @MessageBody() dto: SendMessageDto,
    @ConnectedSocket() client: Socket,
  ) {
    const userId = this.socketUserMap.get(client.id);
    if (!userId) {
      throw new WsException('Not authenticated');
    }

    const message = await this.chatsService.createMessage({
      ...dto,
      senderId: userId,
    });

    // Рассылаем всем в чате
    this.server.to(`chat:${dto.chatId}`).emit('new-message', {
      id: message.id,
      chatId: dto.chatId,
      senderId: userId,
      message: dto.message,
      createdAt: message.createdAt,
    });

    // Уведомляем офлайн участников
    await this.notifyOfflineParticipants(dto.chatId, userId, message);

    return {
      event: 'message-sent',
      data: { messageId: message.id },
    };
  }

  // ============ ОНЛАЙН СТАТУС МЕТОДЫ ============

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('get-online-status')
  async handleGetOnlineStatus(
    @MessageBody() dto: { userIds: string[] },
    // @ConnectedSocket() client: Socket,
    @ConnectedSocket() _: Socket,
  ) {
    const statusMap = new Map();

    for (const userId of dto.userIds) {
      const isOnline = this.userSocketMap.has(userId);
      const lastSeen = isOnline
        ? 'online'
        : await this.chatsService.getLastSeen(userId); // из Redis/БД

      statusMap.set(userId, {
        isOnline,
        lastSeen,
      });
    }

    return {
      event: 'online-status',
      data: Object.fromEntries(statusMap),
    };
  }

  // печатание...
  @UseGuards(WsJwtGuard)
  @SubscribeMessage('typing')
  async handleTyping(
    @MessageBody() dto: TypingDto,
    @ConnectedSocket() client: SocketWithUser,
  ) {
    const userId = client.user.id;

    client.to(`chat:${dto.chatId}`).emit('user_typing', {
      chatId: dto.chatId,
      userId,
      isTyping: dto.isTyping,
    });
  }

  // Покинуть чат
  @UseGuards(WsJwtGuard)
  @SubscribeMessage('leave-chat')
  handleLeaveChat(
    @MessageBody() dto: { chatId: string },
    @ConnectedSocket() client: Socket,
  ) {
    client.leave(`chat:${dto.chatId}`);
    return {
      event: 'left-chat',
      data: {
        chatId: dto.chatId,
      },
    };
  }

  // Прочитать сообщения
  @UseGuards(WsJwtGuard)
  @SubscribeMessage('mark-read')
  async handleMarkRead(
    @MessageBody() dto: { chatId: string; messageIds: string[] },
    @ConnectedSocket() client: SocketWithUser,
  ) {
    const userId = client.user.id;

    await this.chatsService.markMessagesAsRead(dto.messageIds, userId);

    // Уведомляем отправителей
    this.server.to(`chat:${dto.chatId}`).emit('messages-read', {
      chatId: dto.chatId,
      userId,
      messageIds: dto.messageIds,
    });
  }

  // ============ ВСПОМОГАТЕЛЬНЫЕ МЕТОДЫ ============

  private broadcastUserStatus(userId: string, status: 'online' | 'offline') {
    // Обновляем lastSeen в Redis/БД
    this.chatsService.updateUserStatus(userId, status);

    // Рассылаем контактам (через Redis Pub/Sub для кластера)
    this.redisPubSub.publish('user-status', {
      userId,
      status,
      timestamp: new Date().toISOString(),
    });

    // Локальная рассылка
    this.server.emit('user-status-changed', {
      userId,
      status,
    });
  }

  private async getOnlineParticipants(chatId: string): Promise<string[]> {
    const participants = await this.chatsService.getChatParticipants(chatId);
    return participants
      .filter((p: ChatParticipant) => this.userSocketMap.has(p.userId))
      .map((p: ChatParticipant) => p.userId);
  }

  private async getOnlineContacts(userId: string): Promise<string[]> {
    const contacts = await this.chatsService.getUserContacts(userId);
    return contacts.filter((contactId) => this.userSocketMap.has(contactId));
  }

  // Вспомогательный метод для уведомлений
  private async notifyOfflineParticipants(
    chatId: string,
    senderId: string,
    message: any,
  ) {
    const participants = await this.chatsService.getChatParticipants(chatId);

    // Получаем информацию об отправителе для имени
    const sender = participants.find(
      (p: ChatParticipant) => p.userId === senderId,
    );
    const senderName =
      sender?.user?.name || sender?.user?.email || 'Unknown User';

    for (const participant of participants) {
      if (participant.userId === senderId) continue;

      // ИСПОЛЬЗУЕМ isUserOnline здесь
      if (this.isUserOnline(participant.userId)) {
        // Пользователь онлайн — отправляем через WebSocket
        this.server
          .to(`user:${participant.userId}`)
          .emit('new-message-preview', {
            chatId,
            preview: message.message.substring(0, 50),
          });
      } else {
        // Офлайн — отправляем push-уведомление через NotificationsService
        await this.notificationsService.notifyNewMessage(
          participant.userId,
          chatId,
          senderName,
          message.message,
        );
      }
    }
  }

  // Публичный метод для проверки онлайн (из других сервисов)
  isUserOnline(userId: string): boolean {
    return this.userSocketMap.has(userId);
  }

  getUserSocketIds(userId: string): string[] {
    const sockets = this.userSocketMap.get(userId);
    return sockets ? Array.from(sockets) : [];
  }
}
