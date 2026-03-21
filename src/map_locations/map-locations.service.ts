import { Injectable, BadRequestException } from '@nestjs/common';
import { LocationAction, CreateMapLocationDto } from '@/listings/dto/request/create-map-location.dto';
import { MapLocationProcessData } from './interfaces/map-location.interface';
import { prisma } from '@/lib/prisma';
import { PrismaClient } from 'prisma/generated/client';

@Injectable()
export class MapLocationsService {
  constructor() {}

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
    tx: PrismaClient
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
        throw new BadRequestException(`Unknown location action: ${location.action}`);
    }
  }

  private async handleCreateLocation(location: CreateMapLocationDto, userId: string, tx: PrismaClient) {
    return await tx.mapLocation.create({
      data: {
        userId: userId,
        type: location.type,
        latitude: location.latitude,
        longitude: location.longitude,
        address: location.address,
      },
    });
  }

  private async handleUpdateLocation(location: CreateMapLocationDto, userId: string, tx: PrismaClient) {
    if (!location.id) {
      throw new BadRequestException('Map location ID is required for UPDATE action');
    }

    return await tx.mapLocation.update({
      where: { id: location.id, userId: userId },
      data: {
        type: location.type,
        latitude: location.latitude,
        longitude: location.longitude,
        address: location.address,
      },
    });
  }

  private async handleDeleteLocation(location: CreateMapLocationDto, userId: string, tx: PrismaClient) {
    if (!location.id) {
      throw new BadRequestException('Map location ID is required for DELETE action');
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
}
