import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { prisma } from '@/lib/prisma';
import { CreateNoteDto, UpdateNoteDto, NoteResponseDto } from './dto';
import { NoteTargetType } from './enums';
import { AppLogger } from '@/common/logger/logger.service';

@Injectable()
export class NotesService {
  constructor(private readonly logger: AppLogger) {}

  /**
   * Создать заметку
   * Бросает ошибку если заметка уже существует для данного автора и цели
   */
  async create(authorId: string, dto: CreateNoteDto): Promise<NoteResponseDto> {
    const { targetType, targetId, content } = dto;

    // Валидация существования цели и создание в одной транзакции
    const note = await prisma.$transaction(async (tx) => {
      // Проверяем существование цели
      if (targetType === NoteTargetType.USER) {
        // Проверяем существование профиля по ID (не пользователя)
        const profile = await tx.profile.findUnique({
          where: { id: targetId },
          select: { id: true, userId: true },
        });
        if (!profile) {
          throw new NotFoundException('Профиль не найден');
        }
        // Нельзя создать заметку о себе (сравниваем userId профиля с authorId)
        if (profile.userId === authorId) {
          throw new BadRequestException('Нельзя создать заметку о себе');
        }
      } else {
        const listing = await tx.listing.findUnique({
          where: { id: targetId },
          select: { id: true },
        });
        if (!listing) {
          throw new NotFoundException('Объявление не найдено');
        }
      }

      // Получаем userId для пользователя (если это заметка о пользователе)
      let targetUserId: string | null = null;
      if (targetType === NoteTargetType.USER) {
        const profile = await tx.profile.findUnique({
          where: { id: targetId },
          select: { userId: true },
        });
        if (!profile) {
          throw new NotFoundException('Профиль не найден');
        }
        targetUserId = profile.userId;
      }

      // Проверяем существование заметки
      const existingNote = await tx.userNote.findFirst({
        where: {
          authorId,
          targetType,
          targetUserId:
            targetType === NoteTargetType.USER ? targetUserId : null,
          targetListingId:
            targetType === NoteTargetType.LISTING ? targetId : null,
        },
      });

      if (existingNote) {
        throw new BadRequestException('Заметка для данной цели уже существует');
      }

      // Создаем заметку
      const data = await tx.userNote.create({
        data: {
          authorId,
          targetType,
          targetUserId:
            targetType === NoteTargetType.USER ? targetUserId : null,
          targetListingId:
            targetType === NoteTargetType.LISTING ? targetId : null,
          content,
        },
      });

      return data;
    });

    this.logger.log(`Заметка создана: ${note.id} автор: ${authorId}`);

    return this.mapToResponse(note);
  }

  /**
   * Обновить существующую заметку
   */
  async update(
    authorId: string,
    noteId: string,
    dto: UpdateNoteDto,
  ): Promise<NoteResponseDto> {
    const existingNote = await prisma.userNote.findFirst({
      where: {
        id: noteId,
        authorId,
      },
    });

    if (!existingNote) {
      throw new NotFoundException('Заметка не найдена');
    }

    const updatedNote = await prisma.userNote.update({
      where: { id: noteId },
      data: { content: dto.content },
    });

    this.logger.log(`Заметка обновлена: ${noteId}`);

    return this.mapToResponse(updatedNote);
  }

  /**
   * Удалить заметку
   */
  async delete(authorId: string, noteId: string): Promise<void> {
    const existingNote = await prisma.userNote.findFirst({
      where: {
        id: noteId,
        authorId,
      },
    });

    if (!existingNote) {
      throw new NotFoundException('Заметка не найдена');
    }

    await prisma.userNote.delete({
      where: { id: noteId },
    });

    this.logger.log(`Заметка удалена: ${noteId}`);
  }

  /**
   * Получить заметку по типу и ID цели
   */
  async get(
    authorId: string,
    targetType: NoteTargetType,
    targetId: string,
  ): Promise<NoteResponseDto> {
    // Получаем userId для пользователя (если это заметка о пользователе)
    let targetUserId: string | null = null;
    if (targetType === NoteTargetType.USER) {
      const profile = await prisma.profile.findUnique({
        where: { id: targetId },
        select: { userId: true },
      });
      if (!profile) {
        throw new NotFoundException('Профиль не найден');
      }
      targetUserId = profile.userId;
    }

    const where: any = {
      authorId,
      targetType,
    };

    if (targetType === NoteTargetType.USER) {
      where.targetUserId = targetUserId;
    } else {
      where.targetListingId = targetId;
    }

    const note = await prisma.userNote.findFirst({ where });

    if (!note) {
      throw new NotFoundException('Заметка не найдена');
    }

    return this.mapToResponse(note);
  }

  /**
   * Маппинг Prisma модели в DTO
   */
  private mapToResponse(note: any): NoteResponseDto {
    const targetId =
      note.targetType === NoteTargetType.USER
        ? note.targetUserId
        : note.targetListingId;

    return new NoteResponseDto(
      note.id,
      note.targetType as NoteTargetType,
      targetId,
      note.content,
    );
  }
}
