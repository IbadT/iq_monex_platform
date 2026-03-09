import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { CacheService } from './cache/cacheService.service';
import { LoggerModule } from './common/logger/logger.module';
import { GuardsModule } from './common/guards/guards.module';
import { CategoriesModule } from './categories/categories.module';
import { DictionariesModule } from './dictionaries/dictionaries.module';
import { AttributesModule } from './attributes/attributes.module';
import { ChatsModule } from './chats/chats.module';
import { NotificationsModule } from './notifications/notifications.module';
import { EmailModule } from './email/email.module';
import { RabbitmqModule } from './rabbitmq/rabbitmq.module';
import { ListingsModule } from './listings/listings.module';
import { FavoriteModule } from './favorite/favorite.module';
import { ReviewsModule } from './reviews/reviews.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    LoggerModule,
    GuardsModule,
    UsersModule,
    AuthModule,
    CategoriesModule,
    DictionariesModule,
    AttributesModule,
    ChatsModule,
    NotificationsModule,
    EmailModule,
    RabbitmqModule,
    ListingsModule,
    FavoriteModule,
    ReviewsModule,
  ],
  controllers: [AppController],
  providers: [AppService, CacheService],
})
export class AppModule {}
