import { Injectable, Logger } from '@nestjs/common';
import {
  PrismaClient,
  FileOwnerType,
  FileKind,
  Prisma,
} from '../../prisma/generated/client';
import { S3Service } from './s3.service';
import { RabbitmqService } from '@/rabbitmq/rabbitmq.service';

@Injectable()
export class FileService {
  private readonly logger = new Logger(FileService.name);

  constructor(
    private readonly s3: S3Service,
    private readonly rabbit: RabbitmqService,
  ) {}

  // ---------- AVATAR ----------

  async processUserAvatar(
    userId: string,
    avatar: string | null | undefined,
    tx: PrismaClient,
  ) {
    if (avatar === undefined) {
      this.logger.debug(`[Avatar] No avatar provided for user ${userId}`);
      return null;
    }

    if (avatar === null) {
      this.logger.log(`[Avatar] Deleting avatar for user ${userId}`);
      // Удаляем аватар из таблицы files
      await tx.file.deleteMany({
        where: {
          ownerType: FileOwnerType.USER,
          userId,
          kind: FileKind.AVATAR,
        },
      });
      // Очищаем avatarUrl в профиле
      await tx.profile.update({
        where: { userId },
        data: { avatarUrl: null },
      });
      return null;
    }

    const existing = await tx.file.findFirst({
      where: {
        ownerType: FileOwnerType.USER,
        userId,
        kind: FileKind.AVATAR,
      },
    });

    const fileName = this.s3.generateFileNameFromBase64(avatar, 0, 'avatar');
    const s3Key = this.s3.generateAvatarKey(userId);
    const contentType = this.s3.getContentTypeFromBase64(avatar);
    const fileSize = this.s3.getFileSizeFromBase64(avatar);
    const s3Bucket = process.env.S3_BUCKET_NAME ?? '';

    this.logger.log(
      `[Avatar] Processing avatar for user ${userId}: size=${fileSize}, contentType=${contentType}, s3Key=${s3Key}`,
    );

    if (existing) {
      this.logger.log(
        `[Avatar] Updating existing avatar record (id=${existing.id})`,
      );
      const updatedAvatar = await tx.file.update({
        where: { id: existing.id },
        data: {
          url: avatar,
          fileType: contentType,
          fileName,
          fileSize,
          s3Key,
          s3Bucket,
          uploadStatus: 'pending',
          isPrimary: true,
          sortOrder: 0,
        },
      });
      // Обновляем avatarUrl в профиле
      await tx.profile.update({
        where: { userId },
        data: { avatarUrl: avatar },
      });
      this.logger.log(
        `[Avatar] Avatar updated successfully: ${JSON.stringify({ id: updatedAvatar.id, url: updatedAvatar.url?.slice(0, 20) })}`,
      );
      return updatedAvatar;
    }

    this.logger.log(`[Avatar] Creating new avatar record for user ${userId}`);
    const createdAvatar = await tx.file.create({
      data: {
        ownerType: FileOwnerType.USER,
        userId,
        url: avatar,
        fileType: contentType,
        fileName,
        fileSize,
        kind: FileKind.AVATAR,
        isPrimary: true,
        sortOrder: 0,
        s3Key,
        s3Bucket,
        uploadStatus: 'pending',
      },
    });
    // Обновляем avatarUrl в профиле
    await tx.profile.update({
      where: { userId },
      data: { avatarUrl: avatar },
    });
    this.logger.log(
      `[Avatar] Avatar created successfully: ${JSON.stringify({ id: createdAvatar.id, url: createdAvatar.url?.slice(0, 20) })}`,
    );
    return createdAvatar;
  }

  // ---------- USER PHOTOS / FILES (ГАЛЕРЕИ) ----------

  async replaceUserFilesArray(
    userId: string,
    base64Array: string[] | undefined,
    kind: FileKind,
    tx: PrismaClient,
  ) {
    this.logger.log(`[${kind}] ===== START replaceUserFilesArray =====`);
    this.logger.log(
      `[${kind}] Starting processing ${kind} for user ${userId}, count=${base64Array?.length || 0}`,
    );

    if (!base64Array || base64Array.length === 0) {
      this.logger.log(
        `[${kind}] Array is empty, deleting all ${kind} for user ${userId}`,
      );
      const deleteResult = await tx.file.deleteMany({
        where: {
          ownerType: FileOwnerType.USER,
          userId,
          kind,
        },
      });
      this.logger.log(
        `[${kind}] Deleted ${deleteResult.count} old ${kind} records`,
      );
      return [];
    }

    // Удаляем старые файлы этого типа перед добавлением новых
    this.logger.log(`[${kind}] Deleting old ${kind} for user ${userId}`);
    const deleteResult = await tx.file.deleteMany({
      where: {
        ownerType: FileOwnerType.USER,
        userId,
        kind,
      },
    });
    this.logger.log(
      `[${kind}] Deleted ${deleteResult.count} old ${kind} records`,
    );

    const created: any[] = [];

    for (let index = 0; index < base64Array.length; index++) {
      const base64 = base64Array[index];

      const fileName = this.s3.generateFileNameFromBase64(
        base64,
        index,
        kind.toLowerCase(),
      );
      const s3Key = this.s3.generateAvatarKey(userId);
      const contentType = this.s3.getContentTypeFromBase64(base64);
      const fileSize = this.s3.getFileSizeFromBase64(base64);
      const s3Bucket = process.env.S3_BUCKET_NAME ?? '';

      this.logger.log(
        `[${kind}] Creating file record ${index + 1}/${base64Array.length}: size=${fileSize}, contentType=${contentType}`,
      );

      const file = await tx.file.create({
        data: {
          ownerType: FileOwnerType.USER,
          userId,
          url: base64,
          fileType: contentType,
          fileName,
          fileSize,
          kind,
          sortOrder: index,
          isPrimary: index === 0,
          s3Key,
          s3Bucket,
          uploadStatus: 'pending',
        },
      });

      this.logger.log(
        `[${kind}] ✓ File record created (id=${file.id}, sortOrder=${index}, ownerType=${file.ownerType})`,
      );
      created.push(file);
    }

    this.logger.log(
      `[${kind}] Successfully created ${created.length} ${kind} records for user ${userId}`,
    );

    // Verify files are still there before returning
    const countAfterCreate = await tx.file.count({
      where: {
        userId,
        kind,
        ownerType: FileOwnerType.USER,
      },
    });
    this.logger.log(
      `[${kind}] ✓ Verification: ${countAfterCreate} ${kind} files in DB after creation`,
    );
    this.logger.log(`[${kind}] ===== END replaceUserFilesArray =====`);

    return created;
  }

