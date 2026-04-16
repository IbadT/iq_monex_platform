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

  /**
   * Проверяет, является ли значение HTTPS URL (уже загруженным файлом)
   * или base64 строкой (новый файл для загрузки)
   */
  private isHttpsUrl(value: string): boolean {
    if (!value || typeof value !== 'string') return false;
    return value.trim().startsWith('https://');
  }

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

    // Пустая строка обрабатывается как null (удаление аватара)
    if (avatar === null || (typeof avatar === 'string' && avatar.trim() === '')) {
      this.logger.log(`[Avatar] Deleting avatar for user ${userId} (null or empty string)`);
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

    // Если передан HTTPS URL - проверяем, совпадает ли он с существующим
    if (this.isHttpsUrl(avatar)) {
      const trimmedUrl = avatar.trim();
      const existing = await tx.file.findFirst({
        where: {
          ownerType: FileOwnerType.USER,
          userId,
          kind: FileKind.AVATAR,
        },
      });

      // Если URL совпадает с существующим - ничего не меняем
      if (existing && existing.url === trimmedUrl) {
        this.logger.log(
          `[Avatar] HTTPS URL matches existing avatar, no changes needed (id=${existing.id})`,
        );
        return existing;
      }

      // Если URL не совпадает - это ошибка или попытка изменить на другой URL
      // В этом случае просто возвращаем существующий без изменений
      // (фронтенд не должен отправлять другой HTTPS URL)
      if (existing) {
        this.logger.warn(
          `[Avatar] Different HTTPS URL provided, keeping existing avatar. Provided: ${trimmedUrl.slice(0, 50)}..., Existing: ${existing.url?.slice(0, 50)}...`,
        );
        return existing;
      }

      // Если аватара нет в БД, но пришел HTTPS URL - это неконсистентное состояние
      // Логируем warning и возвращаем null (не создаем запись с внешним URL)
      this.logger.warn(
        `[Avatar] HTTPS URL provided but no existing avatar in DB: ${trimmedUrl.slice(0, 50)}...`,
      );
      return null;
    }

    // Обработка base64 (новый файл для загрузки)
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
      `[Avatar] Processing base64 avatar for user ${userId}: size=${fileSize}, contentType=${contentType}, s3Key=${s3Key}`,
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
      // Обновляем avatarUrl в профиле (временно base64, потом заменится на S3 URL)
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
    filesArray: string[] | undefined,
    kind: FileKind,
    tx: PrismaClient,
  ) {
    this.logger.log(`[${kind}] ===== START replaceUserFilesArray =====`);
    this.logger.log(
      `[${kind}] Starting processing ${kind} for user ${userId}, count=${filesArray?.length || 0}`,
    );

    if (!filesArray || filesArray.length === 0) {
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

    // Фильтруем пустые строки и разделяем на HTTPS URL (существующие) и base64 (новые)
    const existingUrls: { url: string; originalIndex: number }[] = [];
    const newBase64Files: { data: string; originalIndex: number }[] = [];

    filesArray.forEach((item, index) => {
      // Пропускаем пустые строки
      if (!item || typeof item !== 'string' || item.trim() === '') {
        this.logger.warn(
          `[${kind}] Skipping empty string at index ${index}`,
        );
        return;
      }
      if (this.isHttpsUrl(item)) {
        existingUrls.push({ url: item.trim(), originalIndex: index });
      } else {
        newBase64Files.push({ data: item, originalIndex: index });
      }
    });

    this.logger.log(
      `[${kind}] Split files: ${existingUrls.length} existing HTTPS URLs, ${newBase64Files.length} new base64 files`,
    );

    // Получаем текущие файлы из БД
    const existingDbFiles = await tx.file.findMany({
      where: {
        ownerType: FileOwnerType.USER,
        userId,
        kind,
      },
    });

    // Определяем какие файлы нужно удалить (те, что есть в БД но не в списке existingUrls)
    const urlsToKeep = new Set(existingUrls.map((e) => e.url));
    const filesToDelete = existingDbFiles.filter(
      (file) => !urlsToKeep.has(file.url),
    );

    // Удаляем файлы, которых нет в новом списке
    if (filesToDelete.length > 0) {
      const deleteResult = await tx.file.deleteMany({
        where: {
          id: { in: filesToDelete.map((f) => f.id) },
        },
      });
      this.logger.log(
        `[${kind}] Deleted ${deleteResult.count} old files not present in new array`,
      );
    }

    // Обновляем sortOrder для существующих HTTPS файлов
    const updatedFiles: any[] = [];
    for (const { url, originalIndex } of existingUrls) {
      const existingFile = existingDbFiles.find((f) => f.url === url);
      if (existingFile) {
        const updated = await tx.file.update({
          where: { id: existingFile.id },
          data: {
            sortOrder: originalIndex,
            isPrimary: originalIndex === 0,
          },
        });
        updatedFiles.push(updated);
        this.logger.log(
          `[${kind}] Updated sortOrder for existing file (id=${updated.id}, sortOrder=${originalIndex})`,
        );
      } else {
        this.logger.warn(
          `[${kind}] HTTPS URL not found in DB, skipping: ${url.slice(0, 50)}...`,
        );
      }
    }

    // Создаем новые файлы из base64
    const createdFiles: any[] = [];
    for (const { data: base64, originalIndex } of newBase64Files) {
      const fileName = this.s3.generateFileNameFromBase64(
        base64,
        originalIndex,
        kind.toLowerCase(),
      );
      const s3Key =
        kind === FileKind.AVATAR
          ? this.s3.generateAvatarKey(userId)
          : this.s3.generateUserPhotoKey(userId, originalIndex);
      const contentType = this.s3.getContentTypeFromBase64(base64);
      const fileSize = this.s3.getFileSizeFromBase64(base64);
      const s3Bucket = process.env.S3_BUCKET_NAME ?? '';

      this.logger.log(
        `[${kind}] Creating new file record ${createdFiles.length + 1}/${newBase64Files.length}: size=${fileSize}, contentType=${contentType}`,
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
          sortOrder: originalIndex,
          isPrimary: originalIndex === 0,
          s3Key,
          s3Bucket,
          uploadStatus: 'pending',
        },
      });

      this.logger.log(
        `[${kind}] ✓ New file record created (id=${file.id}, sortOrder=${originalIndex})`,
      );
      createdFiles.push(file);
    }

    // Объединяем результаты в правильном порядке
    const allFiles = [...updatedFiles, ...createdFiles].sort(
      (a, b) => a.sortOrder - b.sortOrder,
    );

    this.logger.log(
      `[${kind}] Successfully processed: ${updatedFiles.length} existing + ${createdFiles.length} new = ${allFiles.length} total files`,
    );

    const countAfterCreate = await tx.file.count({
      where: {
        userId,
        kind,
        ownerType: FileOwnerType.USER,
      },
    });
    this.logger.log(
      `[${kind}] ✓ Verification: ${countAfterCreate} ${kind} files in DB after processing`,
    );
    this.logger.log(`[${kind}] ===== END replaceUserFilesArray =====`);

    return allFiles;
  }

  // ---------- ASYNC UPLOAD ----------

  async enqueueFilesUpload(files: any[]) {
    if (!files || files.length === 0) {
      this.logger.debug(`[Queue] No files to enqueue`);
      return;
    }

    // Фильтруем только файлы с base64 (новые файлы для загрузки)
    // Файлы с HTTPS URL уже загружены и не требуют обработки
    const filesToUpload = files.filter((file) => {
      const isHttps = this.isHttpsUrl(file.url);
      if (isHttps) {
        this.logger.log(
          `[Queue] Skipping already uploaded file (HTTPS URL): ${file.url?.slice(0, 50)}...`,
        );
      }
      return !isHttps;
    });

    if (filesToUpload.length === 0) {
      this.logger.log(`[Queue] No new files to upload (all are HTTPS URLs)`);
      return;
    }

    this.logger.log(
      `[Queue] Enqueueing ${filesToUpload.length} of ${files.length} files for upload (skipped ${files.length - filesToUpload.length} HTTPS URLs)`,
    );

    for (const file of filesToUpload) {
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

    this.logger.log(`[Queue] Successfully enqueued ${filesToUpload.length} files`);
  }

  async enqueueAvatarUploadIfNeeded(file: any | null) {
    if (!file) {
      this.logger.debug(`[Queue] No avatar to enqueue`);
      return;
    }

    // Проверяем, является ли URL HTTPS (уже загруженный файл)
    if (this.isHttpsUrl(file.url)) {
      this.logger.log(
        `[Queue] Skipping avatar upload - already HTTPS URL: ${file.url?.slice(0, 50)}...`,
      );
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
    filesArray: string[],
    kind: FileKind,
    tx: Prisma.TransactionClient,
  ) {
    this.logger.log(
      `[${kind}] ===== START replaceListingFilesArray for listing ${listingId} =====`,
    );
    this.logger.log(
      `[${kind}] Starting processing ${kind} for listing ${listingId}, count=${filesArray?.length || 0}`,
    );

    if (!filesArray || filesArray.length === 0) {
      this.logger.log(
        `[${kind}] Array is empty, deleting all ${kind} for listing ${listingId}`,
      );
      const deleteResult = await tx.file.deleteMany({
        where: {
          ownerType: FileOwnerType.LISTING,
          listingId,
          kind,
        },
      });
      this.logger.log(
        `[${kind}] Deleted ${deleteResult.count} old ${kind} records`,
      );
      return [];
    }

    // Фильтруем пустые строки и разделяем на HTTPS URL (существующие) и base64 (новые)
    const existingUrls: { url: string; originalIndex: number }[] = [];
    const newBase64Files: { data: string; originalIndex: number }[] = [];

    filesArray.forEach((item, index) => {
      // Пропускаем пустые строки
      if (!item || typeof item !== 'string' || item.trim() === '') {
        this.logger.warn(
          `[${kind}] Skipping empty string at index ${index}`,
        );
        return;
      }
      if (this.isHttpsUrl(item)) {
        existingUrls.push({ url: item.trim(), originalIndex: index });
      } else {
        newBase64Files.push({ data: item, originalIndex: index });
      }
    });

    this.logger.log(
      `[${kind}] Split files: ${existingUrls.length} existing HTTPS URLs, ${newBase64Files.length} new base64 files`,
    );

    // Получаем текущие файлы из БД
    const existingDbFiles = await tx.file.findMany({
      where: {
        ownerType: FileOwnerType.LISTING,
        listingId,
        kind,
      },
    });

    // Определяем какие файлы нужно удалить (те, что есть в БД но не в списке existingUrls)
    const urlsToKeep = new Set(existingUrls.map((e) => e.url));
    const filesToDelete = existingDbFiles.filter(
      (file) => !urlsToKeep.has(file.url),
    );

    // Удаляем файлы, которых нет в новом списке
    if (filesToDelete.length > 0) {
      const deleteResult = await tx.file.deleteMany({
        where: {
          id: { in: filesToDelete.map((f) => f.id) },
        },
      });
      this.logger.log(
        `[${kind}] Deleted ${deleteResult.count} old files not present in new array`,
      );
    }

    // Обновляем sortOrder для существующих HTTPS файлов
    const updatedFiles: any[] = [];
    for (const { url, originalIndex } of existingUrls) {
      const existingFile = existingDbFiles.find((f) => f.url === url);
      if (existingFile) {
        const updated = await tx.file.update({
          where: { id: existingFile.id },
          data: {
            sortOrder: originalIndex,
            isPrimary: originalIndex === 0,
          },
        });
        updatedFiles.push(updated);
        this.logger.log(
          `[${kind}] Updated sortOrder for existing file (id=${updated.id}, sortOrder=${originalIndex})`,
        );
      } else {
        this.logger.warn(
          `[${kind}] HTTPS URL not found in DB, skipping: ${url.slice(0, 50)}...`,
        );
      }
    }

    // Создаем новые файлы из base64
    const createdFiles: any[] = [];
    for (const { data: base64, originalIndex } of newBase64Files) {
      const fileName = this.s3.generateFileNameFromBase64(
        base64,
        originalIndex,
        kind.toLowerCase(),
      );
      const s3Key = this.s3.generateListingFileKey(
        listingId,
        originalIndex,
        kind.toLowerCase(),
      );
      const contentType = this.s3.getContentTypeFromBase64(base64);
      const fileSize = this.s3.getFileSizeFromBase64(base64);
      const s3Bucket = process.env.S3_BUCKET_NAME ?? '';

      this.logger.log(
        `[${kind}] Creating new file record ${createdFiles.length + 1}/${newBase64Files.length}: size=${fileSize}, contentType=${contentType}`,
      );

      const file = await tx.file.create({
        data: {
          ownerType: FileOwnerType.LISTING,
          listingId,
          url: base64,
          fileType: contentType,
          fileName,
          fileSize,
          kind,
          sortOrder: originalIndex,
          isPrimary: originalIndex === 0,
          s3Key,
          s3Bucket,
          uploadStatus: 'pending',
        },
      });

      this.logger.log(
        `[${kind}] ✓ New file record created (id=${file.id}, sortOrder=${originalIndex})`,
      );
      createdFiles.push(file);
    }

    // Объединяем результаты в правильном порядке
    const allFiles = [...updatedFiles, ...createdFiles].sort(
      (a, b) => a.sortOrder - b.sortOrder,
    );

    this.logger.log(
      `[${kind}] Successfully processed: ${updatedFiles.length} existing + ${createdFiles.length} new = ${allFiles.length} total files`,
    );
    this.logger.log(
      `[${kind}] ===== END replaceListingFilesArray for listing ${listingId} =====`,
    );

    return allFiles;
  }
}
