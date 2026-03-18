import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { swaggerCustomOptions } from '@/common/swagger-response-time.plugin';
import { HttpExceptionFilter } from '@/common/filters/http-exception.filter';
import * as express from 'express';
import * as cookieParser from 'cookie-parser';
import "./instrument"

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: '*',
    credentials: true,
  });

  // Увеличиваем лимит для загрузки файлов (10MB)
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ limit: '10mb', extended: true }));
  
  // Добавляем cookie parser middleware
  app.use(cookieParser());

  const configService = new ConfigService();

  // Глобальный Validation Pipe с преобразованием типов
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // ✅ Включаем автоматическое преобразование
      transformOptions: {
        enableImplicitConversion: true, // ✅ Включаем неявное преобразование
      },
      whitelist: true, // ✅ Удаляем лишние поля
      forbidNonWhitelisted: true, // ✅ Запрещаем неизвестные поля
    }),
  );

  // Глобальный фильтр ошибок
  app.useGlobalFilters(new HttpExceptionFilter(configService));

  app.setGlobalPrefix('api');

  const config = new DocumentBuilder()
    .setTitle('IQMONEX Platform')
    .setVersion('1.0.0')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      description: 'Введите JWT токен',
    })
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/api/docs', app, document, swaggerCustomOptions);

  await app.listen(configService.getOrThrow<number>('PORT') ?? 3000);
}
bootstrap();
