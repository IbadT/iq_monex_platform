import { Injectable } from '@nestjs/common';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { prisma } from '@/lib/prisma';

@Injectable()
export class FavoriteService {
  async getList(userId: string) {
    return await prisma.favorite.findMany({
      where: {
        userId,
      },
      include: {
        listing: true,
      },
    });
  }

  async getById(id: string) {
    return await prisma.favorite.findFirst({
      where: { id },
      include: {
        listing: true,
      },
    });
  }

  async create(userId: string, body: CreateFavoriteDto) {
    return await prisma.favorite.create({
      data: {
        userId,
        listingId: body.listingId,
      },
    });
  }

  async delete(id: string) {
    return await prisma.favorite.delete({
      where: { id },
    });
  }
}
