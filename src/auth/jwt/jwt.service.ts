import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtTokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async issueTokens(userId: string): Promise<Record<string, string>> {
    const data = { id: userId };

    const accessToken = await this.jwtService.signAsync(data, {
      // expiresIn: '15m',
      expiresIn: this.configService.get<number>('JWT_EXPIRES_IN') || 900,
    });

    const refreshToken = await this.jwtService.signAsync(data, {
      expiresIn:
        this.configService.get<number>('JWT_REFRESH_EXPIRES_IN') || 604800,
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
      throw new Error('Invalid token');
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
