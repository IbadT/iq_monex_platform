import { CreateMapLocationDto } from '@/listings/dto/request/create-map-location.dto';
import { PrismaClient } from '../../../prisma/generated/client';

export interface MapLocationProcessData {
  userId: string;
  maps: CreateMapLocationDto[];
  tx: PrismaClient;
}
