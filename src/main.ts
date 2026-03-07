import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { swaggerCustomOptions } from '@/common/swagger-response-time.plugin';
import { HttpExceptionFilter } from '@/common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = new ConfigService();

  // Глобальный фильтр ошибок
  app.useGlobalFilters(new HttpExceptionFilter(configService));

  app.setGlobalPrefix('api');

  const config = new DocumentBuilder()
    .setTitle('Iq Monex Platform')
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
