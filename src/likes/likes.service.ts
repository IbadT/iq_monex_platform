import { AppLogger } from '@/common/logger/logger.service';
import { prisma } from '@/lib/prisma';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { TransactionClient } from 'prisma/generated/internal/prismaNamespace';
import { ToggleLikeResponseDto } from './dto/response/toggle-like-response.dto';
import { GetLikesResponseDto } from './dto/response/get-likes-response.dto';

@Injectable()
export class LikesService {
  constructor(private readonly logger: AppLogger) {}

  async toggleLike(
    listingId: string,
    userId: string,
  ): Promise<ToggleLikeResponseDto> {
    this.logger.log(`User ${userId} toggling like for listing ${listingId}`);

    return await prisma.$transaction(async (tx: TransactionClient) => {
      // Получаем объявление с текущей версией
      const listing = await tx.listing.findUnique({
        where: { id: listingId },
        select: { id: true, version: true },
      });

      if (!listing) {
        throw new NotFoundException(`Объявление с id: ${listingId} не найдено`);
      }

      // Проверяем существование пользователя
      const user = await tx.user.findUnique({
        where: { id: userId },
        select: { id: true },
      });

      if (!user) {
        throw new NotFoundException(`Пользователь с id: ${userId} не найден`);
      }

      // Проверяем существует ли лайк
      const existingLike = await tx.listingLike.findUnique({
        where: {
          listingId_userId: {
            listingId,
            userId,
          },
        },
      });

      if (existingLike) {
        // Убираем лайк
        await tx.listingLike.delete({
          where: {
            listingId_userId: {
              listingId,
              userId,
            },
          },
        });

        try {
          // Обновляем счетчик лайков и версию с оптимистической блокировкой
          await tx.listing.update({
            where: {
              id: listingId,
              version: listing.version, // Оптимистическая блокировка
            },
            data: {
              likesCount: {
                decrement: 1,
              },
              version: {
                increment: 1,
              },
            },
            select: {
              id: true,
              likesCount: true,
              version: true,
            },
          });

          // return {
          //   message: 'Лайк успешно удален',
          //   action: 'unliked',
          //   likesCount: updatedListing.likesCount,
          //   version: updatedListing.version,
          // };
          return {
            id: listingId,
            action: 'UNLIKED',
          };
        } catch (error: any) {
          // Проверяем на конфликт версий
          if (error.code === 'P2025') {
            throw new BadRequestException(
              'Конфликт изменений. Попробуйте еще раз.',
            );
          }
          throw error;
        }
      } else {
        // Добавляем лайк
        await tx.listingLike.create({
          data: {
            listingId,
            userId,
          },
          include: {
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        });

        try {
          // Обновляем счетчик лайков и версию с оптимистической блокировкой
          await tx.listing.update({
            where: {
              id: listingId,
              version: listing.version, // Оптимистическая блокировка
            },
            data: {
              likesCount: {
                increment: 1,
              },
              version: {
                increment: 1,
              },
            },
            select: {
              id: true,
              title: true,
              likesCount: true,
              version: true,
            },
          });

          // return {
          //   message: 'Лайк успешно добавлен',
          //   action: 'liked',
          //   like: {
          //     ...like,
          //     listing: {
          //       id: updatedListing.id,
          //       title: updatedListing.title,
          //       likesCount: updatedListing.likesCount,
          //       version: updatedListing.version,
          //     },
          //   },
          // };
          return {
            id: listingId,
            action: 'LIKED',
          };
        } catch (error: any) {
          // Проверяем на конфликт версий
          if (error.code === 'P2025') {
            throw new BadRequestException(
              'Конфликт изменений. Попробуйте еще раз.',
            );
          }
          throw error;
        }
      }
    });
  }

  async getListingLikes(listingId: string): Promise<GetLikesResponseDto> {
    this.logger.log(`Getting likes for listing ${listingId}`);

    const likes = await prisma.listingLike.findMany({
      where: { listingId },
      select: {
        id: true,
        listingId: true,
        userId: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return {
      likesCount: likes.length,
      likes,
    };
  }
}
