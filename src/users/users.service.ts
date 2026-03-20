import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { prisma } from '@/lib/prisma';
import { CacheService } from '@/cache/cacheService.service';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { AppLogger } from '@/common/logger/logger.service';
import { RoleType } from './enums/role-type.enum';
import { roles } from './default/roleData';
import { FavoriteType } from '@/favorites/enums/favorite-type.enum';
import { AddFavoriteToUserDto } from './dto/add-favorite-to-user.dto';
import { MakeComplaintToUser } from './dto/make-complaint-to-user.dto';
import { ComplaintType } from './enums/complaint-type.enum';
import { PaginationDto } from '@/common/dto/pagintation.dto';
import { WorkersService } from '@/workers/workers.service';
import { MapLocationsService } from '@/map_locations/map-locations.service';
import { ActivitiesService } from '@/activities/activities.service';
import { PrismaClient } from 'prisma/generated/client';

@Injectable()
export class UsersService {
  constructor(
    private readonly cacheService: CacheService,
    private readonly logger: AppLogger,
    private readonly workersService: WorkersService,
    private readonly mapLocationsService: MapLocationsService,
    private readonly activitiesService: ActivitiesService,
  ) {}

  async getUserReviews(userId: string, query: PaginationDto) {
    return await prisma.review.findMany({
      where: {
        targetUserId: userId,
      },
      take: query.limit,
      skip: query.offset,
    });
  }

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
      const userEntity = User.fromUpdateUserDto(user, null);

      // await this.cacheService.setUserByEmail(email, userEntity, 3600);
      return userEntity;
    }

    return null;
  }

  // Внутренний метод для получения пользователя с паролем (для аутентификации)
  async getUserByEmailWithPassword(email: string) {
    return prisma.user.findUnique({
      where: { email },
      include: {
        role: true,
      },
    });
  }

  async getUserById(id: string): Promise<User | null> {
    const cachedUser = await this.cacheService.getUserById(id);

    if (cachedUser) {
      return cachedUser;
    }

    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        profile: {
          include: {
            legalEntityType: true,
            currency: true,
          },
        },
      },
    });

    if (user) {
      const userEntity = User.fromUpdateUserDto(user, user.profile);
      
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

  async makeComplaintToUser(userId: string, body: MakeComplaintToUser) {
    const checkComplaintAlreadyExist = await prisma.complaint.findFirst({
      where: {
        authorId: userId,
      },
    });

    if (checkComplaintAlreadyExist) {
      throw new ConflictException('Вы уже подали жалобу на этот профиль');
    }

    return await prisma.complaint.create({
      data: {
        complaintType: ComplaintType.USER,
        type: body.type,
        text: body.text,
        authorId: userId,
        targetUserId: body.userId,
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

  async createUser(data: {
    email: string;
    accountNumber: string;
    password: string;
    name: string;
    isVerified?: boolean;
  }): Promise<User> {
    const { email } = data;
    const role =
      email === 'admin@admin.com' ? RoleType.SUPER_ADMIN : RoleType.USER;

    const userRole = await prisma.role.findFirst({
      where: {
        code: role,
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

    const userEntity = User.fromUpdateUserDto(user, null);

    // Кэшируем нового пользователя
    await this.cacheService.setUserById(user.id, userEntity, 3600);
    // await this.cacheService.setUserByEmail(user.email, userEntity, 3600);

    return userEntity;
  }

  async updateUser(id: string, body: UpdateUserDto): Promise<{
    id: string;
    name: string;
    email: string;
    accountNumber: string;
    isVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
  }> {
    this.logger.log(`Обновление пользователя id: ${id}, body: ${body}`);
    
    try {
      // Начинаем транзакцию для атомарности операций
      const result = await prisma.$transaction(async (tx: PrismaClient) => {
        // 1. Обновляем основные данные пользователя
        const updatedUser = await tx.user.update({
          where: { id },
          data: {
            name: body.name,
          },
        });

        // 2. Обрабатываем профиль
        const existingProfile = await tx.profile.findUnique({
          where: { userId: id },
        });

        if (existingProfile) {
          // Обновляем существующий профиль
          await tx.profile.update({
            where: { userId: id },
            data: {
              legalEntityTypeId: body.legalEntityId,
              currencyId: body.currencyId,
              avatarUrl: body.avatar,
              phone: body.companyPhone,
              email: body.companyEmail,
              telegram: body.telegram,
              siteUrl: body.siteUrl,
              description: body.description,
            },
          });
        } else {
          // Создаем новый профиль
          await tx.profile.create({
            data: {
              userId: id,
              legalEntityTypeId: body.legalEntityId,
              currencyId: body.currencyId,
              avatarUrl: body.avatar,
              phone: body.companyPhone,
              email: body.companyEmail,
              telegram: body.telegram,
              siteUrl: body.siteUrl,
              description: body.description,
            },
          });
        }

        // 3. Обрабатываем активности
        await this.activitiesService.processActivities({
          userId: id,
          activities: body.activities,
          tx: tx,
        });

        // 4. Обрабатываем сотрудников (workers)
        if (body.workers && body.workers.length > 0) {
          await this.workersService.processWorkers(id, body.workers, tx);
        }

        // 5. Обрабатываем локации (maps)
        if (body.maps && body.maps.length > 0) {
          await this.mapLocationsService.processMapLocations({
            userId: id,
            maps: body.maps,
            tx: tx,
          });
        }

        // 6. Очищаем кэш
        await this.cacheService.del(`activities/users:${id}`);
        await this.cacheService.del(`activities`);

        return updatedUser;
      });

      return result;
    } catch (error) {
      this.logger.error(`Ошибка при обновлении пользователя: ${error.message}`);
      throw error;
    }
  }

  async seedRoles() {
    for (const role of roles) {
      const existingRole = await prisma.role.findFirst({
        where: { code: role.code },
      });

      if (!existingRole) {
        await prisma.role.create({
          data: role,
        });
      } else {
        await prisma.role.update({
          where: { id: existingRole.id },
          data: {
            role: role.role,
            // обновляем только название, не трогаем связи
          },
        });
      }
    }
  }
}
