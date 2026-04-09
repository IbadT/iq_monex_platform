import { Injectable, BadRequestException } from '@nestjs/common';
import {
  LocationAction,
  CreateMapLocationDto,
} from '@/listings/dto/request/create-map-location.dto';
import { MapLocationProcessData } from './interfaces/map-location.interface';
import { prisma } from '@/lib/prisma';
import { Prisma } from 'prisma/generated/client';
import { EnterpriceQueryDto } from './dto/request/enterprice-query.dto';
import * as ngeohash from 'ngeohash';
import { MapLocationResponseDto } from './dto/response/map-enterprice.response.dto';

@Injectable()
export class MapLocationsService {
  constructor() {}

  /**
   * Создает геолокации для объявления в рамках транзакции
   * @param tx - Транзакция Prisma
   * @param maps - Массив геолокаций
   * @param listingId - ID объявления
   */
  async createMapLocationsForListing(
    tx: Prisma.TransactionClient,
    maps: CreateMapLocationDto[],
    listingId: string,
  ): Promise<void> {
    if (!maps || maps.length === 0) {
      return;
    }

    if (!listingId) {
      throw new BadRequestException(
        'listingId is required for listing map locations',
      );
    }

    const createMaps = maps.filter(
      (map) => !map.action || map.action === LocationAction.CREATE,
    );

    if (createMaps.length === 0) {
      return;
    }

    await tx.mapLocation.createMany({
      data: createMaps.map((map) => ({
        type: map.type,
        latitude: map.latitude,
        longitude: map.longitude,
        address: map.address,
        listingId: listingId,
        country: map.country,
        city: map.city,
        // Добавляем geoHash для быстрого поиска
        geoHash: ngeohash.encode(map.latitude, map.longitude, 7),
      })),
    });
  }

  async enterprisesList(
    query: EnterpriceQueryDto,
  ): Promise<MapLocationResponseDto[]> {
    const { latitude, longitude, radius, filter, activityIds, rating } = query;

    // 1. Валидация входных данных
    // if (!filter?.length) {
    //   throw new BadRequestException(
    //     'Необходимо указать хотя бы один тип локации',
    //   );
    // }

    // 2. Определяем precision геохеша на основе радиуса поиска
    // Чем больше радиус, тем меньше precision (крупнее ячейка)
    const precision = this.getGeohashPrecision(radius);

    // 3. Кодируем центральную точку в геохеш
    const centerHash = ngeohash.encode(latitude, longitude, precision);

    // 4. Получаем соседние ячейки для полного покрытия радиуса
    // 8 соседей + центр = 9 ячеек гарантируют попадание всех точек в радиусе
    const neighborHashes = ngeohash.neighbors(centerHash);
    const searchHashes = [centerHash, ...neighborHashes];

    // 5. Строим условия WHERE для Prisma
    // Используем точное совпадение geoHash для максимальной precision
    const whereConditions: Prisma.MapLocationWhereInput = {
      type: { in: filter },
      userId: { not: null },
      geoHash: { in: searchHashes },
    };

    // 6. Добавляем фильтры по пользователю (активности и рейтинг)
    const userConditions: Prisma.UserWhereInput = {};

    if (activityIds?.length > 0) {
      userConditions.userActivities = {
        some: {
          activityId: {
            in: activityIds,
          },
        },
      };
    }

    if (rating) {
      userConditions.rating = { gt: 4 };
    }

    // Применяем условия пользователя только если они есть
    if (Object.keys(userConditions).length > 0) {
      whereConditions.user = userConditions;
    }

    // 7. Выполняем запрос к БД (быстрый поиск по индексу geoHash)
    // const candidates = await prisma.mapLocation.findMany({
    //   where: whereConditions,
    //   include: {
    //     user: {
    //       include: {
    //         profile: true,
    //         userActivities: {
    //           include: {
    //             activity: true,
    //           },
    //         },
    //       },
    //     },
    //   },
    //   take: 1000, // Ограничиваем для производительности
    // });

    // Шаг 8: Быстрый поиск mapLocations (без user)
    const locations = await prisma.mapLocation.findMany({
      where: whereConditions,
      select: {
        id: true,
        latitude: true,
        longitude: true,
        address: true,
        type: true,
        userId: true,
        country: true,
        city: true,
        // user: {
        //   select: {
        //     id: true,
        //     email: true,
        //     name: true,
        //     accountNumber: true,
        //     isVerified: true,
        //     rating: true,
        //     reviewsCount: true,
        //     roleId: true,
        //     createdAt: true,
        //     updatedAt: true,
        //     profile: true,
        //     userActivities: {
        //       select: {
        //         id: true,
        //         userId: true,
        //         createdAt: true,
        //         updatedAt: true,
        //         activityId: true,
        //         activity: {
        //           select: {
        //             id: true,
        //             name: true,
        //             createdAt: true,
        //             updatedAt: true,
        //           },
        //         },
        //       },
        //     },
        //   },
        // },
      },
      take: 1000,
    });

    // Шаг 9: Получаем users отдельно (один запрос на 1000 записей!)
    const userIds = [
      ...new Set(
        locations
          .map((l) => l.userId)
          .filter((id): id is string => id !== null),
      ),
    ];

    const users = await prisma.user.findMany({
      where: { id: { in: userIds } },
      include: {
        profile: true,
        userActivities: { include: { activity: true } },
      },
    });

    // Шаг 10: Собираем в памяти
    const userMap = new Map(users.map((u) => [u.id, u]));
    const candidates = locations.map((loc) => ({
      ...loc,
      user: loc.userId !== null ? userMap.get(loc.userId) : null,
    }));

    // 11. Точная фильтрация по расстоянию формулой Haversine
    // Геохеш даёт приблизительный отбор, Haversine — точный
    const results = candidates
      .map((location) => ({
        ...location,
        distance: this.calculateDistance(
          latitude,
          longitude,
          Number(location.latitude),
          Number(location.longitude),
        ),
      }))
      .filter((location) => location.distance <= radius * 1000)
      .sort((a, b) => a.distance - b.distance);

    // return results;
    return results.map(
      (i) =>
        new MapLocationResponseDto(
          i.id,
          i.type as 'OFFICE' | 'WAREHOUSE',
          i.address,
          i.latitude,
          i.longitude,
          i.country,
          i.city,
        ),
    );
  }

