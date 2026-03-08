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
import { Logger } from '@nestjs/common';
import { UseGuards } from '@nestjs/common';
import { WsJwtGuard } from '@/guards/ws-jwt.guard';
import { RedisPubSubService } from '@/cache/redis-pubsub.service';
import { NotificationsService, Notification } from './notifications.service';
import { MarkNotificationReadDto } from './dto/notification.dto';
import { SocketWithUser } from '@/common/interfaces/socket-with-user.interface';

@WebSocketGateway({
  namespace: 'notifications',
  cors: {
    origin: '*',
    credentials: true,
  },
})
export class NotificationsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  private readonly logger = new Logger(NotificationsGateway.name);
  private userSockets = new Map<string, Set<string>>(); // userId -> Set<socketId>

  constructor(
    private readonly notificationsService: NotificationsService,
    private readonly redisPubSub: RedisPubSubService,
  ) {}

  async onModuleInit() {
    this.logger.log('Notifications Gateway initialized');
    
    // Ждем инициализации Redis перед подпиской
    setTimeout(async () => {
      try {
        await this.setupRedisSubscriptions();
      } catch (error) {
        this.logger.error('Failed to setup Redis subscriptions:', error);
      }
    }, 1000); // Даем время на инициализацию Redis
  }

  private async setupRedisSubscriptions() {
    // Подписка на уведомления
    await this.redisPubSub.subscribe(
      this.redisPubSub.CHANNELS.NOTIFICATIONS,
      async (data) => {
        await this.handleNotificationFromRedis(data);
      },
    );

    this.logger.log('Redis subscriptions setup completed');
  }

  private async handleNotificationFromRedis(data: any) {
    try {
      if (data.type === 'NOTIFICATION_READ') {
        // Обработка прочтения уведомления
        this.server.emit(`notification_read:${data.userId}`, {
          notificationId: data.notificationId,
          timestamp: data.timestamp,
        });
        return;
      }

      // Обработка обычного уведомления
      const notification = data as Notification;
      const userSockets = this.userSockets.get(notification.userId);

      if (userSockets && userSockets.size > 0) {
        // Пользователь онлайн - отправляем напрямую
        userSockets.forEach((socketId) => {
          this.server.to(socketId).emit('notification', notification);
        });
        this.logger.log(`Notification sent to user ${notification.userId}`);
      } else {
        // Пользователь оффлайн - уведомление уже сохранено в сервисе
        this.logger.log(
          `User ${notification.userId} is offline, notification saved`,
        );
      }
    } catch (error) {
      this.logger.error('Error handling notification from Redis:', error);
    }
  }

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);

    // Удаляем сокет из маппинга
    for (const [userId, sockets] of this.userSockets.entries()) {
      if (sockets.has(client.id)) {
        sockets.delete(client.id);
        if (sockets.size === 0) {
          this.userSockets.delete(userId);
        }
        break;
      }
    }
  }

  // Аутентификация пользователя
  @UseGuards(WsJwtGuard)
  @SubscribeMessage('authenticate')
  async handleAuthenticate(@ConnectedSocket() client: SocketWithUser) {
    const userId = client.user.id;

    // Добавляем сокет к пользователю
    if (!this.userSockets.has(userId)) {
      this.userSockets.set(userId, new Set());
    }
    this.userSockets.get(userId)!.add(client.id);

    // Отправляем непрочитанные уведомления
    const unreadNotifications =
      await this.notificationsService.getUnreadNotifications(userId);

    client.emit('authenticated', {
      success: true,
      unreadCount: unreadNotifications.length,
      notifications: unreadNotifications,
    });

    this.logger.log(`User ${userId} authenticated with socket ${client.id}`);
  }

  // Получить непрочитанные уведомления
  @UseGuards(WsJwtGuard)
  @SubscribeMessage('get-unread')
  async handleGetUnread(@ConnectedSocket() client: SocketWithUser) {
    const userId = client.user.id;
    const notifications =
      await this.notificationsService.getUnreadNotifications(userId);

    client.emit('unread-notifications', {
      notifications,
      count: notifications.length,
    });
  }

  // Пометить уведомление как прочитанное
  @UseGuards(WsJwtGuard)
  @SubscribeMessage('mark-read')
  async handleMarkRead(
    @MessageBody() dto: MarkNotificationReadDto,
    @ConnectedSocket() client: SocketWithUser,
  ) {
    const userId = client.user.id;
    await this.notificationsService.markAsRead(dto.notificationId, userId);

    client.emit('notification-marked-read', {
      notificationId: dto.notificationId,
      success: true,
    });
  }

  // Пометить все уведомления как прочитанные
  @UseGuards(WsJwtGuard)
  @SubscribeMessage('mark-all-read')
  async handleMarkAllRead(@ConnectedSocket() client: SocketWithUser) {
    const userId = client.user.id;
    const notifications =
      await this.notificationsService.getUnreadNotifications(userId);

    // Отмечаем каждое уведомление как прочитанное
    for (const notification of notifications) {
      await this.notificationsService.markAsRead(notification.id, userId);
    }

    client.emit('all-notifications-marked-read', {
      success: true,
      count: notifications.length,
    });
  }

  // Тестовое уведомление (для разработки)
  @UseGuards(WsJwtGuard)
  @SubscribeMessage('test-notification')
  async handleTestNotification(
    @MessageBody() dto: { title: string; message: string },
    @ConnectedSocket() client: SocketWithUser,
  ) {
    const userId = client.user.id;

    await this.notificationsService.sendNotification({
      userId,
      type: 'SYSTEM',
      title: dto.title,
      message: dto.message,
      priority: 'medium',
    });
  }
}
