import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Logger,
} from '@nestjs/common';
import { JwtTokenService } from '@/auth/jwt/jwt.service';

@Injectable()
export class OptionalJwtAuthGuard implements CanActivate {
  private readonly logger = new Logger(OptionalJwtAuthGuard.name);

  constructor(private readonly jwtTokenService: JwtTokenService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    this.logger.log(`[DEBUG] Guard called, token present: ${!!token}`);

    // Если нет токена — пропускаем без ошибок
    if (!token) {
      this.logger.log('[DEBUG] No token, proceeding as anonymous');
      return true;
    }

    try {
      const payload = await this.jwtTokenService.verifyToken(token);
      this.logger.log(`[DEBUG] Token verified, userId: ${payload?.id}`);
      // Если токен валиден — добавляем пользователя в request
      request.user = payload;
    } catch (error) {
      this.logger.log(`[DEBUG] Token verification failed: ${error.message}`);
      // Если токен невалиден или просрочен — просто не добавляем user
      // Но запрос всё равно пропускаем
    }

    return true;
  }

  private extractTokenFromHeader(request: any): string | undefined {
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      return undefined;
    }

    const [type, token] = authHeader.split(' ');

    if (type !== 'Bearer' || !token) {
      return undefined;
    }

    return token;
  }
}
