import { Injectable, BadRequestException } from '@nestjs/common';
import { LocationAction } from '@/listings/dto/request/create-map-location.dto';
import { MapLocationProcessData } from './interfaces/map-location.interface';
import { prisma } from '@/lib/prisma';

@Injectable()
export class MapLocationsService {
  constructor() {}

  async processMapLocations(data: MapLocationProcessData) {
    const { userId, maps, tx } = data;
    
    if (!maps || maps.length === 0) {
      return;
    }

    for (const mapDto of maps) {
      switch (mapDto.action) {
        case LocationAction.CREATE:
          // Создаем новую локацию
          await tx.mapLocation.create({
            data: {
              userId: userId, // id из JWT токена залогиненного пользователя
              type: mapDto.type,
              latitude: mapDto.latitude,
              longitude: mapDto.longitude,
              address: mapDto.address,
            },
          });
          break;

        case LocationAction.UPDATE:
          // Обновляем существующую локацию
          if (!mapDto.id) {
            throw new BadRequestException('Map location ID is required for UPDATE action');
          }

          await tx.mapLocation.update({
            where: { id: mapDto.id, userId: userId }, // id из JWT токена
            data: {
              type: mapDto.type,
              latitude: mapDto.latitude,
              longitude: mapDto.longitude,
              address: mapDto.address,
            },
          });
          break;

        case LocationAction.DELETE:
          // Удаляем локацию
          if (!mapDto.id) {
            throw new BadRequestException('Map location ID is required for DELETE action');
          }

          await tx.mapLocation.delete({
            where: { id: mapDto.id, userId: userId }, // id из JWT токена
          });
          break;

        case LocationAction.IGNORE:
          // Пропускаем обработку
          break;

        default:
          throw new BadRequestException(`Unknown location action: ${mapDto.action}`);
      }
    }
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
}
