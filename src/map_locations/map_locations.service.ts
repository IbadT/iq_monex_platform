import { Injectable, BadRequestException } from '@nestjs/common';
import {
  LocationAction,
  CreateMapLocationDto,
} from '@/listings/dto/request/create-map-location.dto';
import { MapLocationProcessData } from './interfaces/map-location.interface';
import { prisma } from '@/lib/prisma';
import { Prisma, PrismaClient } from 'prisma/generated/client';
import { EnterpriceQueryDto } from './dto/request/enterprice-query.dto';
import * as ngeohash from 'ngeohash';

@Injectable()
export class MapLocationsService {
  constructor() {}

  async enterprisesList(query: EnterpriceQueryDto) {
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
    const candidates = await prisma.mapLocation.findMany({
      where: whereConditions,
      include: {
        user: {
          include: {
            profile: true,
            userActivities: {
              include: {
                activity: true,
              },
            },
          },
        },
      },
      take: 1000, // Ограничиваем для производительности
    });

    // 8. Точная фильтрация по расстоянию формулой Haversine
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

    return results;
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
    tx: PrismaClient,
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
    tx: PrismaClient,
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
        geoHash: geoHash,
      },
    });
  }

  private async handleUpdateLocation(
    location: CreateMapLocationDto,
    userId: string,
    tx: PrismaClient,
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
    tx: PrismaClient,
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
