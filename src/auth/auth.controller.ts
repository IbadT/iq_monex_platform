import { Controller, Post, Body, Get, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { ApiTags } from '@nestjs/swagger';
import { RegisterResponseDto } from './dto/register-response.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { ApiLoginOperation } from './decorators/login.decorator';
import { ApiRegisterOperation } from './decorators/register.decorator';
import { Protected, Public } from '@/common/decorators';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {}

  @Get('me')
  @Protected()
  async me() {
    return;
  }

  @Post('sign-in')
  @Public()
  @ApiLoginOperation()
  async login(
    @Body() body: LoginUserDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<LoginResponseDto> {
    const tokens = await this.authService.login(body);

    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure:
        this.configService.getOrThrow<string>('NODE_ENV') === 'production',
      sameSite: 'strict',
      maxAge: this.configService.getOrThrow<number>(
        'COOKIES_REFRESH_TOKEN_EXPIRES_ID',
      ),
      path: 'api/auth/refresh-token',
    });

    res.cookie('accessToken', tokens.accessToken, {
      httpOnly: true,
      secure:
        this.configService.getOrThrow<string>('NODE_ENV') === 'production',
      sameSite: 'strict',
      maxAge: this.configService.getOrThrow<number>(
        'COOKIES_ACCESS_TOKEN_EXPIRES_ID',
      ),
    });

    return tokens;
  }

  @Post('sign-up')
  @Public()
  @ApiRegisterOperation()
  async register(@Body() body: RegisterUserDto): Promise<RegisterResponseDto> {
    return this.authService.register(body);
  }

  // TODO: объединить
  @Post('sign-up/confirm')
  @Public()
  async registerConfirm() {
    return;
  }

  @Post('sign-up/resend-email')
  @Public()
  async registerResendEmail() {
    return;
  }

  @Post('reset-password')
  @Public()
  async resetPassword() {
    return;
  }

  @Post('reset-password/resend-email')
  @Public()
  async resetPasswordResendEmail() {
    return;
  }

  //

  @Post('refresh-token')
  @Public()
  async refreshToken() {
    return;
  }

  @Post('sign-out')
  @Public()
  async logOut() {
    return;
  }
}
