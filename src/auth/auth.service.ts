import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HashService } from './hash.service';
import { LoginUserDto } from './dto/login-user.dto';
import { UsersService } from '@/users/users.service';
import { LoginResponseDto } from './dto/login-response.dto';
import { RegisterResponseDto } from './dto/register-response.dto';
import { User } from '@/users/entities/user.entity';
import { JwtTokenService } from './jwt/jwt.service';
import { AppLogger } from '@/common/logger/logger.service';

@Injectable()
export class AuthService {
  constructor(
    private configService: ConfigService,
    private hashService: HashService,
    private userService: UsersService,
    private jwtTokenService: JwtTokenService,
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
    };

    const tokens = await this.jwtTokenService.issueTokens(existUser.id);

    this.logger.logAuth('login_success', existUser.id, email);

    return new LoginResponseDto(
      tokens.accessToken,
      tokens.refreshToken,
      userEntity,
    );
  }

  async register(loginUserDto: LoginUserDto): Promise<RegisterResponseDto> {
    const { email, password } = loginUserDto;

    // Проверяем, существует ли пользователь
    const existingUser =
      await this.userService.getUserByEmailWithPassword(email);
    if (existingUser) {
      // throw new Error('Пользователь уже существует');
      throw new ConflictException(
        `Пользователь с таким email: ${email} уже зарегистрирован`,
      );
    }

    // Хэшируем пароль
    const hashedPassword = await this.hashService.hash(password);

    // Создаем пользователя
    const user = await this.userService.createUser({
      email,
      password: hashedPassword,
    });

    const tokens = await this.jwtTokenService.issueTokens(user.id);

    return new RegisterResponseDto(
      tokens.accessToken,
      tokens.refreshToken,
      user,
    );
  }
}
