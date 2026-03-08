import { Injectable } from '@nestjs/common';
import { RedisPubSubService } from '@/cache/redis-pubsub.service';
import { NotificationDto, SendNotificationDto } from './dto/notification.dto';
import { v4 as uuidv4 } from 'uuid';

export interface Notification extends NotificationDto {
  id: string;
  createdAt: string;
  read: boolean;
}

@Injectable()
export class NotificationsService {
  constructor(private readonly redisPubSub: RedisPubSubService) {}

  // Отправить уведомление одному пользователю
  async sendNotification(notification: NotificationDto): Promise<string> {
    const fullNotification: Notification = {
      ...notification,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      read: false,
    };

    // Публикуем в Redis для доставки на все серверы
    await this.redisPubSub.publish(
      this.redisPubSub.CHANNELS.NOTIFICATIONS,
      fullNotification,
    );

    // Сохраняем в Redis для истории (TTL 7 дней)
    await this.saveNotificationToHistory(fullNotification);

    return fullNotification.id;
  }

  // Отправить уведомление нескольким пользователям
  async sendBulkNotifications(dto: SendNotificationDto): Promise<string[]> {
    const notifications: string[] = [];

    for (const userId of dto.userIds) {
      const notificationId = await this.sendNotification({
        userId,
        type: dto.type,
        title: dto.title,
        message: dto.message,
        data: dto.data,
        priority: dto.priority || 'medium',
      });
      notifications.push(notificationId);
    }

    return notifications;
  }

  // Получить непрочитанные уведомления пользователя
  async getUnreadNotifications(userId: string): Promise<Notification[]> {
    // Здесь можно добавить получение из Redis или базы данных
    // Пока возвращаем пустой массив
    return [];
  }

  // Пометить уведомление как прочитанное
  async markAsRead(notificationId: string, userId: string): Promise<void> {
    // Публикуем событие о прочтении
    await this.redisPubSub.publish(this.redisPubSub.CHANNELS.NOTIFICATIONS, {
      type: 'NOTIFICATION_READ',
      notificationId,
      userId,
      timestamp: new Date().toISOString(),
    });
  }

  // Отправить системное уведомление
  async sendSystemNotification(
    userIds: string[],
    title: string,
    message: string,
    data?: any,
  ): Promise<string[]> {
    return this.sendBulkNotifications({
      userIds,
      type: 'SYSTEM',
      title,
      message,
      data,
      priority: 'high',
    });
  }

  // Уведомление о новом сообщении
  async notifyNewMessage(
    userId: string,
    chatId: string,
    senderName: string,
    message: string,
  ): Promise<string> {
    return this.sendNotification({
      userId,
      type: 'NEW_MESSAGE',
      title: `Новое сообщение от ${senderName}`,
      message: message.length > 50 ? message.substring(0, 50) + '...' : message,
      data: { chatId, senderName },
      priority: 'medium',
    });
  }

  // Уведомление о упоминании
  async notifyMention(
    userId: string,
    chatId: string,
    senderName: string,
    message: string,
  ): Promise<string> {
    return this.sendNotification({
      userId,
      type: 'MENTION',
      title: `${senderName} упомянул вас`,
      message: message.length > 50 ? message.substring(0, 50) + '...' : message,
      data: { chatId, senderName },
      priority: 'high',
    });
  }

  // Приватный метод для сохранения в историю
  private async saveNotificationToHistory(
    notification: Notification,
  ): Promise<void> {
    // Здесь можно добавить сохранение в Redis sorted set или базу данных
    // Например: await this.redis.setex(`notification:${notification.id}`, 604800, JSON.stringify(notification));
  }
}
