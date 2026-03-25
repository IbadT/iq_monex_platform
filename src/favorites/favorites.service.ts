import { BadRequestException, Injectable } from '@nestjs/common';
import { prisma } from '@/lib/prisma';
import { CacheService } from '@/cache/cacheService.service';
import { AppLogger } from '@/common/logger/logger.service';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { FavoriteType } from './enums/favorite-type.enum';
import { FavoriteByIdResponseDto } from './dto/response/favorite-by-id-response.dto';
import { AddFavoriteToUserDto } from './dto/add-favorite-to-user.dto';
import { ListingMapper } from '@/listings/mappers/listing.mapper';
import { CreateFavoriteResponseDto } from './dto/response/create-favorite-response.dto';
import { FavoriteUserMapper } from './mappers/favorite-user.mapper';
import { FavoriteUserProfileResponseDto } from './dto/response/favorite-user-profile-response.dto';

@Injectable()
export class FavoriteService {
  constructor(
    private readonly cacheService: CacheService,
    private readonly logger: AppLogger,
  ) {}

    async favoriteUsers(userId: string): Promise<FavoriteUserProfileResponseDto[]> {
    const cacheKey = `favorites/users:${userId}`;
    const cachedData = await this.cacheService.get<FavoriteUserProfileResponseDto[]>(cacheKey);
    if (cachedData) return cachedData;

    const list = await prisma.favorite.findMany({
      where: {
        userId,
        type: FavoriteType.USER,
      },
      include: {
        targetUser: {
          include: {
            profile: true,
          },
        },
      },
    });

    const response = FavoriteUserMapper.toResponseList(list);

    if (response && response.length > 0) {
      await this.cacheService.set({
        baseKey: cacheKey,
        ttl: 900,
        value: response,
      });
      this.logger.log(`Set ${response.length} user favorites list to redis`);
    }

    return response;
  }

  async addFavoriteToUser(userId: string, body: AddFavoriteToUserDto): Promise<CreateFavoriteResponseDto> {
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

  async getList(userId: string): Promise<FavoriteByIdResponseDto[]> {
    const cacheKey = `favorites/userId:${userId}`;
    const cachedData = await this.cacheService.get<FavoriteByIdResponseDto[]>(cacheKey);
    if (cachedData) return cachedData;

    const list = await prisma.favorite.findMany({
      where: {
        userId,
      },
      include: {
        listing: true,
      },
    });

    const response = list.map(favorite => {
      const listingDto = favorite.listing ? ListingMapper.toResponse(favorite.listing) : null;
      
      return new FavoriteByIdResponseDto(
        favorite.id,
        favorite.userId,
        favorite.type,
        favorite.listingId,
        favorite.targetUserId,
        favorite.createdAt,
        listingDto,
      );
    });

    if (response && response.length > 0) {
      await this.cacheService.set({
        baseKey: cacheKey,
        ttl: 900,
        value: response,
      });
      this.logger.log(`Set ${response.length} favorites list to redis`);
    }

    return response;
  }

  async getById(id: string): Promise<FavoriteByIdResponseDto | null> {
    const cacheKey = `favorites/id:${id}`;
    const cachedData = await this.cacheService.get<FavoriteByIdResponseDto>(cacheKey);
    if (cachedData) return cachedData;

    const favorite = await prisma.favorite.findFirst({
      where: { id },
      include: {
        listing: true,
      },
    });

    if (favorite) {
      const listingDto = favorite.listing ? ListingMapper.toResponse(favorite.listing) : null;
      
      const response = new FavoriteByIdResponseDto(
        favorite.id,
        favorite.userId,
        favorite.type,
        favorite.listingId,
        favorite.targetUserId,
        favorite.createdAt,
        listingDto,
      );

      await this.cacheService.set({
        baseKey: cacheKey,
        ttl: 900,
        value: response,
      });

      return response;
    }

    return null;
  }

  async create(userId: string, body: CreateFavoriteDto): Promise<CreateFavoriteResponseDto> {
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