  /**
   * Определяет precision геохеша на основе радиуса поиска.
   *
   * Precision | Размер ячейки | Оптимально для
   * --------- | ------------- | --------------
   * 3         | ~78 км        | 50-100 км
   * 4         | ~20 км        | 20-50 км
   * 5         | ~2.4 км       | (не используется)
   * 6         | ~610 м        | (не используется)
   * 7         | ~76 м         | (не используется)
   */
  private getGeohashPrecision(radiusKm: number): number {
    if (radiusKm > 50) return 3; // Для 50-100 км (ячейки ~78 км)
    return 4; // Для 20-50 км (ячейки ~20 км)
  }

  /**
   * Вычисляет расстояние между двумя точками по формуле Haversine.
   *
   * @returns Расстояние в метрах
   */
  private calculateDistance(
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number,
  ): number {
    const EARTH_RADIUS_METERS = 6371e3;
    const toRadians = (degrees: number) => (degrees * Math.PI) / 180;

    const deltaLat = toRadians(lat2 - lat1);
    const deltaLng = toRadians(lng2 - lng1);

    const a =
      Math.sin(deltaLat / 2) ** 2 +
      Math.cos(toRadians(lat1)) *
        Math.cos(toRadians(lat2)) *
        Math.sin(deltaLng / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return EARTH_RADIUS_METERS * c;
  }

  async processMapLocations(data: MapLocationProcessData) {
    const { userId, maps, tx } = data;

    if (!maps || maps.length === 0) {
      return;
    }

    for (const mapDto of maps) {
      await this.processLocationAction(mapDto, userId, tx);
    }
  }

  private async processLocationAction(
    location: CreateMapLocationDto,
    userId: string,
    tx: Prisma.TransactionClient,
  ): Promise<any> {
    switch (location.action) {
      case LocationAction.CREATE:
        return await this.handleCreateLocation(location, userId, tx);

      case LocationAction.UPDATE:
        return await this.handleUpdateLocation(location, userId, tx);

      case LocationAction.DELETE:
        return await this.handleDeleteLocation(location, userId, tx);

      case LocationAction.IGNORE:
        return null;

      default:
        throw new BadRequestException(
          `Unknown location action: ${location.action}`,
        );
    }
  }

  private async handleCreateLocation(
    location: CreateMapLocationDto,
    userId: string,
    tx: Prisma.TransactionClient,
  ) {
    const geoHash = MapLocationsService.encode(
      location.latitude,
      location.longitude,
    );

    return await tx.mapLocation.create({
      data: {
        userId: userId,
        type: location.type,
        latitude: location.latitude,
        longitude: location.longitude,
        address: location.address,
        country: location.country,
        city: location.city,
        geoHash: geoHash,
      },
    });
  }

  private async handleUpdateLocation(
    location: CreateMapLocationDto,
    userId: string,
    tx: Prisma.TransactionClient,
  ) {
    if (!location.id) {
      throw new BadRequestException(
        'Map location ID is required for UPDATE action',
      );
    }

    const geoHash = MapLocationsService.encode(
      location.latitude,
      location.longitude,
    );

    return await tx.mapLocation.update({
      where: { id: location.id, userId: userId },
      data: {
        type: location.type,
        latitude: location.latitude,
        longitude: location.longitude,
        address: location.address,
        geoHash: geoHash,
      },
    });
  }

  private async handleDeleteLocation(
    location: CreateMapLocationDto,
    userId: string,
    tx: Prisma.TransactionClient,
  ) {
    if (!location.id) {
      throw new BadRequestException(
        'Map location ID is required for DELETE action',
      );
    }

    return await tx.mapLocation.delete({
      where: { id: location.id, userId: userId },
    });
  }

  async getUserMapLocations(userId: string) {
    // TODO: добавить кэширование
    return await prisma.mapLocation.findMany({
      where: {
        userId: userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  static decode(hash: string): { latitude: number; longitude: number } {
    return ngeohash.decode(hash);
  }

  static encode(lat: number, lng: number, precision = 9): string {
    return ngeohash.encode(lat, lng, precision);
  }
}
