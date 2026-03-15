import { Body, Controller, Post, Get, Res, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { LoginUserDto } from './dto/request/login-user.dto';
import { RegisterUserDto } from './dto/request/register-user.dto';
import { AuthService } from './auth.service';
import { LoginResponseDto } from './dto/response/login-response.dto';
import { RegisterResponseDto } from './dto/response/register-response.dto';
import { TokensDto } from './dto/tokens.dto';
import { JwtPayload } from '@/common/interfaces/jwt-payload.interface';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { Protected } from '@/common/decorators/protected.decorator';
import { Response, Request } from 'express';
import { ApiLoginOperation } from './decorators/login.decorator';
import { ApiRegisterOperation } from './decorators/register.decorator';
import { Public } from '@/common/decorators';
import { VerifyCodeDto, VerifyCodeResponseDto } from './dto/verify-code.dto';
import { ResendEmailDto } from './dto/resend-email.dto';
// import { ApiRefreshTokenOperation } from './decorators/refresh-token.decorator';
import { ApiVerifyEmailOperation } from './decorators/verify-email.decorator';
import { ApiResendEmailOperation } from './decorators/resend-email.decorator';
import { ApiRefreshTokenOperation } from '@/common/decorators/swagger.decorators';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('me')
  @Protected()
  async me() {
    return;
  }

  @Post('login')
  @Public()
  @ApiLoginOperation()
  async login(
    @Body() loginUserDto: LoginUserDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<LoginResponseDto> {
    const tokens = await this.authService.login(loginUserDto);

    // Устанавливаем cookies
    response.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 дней
    });

    response.cookie('accessToken', tokens.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000, // 15 минут
    });

    return tokens;
  }

  @Post('sign-up')
  @Public()
  @ApiRegisterOperation()
  async register(@Body() body: RegisterUserDto): Promise<RegisterResponseDto> {
    return this.authService.register(body);
  }

  @Post('sign-up/confirm')
  @Public()
  @ApiVerifyEmailOperation()
  async registerConfirm(@Body() verifyCodeDto: VerifyCodeDto): Promise<VerifyCodeResponseDto> {
    return this.authService.verifyEmailCode(verifyCodeDto);
  }

  @Post('sign-up/resend-email')
  @Public()
  @ApiResendEmailOperation()
  async registerResendEmail(@Body() resendEmailDto: ResendEmailDto): Promise<{ message: string; status: number }> {
    return this.authService.resendVerificationCode(resendEmailDto.email);
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
  @ApiRefreshTokenOperation()
  async refreshToken(
    @CurrentUser() user: JwtPayload,
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<TokensDto> {
    const refreshTokenFromCookie = (request as any).cookies?.refreshToken;

    const tokens = await this.authService.refreshToken(
      { refreshToken: refreshTokenFromCookie },
      user,
    );

    // Устанавливаем cookies
    response.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 дней
    });

    response.cookie('accessToken', tokens.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000, // 15 минут
    });

    return tokens;
  }

  @Post('sign-out')
  @Public()
  async logOut(
    // @CurrentUser() user: JwtPayload,
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.authService.logout();
    res.clearCookie('refreshToken');
    res.clearCookie('accessToken');
    return;
  }
}