  // ---------- ASYNC UPLOAD ----------

  async enqueueFilesUpload(files: any[]) {
    if (!files || files.length === 0) {
      this.logger.debug(`[Queue] No files to enqueue`);
      return;
    }

    this.logger.log(`[Queue] Enqueueing ${files.length} files for upload`);

    for (const file of files) {
      // Определяем правильный owner ID based на ownerType
      const ownerId =
        file.ownerType === FileOwnerType.LISTING
          ? file.listingId
          : file.ownerType === FileOwnerType.COMPLAINT
            ? file.complaintId
            : file.userId;

      this.logger.debug(
        `[Queue] Sending file to RabbitMQ: ownerType=${file.ownerType}, ownerId=${ownerId}, kind=${file.kind}, sortOrder=${file.sortOrder}, s3Key=${file.s3Key}`,
      );

      const message: any = {
        fileType: file.kind.toLowerCase(),
        fileIndex: file.sortOrder,
        fileData: file.url,
        fileName: file.fileName,
        contentType: file.fileType,
        fileSize: file.fileSize,
        s3Key: file.s3Key,
      };

      // Отправляем правильный ID field based на ownerType
      if (file.ownerType === FileOwnerType.LISTING) {
        message.listingId = file.listingId;
      } else if (file.ownerType === FileOwnerType.COMPLAINT) {
        message.complaintId = file.complaintId;
      } else {
        message.userId = file.userId;
      }

      await this.rabbit.sendFileUpload(message);
    }

    this.logger.log(`[Queue] Successfully enqueued ${files.length} files`);
  }

  async enqueueAvatarUploadIfNeeded(file: any | null) {
    if (!file) {
      this.logger.debug(`[Queue] No avatar to enqueue`);
      return;
    }

    this.logger.log(
      `[Queue] Enqueueing avatar for user ${file.userId}: s3Key=${file.s3Key}`,
    );

    await this.rabbit.sendFileUpload({
      userId: file.userId,
      fileType: 'avatar',
      fileIndex: 0,
      fileData: file.url,
      fileName: file.fileName,
      contentType: file.fileType,
      fileSize: file.fileSize,
      s3Key: file.s3Key,
    });

    this.logger.log(`[Queue] Avatar enqueued successfully`);
  }

  // ---------- ВСПОМОГАТЕЛЬНОЕ ----------

  async deleteFileById(fileId: string, tx: PrismaClient) {
    return tx.file.delete({ where: { id: fileId } });
  }

  async reorderUserFiles(
    userId: string,
    kind: FileKind,
    orderedIds: string[],
    tx: PrismaClient,
  ) {
    // Проверяем, что все файлы принадлежат пользователю и нужному типу
    const files = await tx.file.findMany({
      where: {
        ownerType: FileOwnerType.USER,
        userId,
        kind,
        id: { in: orderedIds },
      },
      select: { id: true },
    });

    if (files.length !== orderedIds.length) {
      throw new Error(
        'Некоторые файлы не принадлежат пользователю или имеют другой тип',
      );
    }

    // Обновляем порядок
    for (let index = 0; index < orderedIds.length; index++) {
      await tx.file.update({
        where: { id: orderedIds[index] },
        data: {
          sortOrder: index,
          isPrimary: index === 0,
        },
      });
    }
  }

  async replaceListingFilesArray(
    listingId: string,
    base64Array: string[],
    kind: FileKind,
    tx: Prisma.TransactionClient,
  ) {
    if (!base64Array || base64Array.length === 0) {
      await tx.file.deleteMany({
        where: {
          ownerType: FileOwnerType.LISTING,
          listingId,
          kind,
        },
      });
      return [];
    }

    // Удаляем старые файлы
    // await tx.file.deleteMany({
    //   where: {
    //     ownerType: FileOwnerType.LISTING,
    //     listingId,
    //     kind,
    //   },
    // });

    const created: any[] = [];

    for (let index = 0; index < base64Array.length; index++) {
      const base64 = base64Array[index];

      const fileName = this.s3.generateFileNameFromBase64(
        base64,
        index,
        kind.toLowerCase(),
      );
      const s3Key = this.s3.generateListingFileKey(
        listingId,
        index,
        kind.toLowerCase(),
      );
      const contentType = this.s3.getContentTypeFromBase64(base64);
      const fileSize = this.s3.getFileSizeFromBase64(base64);
      const s3Bucket = process.env.S3_BUCKET_NAME ?? '';

      const file = await tx.file.create({
        data: {
          ownerType: FileOwnerType.LISTING,
          listingId,
          url: base64,
          fileType: contentType,
          fileName,
          fileSize,
          kind,
          sortOrder: index,
          isPrimary: index === 0,
          s3Key,
          s3Bucket,
          uploadStatus: 'pending',
        },
      });

      created.push(file);
    }

    return created;
  }
}
