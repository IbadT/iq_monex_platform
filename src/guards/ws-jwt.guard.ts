import { CanActivate, ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { WsException } from '@nestjs/websockets';
import { ConfigService } from '@nestjs/config';
import { AppLogger } from '@/common/logger/logger.service';

@Injectable()
export class WsJwtGuard implements CanActivate {

  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private logger: AppLogger,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client = context.switchToWs().getClient();
    const token = this.extractToken(client);

    this.logger.log(`Проверка аутентификации WebSocket клиента ${client.id}`);
    
    if (!token) {
      this.logger.error('Токен не найден в запросе');
      throw new WsException('Unauthorized');
    }

    this.logger.log(`Токен найден: ${token.substring(0, 20)}...`);

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.getOrThrow<string>('SECRET_TOKEN'),
      });
      this.logger.log(`Токен успешно верифицирован для пользователя: ${payload.id}`);
      client['user'] = payload;
      return true;
    } catch (error) {
      this.logger.error(`Ошибка верификации токена: ${error.message}`);
      throw new WsException('Invalid token');
    }
  }

  private extractToken(client: any): string | undefined {
    const auth = client.handshake?.headers?.authorization;
    if (auth?.startsWith('Bearer ')) {
      return auth.substring(7);
    }

    const queryToken = client.handshake?.query?.token;
    if (queryToken) {
      this.logger.log(`Токен извлечен из query параметра: ${queryToken.substring(0, 20)}...`);
      return queryToken;
    }

    this.logger.log('Токен не найден в headers или query');
    return undefined;
  }
}
