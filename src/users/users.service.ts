import { Injectable } from '@nestjs/common';
import { prisma } from '@/lib/prisma';
import { CacheService } from '@/cache/cacheService.service';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(private readonly cacheService: CacheService) {}

  async getUserByEmail(email: string): Promise<User | null> {
    // Сначала пытаемся получить из кэша
    const cachedUser = await this.cacheService.getUserByEmail(email);

    if (cachedUser) {
      return cachedUser;
    }

    // Если нет в кэше, получаем из БД
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // Сохраняем в кэш на 1 час
    if (user) {
      const userEntity: User = {
        id: user.id,
        email: user.email,
      };

      await this.cacheService.setUserByEmail(email, userEntity, 3600);
      return userEntity;
    }

    return null;
  }

  // Внутренний метод для получения пользователя с паролем (для аутентификации)
  async getUserByEmailWithPassword(email: string) {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  async getUserById(id: string): Promise<User | null> {
    const cachedUser = await this.cacheService.getUserById(id);

    if (cachedUser) {
      return cachedUser;
    }

    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (user) {
      const userEntity: User = {
        id: user.id,
        email: user.email,
      };

      await this.cacheService.setUserById(id, userEntity, 3600);
      return userEntity;
    }

    return null;
  }

  // TODO: нужен ли?
  async invalidateUserCache(userId: string, email: string): Promise<void> {
    await this.cacheService.invalidateUserCache(userId, email);
  }

  async createUser(data: { email: string; password: string }): Promise<User> {
    const user = await prisma.user.create({
      data,
    });

    const userEntity: User = {
      id: user.id,
      email: user.email,
    };

    // Кэшируем нового пользователя
    await this.cacheService.setUserById(user.id, userEntity, 3600);
    await this.cacheService.setUserByEmail(user.email, userEntity, 3600);

    return userEntity;
  }
}
