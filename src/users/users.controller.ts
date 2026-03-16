import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiTags } from '@nestjs/swagger';
import { Protected } from '@/common/decorators';
import { UpdateUserDto } from './dto/update-user.dto';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { JwtPayload } from '@/common/interfaces/jwt-payload.interface';
import { AddFavoriteToUserDto } from './dto/add-favorite-to-user.dto';
import { MakeComplaintToUser } from './dto/make-complaint-to-user.dto';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // получить свой профиль
  // получить профиль
  @Get(':id/profile')
  async getProfileById(@Param('id', ParseUUIDPipe) id: string) {
    return await this.usersService.getUserById(id);
  }

  @Get(':account_number')
  async getUserByAccountNumber(
    @Param('account_number') account_number: string,
  ) {
    return await this.usersService.getUserByAccountNumber(account_number);
  }

  @Get('favorites')
  @Protected()
  async getUserFavoritesProfiles(@CurrentUser() user: JwtPayload) {
    return await this.usersService.getUserFavoritesProfiles(user.id);
  }

  @Post('favorites')
  @Protected()
  async addFavoriteToUser(
    @CurrentUser() user: JwtPayload,
    @Body() body: AddFavoriteToUserDto,
  ) {
    return await this.usersService.addFavoriteToUser(user.id, body);
  }

  @Post('users/:id/complaint')
  @Protected()
  async makeComplaintToUser(
    @CurrentUser() user: JwtPayload,
    @Body() body: MakeComplaintToUser,
  ) {
    return await this.usersService.makeComplaintToUser(user.id, body);
  }



  @Post('seed-roles')
  async seedRoles() {
    return await this.usersService.seedRoles();
  }

  // редактирование профиля
  @Patch()
  @Protected()
  async updateProfile(
    @CurrentUser() user: JwtPayload,
    @Body() body: UpdateUserDto,
  ) {
    return await this.usersService.updateUser(user.id, body);
  }

  // получить все сферы деятельности

  // получить все должности работников

  // получить коментарии к своему профилю

  // оставить комментарий к профилю

  // оставить жалобу на профиль

  // получить свои избранные профили

  // добавить профиль в избранное

  // убрать профиль из избранного

  // получить профили компании

  // получить коментарии к профилю

  // ====================================================================

  // @Get()
  // @Protected()
  // @RateLimit(100, 60000) // 100 запросов в минуту
  // async findAll() {
  //   // return this.usersService.findAll();
  // }

  // @Get(':id')
  // @Protected()
  // async findOne(@Param('id') id: string) {
  //   // return this.usersService.findOne(id);
  // }

  // @Post()
  // @Admin() // Только для администраторов
  // async create(@Body() createUserDto: any) {
  //   // return this.usersService.create(createUserDto);
  // }

  // @Patch(':id')
  // @AccessControl({
  //   roles: ['admin', 'moderator'],
  //   rateLimit: { limit: 50, windowMs: 60000 },
  // })
  // async update(@Param('id') id: string, @Body() updateUserDto: any) {
  //   // return this.usersService.update(id, updateUserDto);
  // }

  // @Delete(':id')
  // @Admin() // Только для администраторов
  // async remove(@Param('id') id: string) {
  //   // return this.usersService.remove(id);
  // }

  // @Get('profile/me')
  // @Protected()
  // async getProfile() {
  //   // Получение профиля текущего пользователя
  //   // return this.usersService.getProfile();
  // }

  // @Get('public/stats')
  // @Public()
  // @RateLimit(10, 60000) // 10 запросов в минуту для публичного эндпоинта
  // async getPublicStats() {
  //   // Публичная статистика
  //   // return this.usersService.getPublicStats();
  // }
}
