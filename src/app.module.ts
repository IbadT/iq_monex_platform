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
import { RabbitmqConsumerModule } from './rabbitmq/rabbitmq-consumer.module';
import { ListingsModule } from './listings/listings.module';
import { ReviewsModule } from './reviews/reviews.module';
import { PaymentsModule } from './payments/payments.module';
import { ScheduleModule } from '@nestjs/schedule';
import { S3Module } from './s3/s3.module';
import { WorkersModule } from './workers/workers.module';
import { SubscriptionServiceModule } from './subscription/subscription.module';
import { YookassaModule } from 'nestjs-yookassa';
import { LikesModule } from './likes/likes.module';
import { FavoritesModule } from './favorites/favorites.module';
import { SearchModule } from './search/search.module';
import { JwtAuthModule } from './auth/jwt/jwt.module';
import { CronTasksModule } from './cron_tasks/cron_tasks.module';
import { SentryGlobalFilter, SentryModule } from '@sentry/nestjs/setup';
import { APP_FILTER } from '@nestjs/core';
import { MapLocationsModule } from './map_locations/map_locations.module';
import { ActivitiesModule } from './activities/activities.module';
import { TariffsModule } from './tariffs/tariffs.module';

@Module({
  imports: [
    SentryModule.forRoot(),
    JwtAuthModule,
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
    SearchModule,
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
    RabbitmqConsumerModule,
    ListingsModule,
    ReviewsModule,
    PaymentsModule,
    S3Module,
    WorkersModule,
    SubscriptionServiceModule,
    LikesModule,
    FavoritesModule,
    CronTasksModule,
    MapLocationsModule,
    ActivitiesModule,
    TariffsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    CacheService,
    {
      provide: APP_FILTER,
      useClass: SentryGlobalFilter,
    },
  ],
})
export class AppModule {}
