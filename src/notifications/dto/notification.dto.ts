export class NotificationDto {
  userId: string;
  type: 'NEW_MESSAGE' | 'FRIEND_REQUEST' | 'SYSTEM' | 'CHAT_INVITE' | 'MENTION';
  title: string;
  message: string;
  data?: any;
  priority?: 'low' | 'medium' | 'high';
}

export class SendNotificationDto {
  userIds: string[];
  type: 'NEW_MESSAGE' | 'FRIEND_REQUEST' | 'SYSTEM' | 'CHAT_INVITE' | 'MENTION';
  title: string;
  message: string;
  data?: any;
  priority?: 'low' | 'medium' | 'high';
}

export class MarkNotificationReadDto {
  notificationId: string;
}
