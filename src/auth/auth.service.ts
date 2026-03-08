import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';
import { HashService } from './hash.service';
import { LoginUserDto } from './dto/request/login-user.dto';
import { UsersService } from '@/users/users.service';
import { LoginResponseDto } from './dto/response/login-response.dto';
import { TokensDto } from './dto/tokens.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';

import { User } from '@/users/entities/user.entity';
import { JwtTokenService } from './jwt/jwt.service';
import { AppLogger } from '@/common/logger/logger.service';
import { RegisterResponseDto } from './dto/response/register-response.dto';
import { CacheService } from '@/cache/cacheService.service';
import { RabbitmqService } from '@/rabbitmq/rabbitmq.service';
import { JwtPayload } from '@/common/interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    // private configService: ConfigService,
    private hashService: HashService,
    private userService: UsersService,
    private jwtTokenService: JwtTokenService,
    private readonly cacheService: CacheService,
    private readonly rabbitmqService: RabbitmqService,
    private logger: AppLogger,
  ) {}

  async login(loginUserDto: LoginUserDto): Promise<LoginResponseDto> {
    const { email, password } = loginUserDto;

    this.logger.logAuth('login_attempt', undefined, email);

    // Получаем пользователя с паролем для аутентификации
    const existUser = await this.userService.getUserByEmailWithPassword(email);

    if (!existUser) {
      this.logger.logAuth('login_failed_user_not_found', undefined, email);
      throw new NotFoundException(`Пользователь с email: ${email} не найден`);
    }

    // Проверка пароля
    const isPasswordValid = await this.hashService.compare(
      existUser.password,
      password,
    );
    if (!isPasswordValid) {
      this.logger.logAuth('login_failed_invalid_password', existUser.id, email);
      throw new UnauthorizedException('Неверный пароль');
    }

    // Создаем Entity без пароля для ответа
    const userEntity: User = {
      id: existUser.id,
      email: existUser.email,
      name: existUser.name || '',
    };

    const tokens = await this.jwtTokenService.issueTokens(
      existUser.id,
      existUser.name || '',
      existUser.email,
    );

    this.logger.logAuth('login_success', existUser.id, email);

    return new LoginResponseDto(
      tokens.accessToken,
      tokens.refreshToken,
      userEntity,
    );
  }

  async register(loginUserDto: LoginUserDto): Promise<RegisterResponseDto> {
    const { email, password } = loginUserDto;
    const cacheKey = `register:${email}`;

    // Проверяем, существует ли пользователь
    const existingUser =
      await this.userService.getUserByEmailWithPassword(email);
    if (existingUser) {
      throw new ConflictException(
        `Пользователь с таким email: ${email} уже зарегистрирован`,
      );
    }

    // Генерируем 5-значный код подтверждения
    const verificationCode = this.genRandomCode();

    // Хэшируем пароль для сохранения в Redis
    const hashedPassword = await this.hashService.hash(password);

    // Сохраняем данные пользователя и код в Redis
    const registrationData = {
      email,
      password: hashedPassword,
      verificationCode,
      createdAt: new Date().toISOString(),
    };

    // TODO: Сохранить в Redis с TTL (например, 15 минут)
    await this.cacheService.set({
      baseKey: cacheKey,
      ttl: 900,
      value: JSON.stringify(registrationData),
    });

    // TODO: Отправить код подтверждения на email через RabbitMQ
    await this.rabbitmqService.sendEmail({
      to: email,
      subject: 'Код подтверждения регистрации',
      data: {
        verificationCode,
      },
    });

    return {
      message: 'Код подтверждения отправлен на ваш email',
      status: 200,
    };
  }

  async refreshToken(
    refreshTokenDto: RefreshTokenDto,
    user: JwtPayload,
  ): Promise<TokensDto> {
    const { refreshToken } = refreshTokenDto;

    // 1. Проверить что refresh token предоставлен
    if (!refreshToken) {
      throw new BadRequestException('Refresh token обязателен');
    }

    let userId: string;

    // 2. Если пользователь авторизован, использовать его ID
    if (user) {
      userId = user.id;
    } else {
      // 3. Проверить refresh token из cookies
      // TODO: Извлечь refresh token из cookies в контроллере и передать сюда
      throw new UnauthorizedException('Refresh token не найден в cookies');
    }

    // 5. Получить данные пользователя
    const userData = await this.userService.getUserById(userId);
    if (!userData) {
      throw new NotFoundException('Пользователь не найден');
    }

    // 6. Сгенерировать новую пару токенов
    const tokenRecord = await this.jwtTokenService.issueTokens(
      userData.id,
      userData.name,
      userData.email,
    );

    const tokens: TokensDto = {
      accessToken: tokenRecord.accessToken,
      refreshToken: tokenRecord.refreshToken,
    };

    // 7. Сохранить новый refresh token в cookies (без Redis)
    // Refresh токены хранятся в cookies, а не в Redis
    // TODO: Реализовать сохранение в cookies через Response объект

    this.logger.logAuth('refresh_token_success', userData.id, userData.email);

    return tokens;
  }

  async logout(): Promise<void> {
    this.logger.logAuth('logout_success', 'user');
  }

  private genRandomCode(length: number = 5): string {
    return Math.floor(
      10 ** (length - 1) + Math.random() * 9 * 10 ** (length - 1),
    ).toString();
  }
}
