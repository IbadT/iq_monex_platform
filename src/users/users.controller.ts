import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiTags } from '@nestjs/swagger';
import {
  Public,
  Protected,
  Admin,
  RateLimit,
  AccessControl,
} from '@/common/decorators';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Protected()
  @RateLimit(100, 60000) // 100 запросов в минуту
  async findAll() {
    // return this.usersService.findAll();
  }

  @Get(':id')
  @Protected()
  async findOne(@Param('id') id: string) {
    // return this.usersService.findOne(id);
  }

  @Post()
  @Admin() // Только для администраторов
  async create(@Body() createUserDto: any) {
    // return this.usersService.create(createUserDto);
  }

  @Patch(':id')
  @AccessControl({
    roles: ['admin', 'moderator'],
    rateLimit: { limit: 50, windowMs: 60000 },
  })
  async update(@Param('id') id: string, @Body() updateUserDto: any) {
    // return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @Admin() // Только для администраторов
  async remove(@Param('id') id: string) {
    // return this.usersService.remove(id);
  }

  @Get('profile/me')
  @Protected()
  async getProfile() {
    // Получение профиля текущего пользователя
    // return this.usersService.getProfile();
  }

  @Get('public/stats')
  @Public()
  @RateLimit(10, 60000) // 10 запросов в минуту для публичного эндпоинта
  async getPublicStats() {
    // Публичная статистика
    // return this.usersService.getPublicStats();
  }
}
