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

  async favoriteUsers(
    userId: string,
  ): Promise<FavoriteUserProfileResponseDto[]> {
    const cacheKey = `favorites/users:${userId}`;
    const cachedData =
      await this.cacheService.get<FavoriteUserProfileResponseDto[]>(cacheKey);
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
            userActivities: {
              include: {
                activity: true,
              },
            },
            locations: {
              where: {
                type: 'OFFICE',
              },
            },
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

  async addFavoriteToUser(
    userId: string,
    body: AddFavoriteToUserDto,
  ): Promise<CreateFavoriteResponseDto> {
    const existFavorite = await prisma.favorite.findFirst({
      where: {
        userId,
        targetUserId: body.userId,
        type: FavoriteType.USER,
      },
    });

    // проверка, что этот пользователь не добавляет самого себя
    if (userId === body.userId) {
      throw new BadRequestException(
        'Пользователь не может добавить в избранное сам себя',
      );
    }

    // проверяем что целевой пользователь существует
    const targetUser = await prisma.user.findUnique({
      where: { id: body.userId },
    });

    if (!targetUser) {
      throw new BadRequestException('Пользователь не найден');
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
    const cachedData =
      await this.cacheService.get<FavoriteByIdResponseDto[]>(cacheKey);
    if (cachedData) return cachedData;

    const list = await prisma.favorite.findMany({
      where: {
        userId,
      },
      include: {
        listing: {
          include: {
            category: true,
            subcategory: true,
            subsubcategory: true,
            currency: true,
            priceUnit: true,
            files: true,
            locations: true,
            specifications: {
              include: {
                specification: true,
              },
            },
            user: {
              select: {
                id: true,
                name: true,
                files: {
                  where: { kind: 'AVATAR' },
                  select: { url: true },
                },
              },
            },
          },
        },
      },
    });

    // Загружаем контакты для всех объявлений
    const contactDataMap = await this.getContactsForListings(
      list.map((f) => f.listing).filter(Boolean) as any[],
    );

    const response = list.map((favorite) => {
      const contactData = favorite.listing
        ? contactDataMap.get(favorite.listing.id) || null
        : null;
      const listingDto = favorite.listing
        ? ListingMapper.toResponse(favorite.listing, contactData)
        : null;

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

  /**
   * Получает данные контактов для списка объявлений (batch)
   */
  private async getContactsForListings(
    listings: any[],
  ): Promise<Map<string, { phone: string | null; email: string | null }>> {
    const contactDataMap = new Map<
      string,
      { phone: string | null; email: string | null }
    >();

    await Promise.all(
      listings.map(async (listing) => {
        if (!listing.contactId || !listing.contactType) {
          return;
        }

        try {
          let contactData: {
            phone: string | null;
            email: string | null;
          } | null = null;

          if (listing.contactType === 'WORKER') {
            const worker = await prisma.worker.findUnique({
              where: { id: listing.contactId },
              select: { phone: true, email: true },
            });
            if (worker) {
              contactData = { phone: worker.phone, email: worker.email };
            }
          } else if (listing.contactType === 'USER') {
            const user = await prisma.user.findUnique({
              where: { id: listing.contactId },
              include: { profile: { select: { phone: true } } },
            });
            if (user) {
              contactData = {
                phone: user.profile?.phone || null,
                email: user.email,
              };
            }
          }

          if (contactData) {
            contactDataMap.set(listing.id, contactData);
          }
        } catch (error) {
          this.logger.error(
            `Error fetching contact data for ${listing.contactType} ${listing.contactId}:`,
            error,
          );
        }
      }),
    );

    return contactDataMap;
  }

  async getById(id: string): Promise<FavoriteByIdResponseDto | null> {
    const cacheKey = `favorites/id:${id}`;
    const cachedData =
      await this.cacheService.get<FavoriteByIdResponseDto>(cacheKey);
    if (cachedData) return cachedData;

    const favorite = await prisma.favorite.findFirst({
      where: { id },
      include: {
        listing: true,
      },
    });

    if (favorite) {
      const listingDto = favorite.listing
        ? ListingMapper.toResponse(favorite.listing)
        : null;

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

  async create(
    userId: string,
    body: CreateFavoriteDto,
  ): Promise<CreateFavoriteResponseDto> {
    const cacheKey = `favorites/userId:${userId}`;

    // Получаем объявление для проверки владельца
    const listing = await prisma.listing.findUnique({
      where: { id: body.listingId },
      select: { userId: true },
    });

    if (!listing) {
      throw new BadRequestException('Объявление не найдено');
    }

    // Проверяем, что пользователь не добавляет свое собственное объявление
    if (listing.userId === userId) {
      throw new BadRequestException(
        'Нельзя добавить в избранное собственное объявление',
      );
    }

    // Проверяем, не добавлено ли уже в избранное
    const existingFavorite = await prisma.favorite.findFirst({
      where: {
        userId,
        listingId: body.listingId,
        type: FavoriteType.LISTING,
      },
    });

    if (existingFavorite) {
      throw new BadRequestException('Объявление уже добавлено в избранное');
    }

    const createdFavorite = await prisma.favorite.create({
      data: {
        userId,
        listingId: body.listingId,
        type: FavoriteType.LISTING,
      },
    });

    // Инкрементируем счетчик избранного у объявления
    await prisma.listing.update({
      where: { id: body.listingId },
      data: { favoritesCount: { increment: 1 } },
    });

    await this.cacheService.del(cacheKey);

    return createdFavorite;
  }

  async deleteListing(userId: string, listingId: string) {
    const favorite = await prisma.favorite.findFirst({
      where: {
        userId,
        listingId,
        type: FavoriteType.LISTING,
      },
    });

    if (!favorite) {
      throw new BadRequestException('Объявление не найдено в избранном');
    }

    await this.cacheService.del(`favorites/userId:${userId}`);

    // Декрементируем счетчик избранного у объявления
    await prisma.listing.update({
      where: { id: listingId },
      data: { favoritesCount: { decrement: 1 } },
    });

    return await prisma.favorite.delete({
      where: { id: favorite.id },
    });
  }

  async deleteUser(userId: string, targetUserId: string) {
    const favorite = await prisma.favorite.findFirst({
      where: {
        userId,
        targetUserId,
        type: FavoriteType.USER,
      },
    });

    if (!favorite) {
      throw new BadRequestException('Пользователь не найден в избранном');
    }

    await this.cacheService.del(`favorites/users:${userId}`);

    return await prisma.favorite.delete({
      where: { id: favorite.id },
    });
  }
}
