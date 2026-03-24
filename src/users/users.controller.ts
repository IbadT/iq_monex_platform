import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiTags } from '@nestjs/swagger';
import { Protected } from '@/common/decorators';
import { UpdateUserDto } from './dto/update-user.dto';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { JwtPayload } from '@/common/interfaces/jwt-payload.interface';
import { MakeComplaintToUserDto } from './dto/make-complaint-to-user.dto';
import { ApiUpdateUserDocs } from './decorators/api-update-user-docs.decorator';
import { GetProfilesDto } from './dto/get-profiles.dto';
import { ApiGetProfilesDocs } from './decorators/api-get-profiles-docs.decorator';
import { ApiGetProfileByIdDocs } from './decorators/api-get-profile-by-id-docs.decorator';
import { ApiGetUserByAccountNumberDocs } from './decorators/api-get-user-by-account-number-docs.decorator';
import { ApiMakeComplaintToUserDocs } from './decorators/api-make-complaint-to-user-docs.decorator';
import { ApiSeedRolesDocs } from './decorators/api-seed-roles-docs.decorator';
import { GetAllProfilesResponseDto } from './dto/response/profile-response.dto';
import { FullProfileResponseDto } from './dto/response/full-profile-response.dto';
import { UserResponseDto } from './dto/response/user-response.dto';
import { ComplaintResponseDto } from './dto/response/complaint-response.dto';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // получить все профили
  @Get('profiles')
  @ApiGetProfilesDocs()
  async getProfiles(
    @Query() query: GetProfilesDto,
  ): Promise<GetAllProfilesResponseDto> {
    // Если есть поисковый запрос, используем Elasticsearch
    return await this.usersService.searchProfiles(query);
    // if (query.query || query.ratingMin !== null || query.activityIds) {
    // }
    // // Иначе используем обычный поиск из БД
    // return await this.usersService.getProfilesFromDB(query);
  }

  // получить свой профиль
  // получить профиль
  @Get(':id/profiles')
  @Protected()
  @ApiGetProfileByIdDocs()
  async getProfileById(
    @CurrentUser() user: JwtPayload,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<FullProfileResponseDto> {
    return await this.usersService.getProfileById(user.id, id);
  }

  @Get(':account_number')
  @ApiGetUserByAccountNumberDocs()
  async getUserByAccountNumber(
    @Param('account_number') account_number: string,
  ): Promise<UserResponseDto> {
    return await this.usersService.getUserByAccountNumber(account_number);
  }

  @Post('users/:id/complaint')
  @Protected()
  @ApiMakeComplaintToUserDocs()
  async makeComplaintToUser(
    @CurrentUser() user: JwtPayload,
    @Body() body: MakeComplaintToUserDto,
  ): Promise<ComplaintResponseDto> {
    return await this.usersService.makeComplaintToUser(user.id, body);
  }

  // TODO: убрать
  @Post('seed-roles')
  @ApiSeedRolesDocs()
  async seedRoles() {
    return await this.usersService.seedRoles();
  }

  // редактирование профиля
  @Patch()
  @Protected()
  @ApiUpdateUserDocs()
  async updateProfile(
    @CurrentUser() user: JwtPayload,
    @Body() body: UpdateUserDto,
  ): Promise<UserResponseDto> {
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
