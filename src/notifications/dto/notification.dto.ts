export class NotificationDto {
  userId: string;
  type: 'NEW_MESSAGE' | 'FRIEND_REQUEST' | 'SYSTEM' | 'CHAT_INVITE' | 'MENTION';
  title: string;
  message: string;
  data?: any;
  priority?: 'low' | 'medium' | 'high';

  constructor(
    userId: string,
    type:
      | 'NEW_MESSAGE'
      | 'FRIEND_REQUEST'
      | 'SYSTEM'
      | 'CHAT_INVITE'
      | 'MENTION',
    title: string,
    message: string,
    data?: any,
    priority?: 'low' | 'medium' | 'high',
  ) {
    this.userId = userId;
    this.type = type;
    this.title = title;
    this.message = message;
    this.data = data;
    if (priority !== undefined) {
      this.priority = priority;
    }
  }
}

export class SendNotificationDto {
  userIds: string[];
  type: 'NEW_MESSAGE' | 'FRIEND_REQUEST' | 'SYSTEM' | 'CHAT_INVITE' | 'MENTION';
  title: string;
  message: string;
  data?: any;
  priority?: 'low' | 'medium' | 'high';

  constructor(
    userIds: string[],
    type:
      | 'NEW_MESSAGE'
      | 'FRIEND_REQUEST'
      | 'SYSTEM'
      | 'CHAT_INVITE'
      | 'MENTION',
    title: string,
    message: string,
    data?: any,
    priority?: 'low' | 'medium' | 'high',
  ) {
    this.userIds = userIds;
    this.type = type;
    this.title = title;
    this.message = message;
    this.data = data;
    if (priority !== undefined) {
      this.priority = priority;
    }
  }
}

export class MarkNotificationReadDto {
  notificationId: string;

  constructor(notificationId: string) {
    this.notificationId = notificationId;
  }
}
