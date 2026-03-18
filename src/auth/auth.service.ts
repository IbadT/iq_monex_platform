import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';
import { HashService } from './hash.service';
// import { EmailService } from '@/email/email.service';
import { VerifyCodeDto, VerifyCodeResponseDto } from './dto/verify-code.dto';
import { LoginUserDto } from './dto/request/login-user.dto';
import { UsersService } from '@/users/users.service';
import { LoginResponseDto } from './dto/response/login-response.dto';
import { TokensDto } from './dto/tokens.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ConfirmResetPasswordDto } from './dto/confirm-reset-password.dto';

import { User } from '@/users/entities/user.entity';
import { JwtTokenService } from './jwt/jwt.service';
import { AppLogger } from '@/common/logger/logger.service';
import { RegisterResponseDto } from './dto/response/register-response.dto';
import { CacheService } from '@/cache/cacheService.service';
import { RabbitmqService } from '@/rabbitmq/rabbitmq.service';
import { randomInt } from 'crypto';
import { prisma } from '@/lib/prisma';

@Injectable()
export class AuthService {
  constructor(
    // private configService: ConfigService,
    private readonly hashService: HashService,
    private readonly userService: UsersService,
    private readonly jwtTokenService: JwtTokenService,
    private readonly cacheService: CacheService,
    private readonly rabbitmqService: RabbitmqService,
    // private readonly emailService: EmailService,
    private readonly logger: AppLogger,
  ) {}

