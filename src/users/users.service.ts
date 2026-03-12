import { BadRequestException, Injectable } from '@nestjs/common';
import { prisma } from '@/lib/prisma';
import { CacheService } from '@/cache/cacheService.service';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { AppLogger } from '@/common/logger/logger.service';
import { RoleType } from './enums/role-type.enum';
import { roles } from './default/roleData';
import { FavoriteType } from '@/favorites/enums/favorite-type.enum';
import { AddFavoriteToUserDto } from './dto/add-favorite-to-user.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly cacheService: CacheService,
    private readonly logger: AppLogger,
  ) {}

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
        name: user.name,
        accountNumber: user.accountNumber,
      };

      // await this.cacheService.setUserByEmail(email, userEntity, 3600);
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
        name: user.name,
        accountNumber: user.accountNumber,
      };

      await this.cacheService.setUserById(id, userEntity, 3600);
      return userEntity;
    }

    return null;
  }

  async getUserByAccountNumber(accountNumber: string) {
    return await prisma.user.findUnique({
      where: {
        accountNumber,
      },
    });
  }

  async getUserFavoritesProfiles(userId: string) {
    return await prisma.favorite.findMany({
      where: {
        userId,
        type: FavoriteType.USER,
      },
    });
  }

  async addFavoriteToUser(userId: string, body: AddFavoriteToUserDto) {
    const existFavorite = await prisma.favorite.findFirst({
      where: {
        userId,
        targetUserId: body.userId,
        type: FavoriteType.USER,
      },
    });

    // проверка, что этот пользователь не добавляет самого себя
    if (userId === existFavorite?.targetUserId) {
      throw new BadRequestException(
        'Пользователь не может добавить в избранное сам себя',
      );
    }

    // если существует, то убрать из избранного
    if (existFavorite) {
      return await prisma.favorite.delete({
        where: {
          id: existFavorite.id,
        },
      });
    } else {
      return await prisma.favorite.create({
        data: {
          userId,
          targetUserId: body.userId,
          type: FavoriteType.USER,
        },
      });
    }
  }

  // TODO: нужен ли?
  async invalidateUserCache(userId: string, email: string): Promise<void> {
    await this.cacheService.invalidateUserCache(userId, email);
  }

  async createUser(data: {
    email: string;
    accountNumber: string;
    password: string;
    name: string;
  }): Promise<User> {
    const { email } = data;
    const role = email === 'admin@admin.com' ? RoleType.ADMIN : RoleType.USER;

    const userRole = await prisma.role.findUnique({
      where: {
        type: role,
      },
    });

    if (!userRole) {
      throw new Error(`Role ${role} not found. Run seed first`);
    }

    const user = await prisma.user.create({
      data: {
        ...data,
        roleId: userRole.id,
      },
    });

    const userEntity: User = {
      id: user.id,
      email: user.email,
      name: user.name,
      accountNumber: user.accountNumber,
    };

    // Кэшируем нового пользователя
    await this.cacheService.setUserById(user.id, userEntity, 3600);
    // await this.cacheService.setUserByEmail(user.email, userEntity, 3600);

    return userEntity;
  }

  async updateUser(id: string, body: UpdateUserDto) {
    this.logger.log(`Обновление пользователя id: ${id}, body: ${body}`);
    return await prisma.user.update({
      where: { id },
      data: body,
    });
  }

  async seedRoles() {
    for (const role of roles) {
      await prisma.role.upsert({
        where: { type: role.type }, // или where: { code: role.code }
        update: {
          role: role.role,
          // обновляем только название, не трогаем связи
        },
        create: role,
      });
    }
  }
}
