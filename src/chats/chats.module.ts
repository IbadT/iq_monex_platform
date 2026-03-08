import { Module } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { ChatsGateway } from './chats.gateway';
import { JwtService } from '@nestjs/jwt';
import { RedisPubSubService } from '@/cache/redis-pubsub.service';
import { RedisPresenceService } from '@/cache/redis-presence.service';
import { NotificationsModule } from '@/notifications/notifications.module';

@Module({
  imports: [NotificationsModule],
  providers: [
    ChatsGateway,
    ChatsService,
    JwtService,
    RedisPubSubService,
    RedisPresenceService,
  ],
})
export class ChatsModule {}
