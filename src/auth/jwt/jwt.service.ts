import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtTokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async issueTokens(
    userId: string,
    role: string,
    name?: string,
    email?: string,
  ): Promise<Record<string, string>> {
    const data = { id: userId, name, email, role };

    const accessToken = await this.jwtService.signAsync(data, {
      expiresIn: '15m', // Явно указываем 15 минут
    });

    const refreshToken = await this.jwtService.signAsync(data, {
      expiresIn: '7d', // Явно указываем 7 дней
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  async verifyToken(token: string): Promise<any> {
    try {
      return await this.jwtService.verifyAsync(token, {
        secret: this.configService.getOrThrow<string>('SECRET_TOKEN'),
      });
    } catch (error) {
      // Проверяем тип ошибки JWT
      if (error.name === 'TokenExpiredError') {
        throw new Error('TOKEN_EXPIRED');
      }
      // Другие ошибки: JsonWebTokenError, NotBeforeError и т.д.
      throw new Error('INVALID_TOKEN');
    }
  }

  async decodeToken(token: string): Promise<any> {
    try {
      return await this.jwtService.decode(token, {
        complete: true,
      });
    } catch (error) {
      throw new Error('Cannot decode token');
    }
  }
}
