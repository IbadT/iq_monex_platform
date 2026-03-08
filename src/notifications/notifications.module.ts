import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsGateway } from './notifications.gateway';
import { RedisPubSubService } from '@/cache/redis-pubsub.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  providers: [
    NotificationsGateway,
    NotificationsService,
    RedisPubSubService,
    JwtService,
  ],
  exports: [NotificationsService],
})
export class NotificationsModule {}
