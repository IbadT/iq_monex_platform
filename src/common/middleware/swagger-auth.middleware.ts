import { Injectable, NestMiddleware } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class SwaggerAuthMiddleware implements NestMiddleware {
  constructor(private readonly configService: ConfigService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const swaggerUser = this.configService.get<string>('SWAGGER_USER');
    const swaggerPassword = this.configService.get<string>('SWAGGER_PASSWORD');

    // Если не заданы credentials, пропускаем
    if (!swaggerUser || !swaggerPassword) {
      return next();
    }

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Basic ')) {
      res.setHeader('WWW-Authenticate', 'Basic realm="Swagger"');
      return res.status(401).send('Authentication required');
    }

    const base64Credentials = authHeader.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString(
      'ascii',
    );
    const [username, password] = credentials.split(':');

    if (username !== swaggerUser || password !== swaggerPassword) {
      res.setHeader('WWW-Authenticate', 'Basic realm="Swagger"');
      return res.status(401).send('Invalid credentials');
    }

    next();
  }
}