  async getMe(userId: string) {
    return prisma.user.findFirst({
      where: {
        id: userId
      },
      select: {
        id: true,
      }
    })
  }

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
      accountNumber: existUser.accountNumber,
      isVerified: existUser.isVerified,
    };

    const tokens = await this.jwtTokenService.issueTokens(
      existUser.id,
      existUser.role?.code || 'USER',
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

    // 1. Проверяем, существует ли пользователь с таким email в базе данных
    const existingUser =
      await this.userService.getUserByEmailWithPassword(email);
    if (existingUser) {
      throw new ConflictException(
        `Пользователь с таким email: ${email} уже зарегистрирован`,
      );
    }

    // 2. Генерируем код подтверждения и хэшируем пароль
    const verificationCode = this.genRandomCode();
    const accountNumber = await this.generateUniqueAccountNumber();
    const hashedPassword = await this.hashService.hash(password);

    // TODO: убалить на проде
    if (email === "admin@admin.com") {
      const res = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          accountNumber,
          isVerified: true,
          name: 'Admin',
          roleId: "0418d130-f898-433b-b771-18594e61569f",
        },
      })
      return {
        ...res,
        status: 200,
      }
    }

    // 3. Записываем все в Redis
    const registrationData = {
      email,
      password: hashedPassword,
      accountNumber,
      verificationCode,
      createdAt: new Date().toISOString(),
    };

    this.logger.log(
      `[REGISTER] Сохраняем в Redis ключ: ${cacheKey}, данные: ${JSON.stringify(registrationData)}`,
    );

    await this.cacheService.set({
      baseKey: cacheKey,
      ttl: 900, // 15 минут
      value: JSON.stringify(registrationData),
    });

    // 4. НЕ создаем пользователя в БД сразу - только после верификации
    // const newUser = await this.userService.createUser({
    //   email,
    //   accountNumber,
    //   password: hashedPassword,
    //   name: '', // Временно пустое имя
    //   isVerified: false, // Поле для отслеживания верификации
    // });

    // 5. Отправляем через RabbitMQ код подтверждения
    const emailData = {
      to: email,
      subject: 'Код подтверждения регистрации',
      data: {
        // userId: newUser.id, // Пока нет пользователя
        verificationCode,
      },
    };
    
    this.logger.log(
      `[REGISTER] Отправляем через RabbitMQ: ${JSON.stringify(emailData)}`,
    );

    try {
      await this.rabbitmqService.sendEmail(emailData);
    } catch (error) {
      this.logger.error(`[REGISTER] Ошибка отправки email:`, error);
      throw new BadRequestException('Ошибка отправки кода подтверждения. Попробуйте позже.');
    }

    return {
      message: 'Код подтверждения отправлен на ваш email',
      status: 200,
    };
  }

  async verifyEmailCode(
    verifyCodeDto: VerifyCodeDto,
  ): Promise<VerifyCodeResponseDto> {
    const { email, code } = verifyCodeDto;

    this.logger.logAuth('verify_code_attempt', undefined, email);

    // Получаем данные из Redis
    const cacheKey = `register:${email}`;
    const registrationData = await this.cacheService.get(cacheKey);

    this.logger.log(
      `[VERIFY] Читаем из Redis ключ: ${cacheKey}, данные: ${registrationData}`,
    );

    if (!registrationData) {
      throw new UnauthorizedException(
        'Сессия регистрации истекла. Пожалуйста, зарегистрируйтесь заново.',
      );
    }

    const parsedData = JSON.parse(registrationData as string);
    this.logger.log(
      `[VERIFY] Распарсенные данные: ${JSON.stringify(parsedData)}`,
    );
    this.logger.log(
      `[VERIFY] Ожидаемый код: ${parsedData.verificationCode}, полученный код: ${code}`,
    );

    // Проверяем код
    if (parsedData.verificationCode !== code) {
      throw new UnauthorizedException('Неверный код подтверждения');
    }

    // 4. Создаем пользователя в БД только после успешной верификации
    const newUser = await this.userService.createUser({
      email: parsedData.email,
      accountNumber: parsedData.accountNumber,
      password: parsedData.password,
      name: '', // Имя по умолчанию
      isVerified: true, // Пользователь сразу верифицирован
    });

    this.logger.log(`[VERIFY] Пользователь создан: ${newUser.id}, email: ${newUser.email}`);

    // 5. Удаляем данные из Redis
    await this.cacheService.del(cacheKey);

    // 6. Генерируем JWT токены
    const { accessToken, refreshToken } = await this.jwtTokenService.issueTokens(
      newUser.id,
      newUser.name || '',
      newUser.email,
    );

    this.logger.logAuth('verify_success', newUser.id, email);

    return {
      message: 'Email успешно подтвержден',
      status: 200,
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        accountNumber: newUser.accountNumber,
        isVerified: true,
      },
      tokens: {
        accessToken,
        refreshToken,
      },
    };
  }

  async resendVerificationCode(
    email: string,
  ): Promise<{ message: string; status: number }> {
    this.logger.logAuth('resend_code_attempt', undefined, email);

    // Проверяем, существует ли пользователь
    const user = await this.userService.getUserByEmailWithPassword(email);
    if (!user) {
      throw new ConflictException('Пользователь с таким email не найден');
    }

    // Если пользователь уже верифицирован
    if (user.isVerified) {
      throw new ConflictException('Email уже подтвержден');
    }

    // Генерируем новый код
    const verificationCode = this.genRandomCode();

    // Обновляем код в Redis
    const cacheKey = `register:${email}`;
    const existingData = await this.cacheService.get(cacheKey);

    if (existingData) {
      const parsedData = JSON.parse(existingData as string);
      parsedData.verificationCode = verificationCode;
      await this.cacheService.set({
        baseKey: cacheKey,
        ttl: 900,
        value: JSON.stringify(parsedData),
      });
    } else {
      // Если данных нет в Redis, создаем новые
      const registrationData = {
        email,
        verificationCode,
        createdAt: new Date().toISOString(),
      };
      await this.cacheService.set({
        baseKey: cacheKey,
        ttl: 900,
        value: JSON.stringify(registrationData),
      });
    }

    // Отправляем через RabbitMQ
    await this.rabbitmqService.sendEmail({
      to: email,
      subject: 'Код подтверждения регистрации',
      data: {
        userId: user.id,
        verificationCode,
      },
    });

    this.logger.logAuth('resend_code_success', user.id, email);

    return {
      message: 'Код подтверждения отправлен на ваш email',
      status: 200,
    };
  }

  async refreshToken(
    refreshTokenDto: RefreshTokenDto,
  ): Promise<TokensDto> {
    const { refreshToken } = refreshTokenDto;

    // 1. Проверить что refresh token предоставлен
    if (!refreshToken) {
      throw new BadRequestException('Refresh token обязателен');
    }

    // 2. Проверить валидность refresh token
    let decodedToken: any;
    try {
      decodedToken = await this.jwtTokenService.verifyToken(refreshToken);
    } catch (error) {
      throw new UnauthorizedException('Невалидный refresh token');
    }

    // 3. Получить ID пользователя из refresh token
    const userId = decodedToken.id;

    // 4. Получить данные пользователя
    const userData = await this.userService.getUserById(userId);
    if (!userData) {
      throw new NotFoundException('Пользователь не найден');
    }

    // 5. Сгенерировать новую пару токенов
    const tokenRecord = await this.jwtTokenService.issueTokens(
      userData.id,
      userData.name,
      userData.email,
    );

    const tokens: TokensDto = {
      accessToken: tokenRecord.accessToken,
      refreshToken: tokenRecord.refreshToken,
    };

    this.logger.logAuth('refresh_token_success', userData.id, userData.email);

    return tokens;
  }

  async logout(userId: string): Promise<void> {
  // Здесь можно добавить дополнительную логику:
  // - Удалить refresh token из blacklist/Redis
  // - Обновить lastActivity пользователя
  // - Очистить сессии
  
  this.logger.logAuth('logout_success', userId);
}

  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<{ message: string; status: number }> {
    const { email } = resetPasswordDto;

    // Проверяем что пользователь существует
    const user = await this.userService.getUserByEmail(email);
    if (!user) {
      throw new NotFoundException('Пользователь с таким email не найден');
    }

    // Генерируем код сброса пароля
    const resetCode = this.genRandomCode();

    // Сохраняем код в Redis
    const cacheKey = `reset-password:${email}`;
    await this.cacheService.set({
      baseKey: cacheKey,
      value: resetCode,
      ttl: 600, // 10 минут
    });

    // Отправляем email с кодом
    await this.rabbitmqService.sendEmail({
      to: email,
      subject: 'Сброс пароля',
      template: 'reset-password',
      data: {
        userId: user.id,
        verificationCode: resetCode,
        userName: user.name || user.email,
      },
    });

    this.logger.logAuth('reset_password_code_sent', user.id, email);

    return {
      message: 'Код для сброса пароля отправлен на ваш email',
      status: 200,
    };
  }

  async confirmResetPassword(confirmResetPasswordDto: ConfirmResetPasswordDto): Promise<{ message: string; status: number }> {
    const { email, code, newPassword } = confirmResetPasswordDto;

    // Проверяем код из Redis
    const cacheKey = `reset-password:${email}`;
    const storedCode = await this.cacheService.get(cacheKey);

    if (!storedCode || storedCode !== code) {
      throw new UnauthorizedException('Неверный или истекший код сброса пароля');
    }

    // Получаем пользователя
    const user = await this.userService.getUserByEmail(email);
    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    // Хешируем новый пароль
    const hashedPassword = await this.hashService.hash(newPassword);

    // Обновляем пароль
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    // Удаляем код из Redis
    await this.cacheService.del(cacheKey);

    this.logger.logAuth('password_reset_success', user.id, email);

    return {
      message: 'Пароль успешно изменен',
      status: 200,
    };
  }

  private async generateUniqueAccountNumber(): Promise<string> {
    const accountNumber = randomInt(10_000_000, 100_000_000).toString();
    const exists = await prisma.user.findUnique({
      where: { accountNumber },
    });
    if (exists) {
      return this.generateUniqueAccountNumber();
    }

    return accountNumber;
  }

  private genRandomCode(length: number = 6): string {
    return Math.floor(
      10 ** (length - 1) + Math.random() * 9 * 10 ** (length - 1),
    ).toString();
  }
}
