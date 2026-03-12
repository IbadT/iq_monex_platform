import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
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
import { PaymentsModule } from './payments/payments.module';
import { ScheduleModule } from '@nestjs/schedule';
import { S3Module } from './s3/s3.module';
import { FileUploadModule } from './workers/file-upload.module';
import { SubscriptionServiceModule } from './subscription/subscription.module';
import { YookassaModule } from 'nestjs-yookassa';
import { LikesModule } from './likes/likes.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    YookassaModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        shopId: configService.getOrThrow<string>('YOOKASSA_SHOP_ID'),
        apiKey: configService.getOrThrow<string>('YOOKASSA_SECRET_KEY'),
      }),
      inject: [ConfigService],
    }),
    ScheduleModule.forRoot(),
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
    PaymentsModule,
    S3Module,
    FileUploadModule,
    SubscriptionServiceModule,
    LikesModule,
  ],
  controllers: [AppController],
  providers: [AppService, CacheService],
})
export class AppModule {}
