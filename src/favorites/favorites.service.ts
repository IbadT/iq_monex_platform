import { BadRequestException, Injectable } from '@nestjs/common';
import { prisma } from '@/lib/prisma';
import { CacheService } from '@/cache/cacheService.service';
import { AppLogger } from '@/common/logger/logger.service';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { FavoriteType } from './enums/favorite-type.enum';
import { AddFavoriteToUserDto } from './dto/add-favorite-to-user.dto';

@Injectable()
export class FavoriteService {
  constructor(
    private readonly cacheService: CacheService,
    private readonly logger: AppLogger,
  ) {}

    async favoriteUsers(userId: string) {
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

  async getList(userId: string) {
    const cacheKey = `favorites/userId:${userId}`;
    const cachedData = await this.cacheService.get(cacheKey);
    if (cachedData) return cachedData;

    const list = await prisma.favorite.findMany({
      where: {
        userId,
      },
      include: {
        listing: true,
      },
    });

    if (list && list.length > 0) {
      await this.cacheService.set({
        baseKey: cacheKey,
        ttl: 900,
        value: list,
      });
      this.logger.log(`Set ${list.length} favorites list to redis`);
    }

    return list;
  }

  async getById(id: string) {
    const cacheKey = `favorites/id:${id}`;
    const cachedData = await this.cacheService.get(cacheKey);
    if (cachedData) return cachedData;

    const favorite = await prisma.favorite.findFirst({
      where: { id },
      include: {
        listing: true,
      },
    });

    if (favorite) {
      await this.cacheService.set({
        baseKey: cacheKey,
        ttl: 900,
        value: favorite,
      });
    }

    return favorite;
  }

  async create(userId: string, body: CreateFavoriteDto) {
    const cacheKey = `favorites/userId:${userId}`;
    const createdFavorite = await prisma.favorite.create({
      data: {
        userId,
        listingId: body.listingId,
        type: FavoriteType.LISTING,
      },
    });
    await this.cacheService.del(cacheKey);

    return createdFavorite;
  }

  async delete(id: string) {
    // TODO: продумать логику над удалением всех или по id
    return await prisma.favorite.delete({
      where: { id },
    });
  }
}
