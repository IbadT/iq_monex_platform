import {
  Injectable,
  Logger,
  OnModuleInit,
  OnModuleDestroy,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as amqp from 'amqplib';
import { S3Service } from '@/s3/s3.service';
import { FileUploadMessage } from './interfaces/file-upload-message.interface';
import { Channel, ChannelModel, ConsumeMessage } from 'amqplib';
import { prisma } from '@/lib/prisma';
import { FileOwnerType } from 'prisma/generated/enums';
import { CacheService } from '@/cache/cacheService.service';
import { SearchService } from '@/search/search.service';

// Mock for prisma generated client
let FileKind: any;
try {
  const prismaClient = require('prisma/generated/client');
  FileKind = prismaClient.FileKind;
} catch (error) {
  // Mock for tests
  FileKind = {
    DOCUMENT: 'DOCUMENT',
    PHOTO: 'PHOTO',
    AVATAR: 'AVATAR',
  };
}

@Injectable()
export class FileUploadConsumerService
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(FileUploadConsumerService.name);
  private connection: ChannelModel | null = null;
  private channel: Channel | null = null;

  constructor(
    private readonly s3Service: S3Service,
    private readonly configService: ConfigService,
    private readonly cacheService: CacheService,
    private readonly searchService: SearchService,
  ) {}

  async onModuleInit() {
    try {
      const rabbitmqUrl =
        this.configService.get('RABBITMQ_URL') ||
        'amqp://admin:admin123@rabbitmq:5672';

      this.connection = await amqp.connect(rabbitmqUrl);
      this.channel = await this.connection.createChannel();

      if (!this.channel) {
        throw new Error('Failed to create RabbitMQ channel');
      }

      // Устанавливаем prefetch
      await this.channel.prefetch(1);

      // Объявляем очередь
      await this.channel.assertQueue('file_upload_queue', { durable: true });

      this.logger.log('File Upload Consumer подключен к RabbitMQ');

      // Начинаем потреблять сообщения
      this.logger.log(
        'Начато потребление сообщений из очереди file_upload_queue',
      );

      await this.channel.consume(
        'file_upload_queue',
        // this.handleMessage.bind(this),
        this.handleMessageV2.bind(this),
      );
    } catch (error) {
      this.logger.error('Ошибка подключения к RabbitMQ:', error);
    }
  }

  async onModuleDestroy() {
    try {
      if (this.channel) {
        await this.channel.close();
      }
      if (this.connection) {
        await this.connection.close();
      }
      this.logger.log('File Upload Consumer отключен от RabbitMQ');
    } catch (error) {
      this.logger.error('Ошибка отключения от RabbitMQ:', error);
    }
  }

  // private async handleMessage(msg: ConsumeMessage | null): Promise<void> {
  //   if (!msg || !this.channel) {
  //     return;
  //   }

  //   try {
  //     const content = msg.content.toString();
  //     const message: FileUploadMessage = JSON.parse(content);

  //     this.logger.log(
  //       `Получено сообщение для загрузки файла: ${message.s3Key}`,
  //     );

  //     // await this.handleFileUpload(message);
  //     await this.handleFileUploadV2(message);

  //     // Подтверждаем обработку сообщения
  //     this.channel.ack(msg);

  //     this.logger.log(`Файл успешно обработан: ${message.s3Key}`);
  //   } catch (error) {
  //     this.logger.error('Ошибка обработки сообщения:', error);

  //     // Обновляем статус на failed в случае ошибки
  //     try {
  //       const message: FileUploadMessage = JSON.parse(msg.content.toString());
  //       const { listingId, userId, complaintId, fileIndex, fileType } = message;
  //       const searchId = complaintId || listingId || userId;
  //       const isComplaint = !!complaintId;
  //       const isUserAvatar = !!userId && !complaintId && !listingId;

  //       const whereCondition: any = {
  //         sortOrder: fileIndex,
  //         kind: fileType === 'photo' ? 'PHOTO' : fileType === 'avatar' ? 'AVATAR' : 'DOCUMENT',
  //       };

  //       if (isComplaint) {
  //         whereCondition.complaintId = searchId;
  //       } else if (isUserAvatar) {
  //         whereCondition.userId = searchId;
  //         whereCondition.kind = 'AVATAR'; // Для аватаров указываем специальный kind
  //       } else if (listingId) {
  //         whereCondition.listingId = listingId; // Используем оригинальный listingId из сообщения
  //       }

  //       await prisma.file.updateMany({
  //         where: whereCondition,
  //         data: {
  //           uploadStatus: 'failed',
  //         },
  //       });
  //     } catch (dbError) {
  //       this.logger.error('Failed to update file status to failed', dbError);
  //     }

  //     // Отклоняем сообщение
  //     this.channel.nack(msg, false, false);
  //   }
  // }

  // private async handleFileUpload(message: FileUploadMessage): Promise<void> {
  //   const { listingId, userId, complaintId, fileType, fileIndex, fileData, contentType, s3Key } =
  //     message;

  //   // Определяем ID и тип для поиска в БД
  //   const searchId = complaintId || listingId || userId;
  //   const isComplaint = !!complaintId;
  //   // Аватар - это когда есть userId, но нет complaintId и listingId
  //   const isUserAvatar = !!userId && !complaintId && !listingId;

  //   this.logger.log(
  //     `Processing file upload: ${s3Key} for ${isComplaint ? 'complaint' : isUserAvatar ? 'user avatar' : 'listing'}: ${searchId}`,
  //   );
  //   this.logger.log(`File data length: ${fileData.length} characters`);

  //   try {
  //     // Загружаем файл в S3
  //     const buffer = this.s3Service.base64ToBuffer(fileData);
  //     this.logger.log(`Buffer created, size: ${buffer.length} bytes`);

  //     const s3Url = await this.s3Service.upload(buffer, s3Key, contentType);
  //     this.logger.log(`S3 upload result: ${s3Url}`);

  //     if (s3Url) {
  //       // Обновляем запись в базе данных с URL из S3
  //       const whereCondition: any = {
  //         sortOrder: fileIndex,
  //         kind: fileType === 'photo' ? 'PHOTO' : fileType === 'avatar' ? 'AVATAR' : 'DOCUMENT',
  //       };

  //       if (isComplaint) {
  //         whereCondition.complaintId = searchId;
  //       } else if (isUserAvatar) {
  //         whereCondition.userId = searchId;
  //         whereCondition.kind = 'AVATAR'; // Для аватаров указываем специальный kind
  //       } else if (listingId) {
  //         whereCondition.listingId = listingId; // Используем оригинальный listingId из сообщения
  //       }

  //       const updatedFile = await prisma.file.updateMany({
  //         where: whereCondition,
  //         data: {
  //           url: s3Url,
  //           s3Key,
  //           s3Bucket: this.configService.get<string>('S3_BUCKET_NAME') || '',
  //           uploadStatus: 'completed', // Обновляем статус на завершенный
  //         },
  //       });

  //       this.logger.log(
  //         `Successfully uploaded and updated ${updatedFile.count} files: ${s3Key}`,
  //       );
  //       this.logger.log(`Updated URL: ${s3Url}`);
  //     } else {
  //       // Если загрузка не удалась, обновляем статус на failed
  //       const whereCondition: any = {
  //         sortOrder: fileIndex,
  //         kind: fileType === 'photo' ? 'PHOTO' : fileType === 'avatar' ? 'AVATAR' : 'DOCUMENT',
  //       };

  //       if (isComplaint) {
  //         whereCondition.complaintId = searchId;
  //       } else if (isUserAvatar) {
  //         whereCondition.userId = searchId;
  //         whereCondition.kind = 'AVATAR'; // Для аватаров указываем специальный kind
  //       } else if (listingId) {
  //         whereCondition.listingId = listingId;
  //       }

  //       await prisma.file.updateMany({
  //         where: whereCondition,
  //         data: {
  //           uploadStatus: 'failed',
  //         },
  //       });

  //       this.logger.warn(
  //         `Failed to upload file to S3: ${s3Key}, keeping base64`,
  //       );
  //     }
  //   } catch (error) {
  //     this.logger.error(`Error processing file upload: ${s3Key}`, error);

  //     // Обновляем статус на failed в случае ошибки
  //     try {
  //       const whereCondition: any = {
  //         sortOrder: fileIndex,
  //         kind: fileType === 'photo' ? FileKind.PHOTO : fileType === 'avatar' ? FileKind.AVATAR : FileKind.DOCUMENT,
  //       };

  //       if (isComplaint) {
  //         whereCondition.complaintId = searchId;
  //       } else if (isUserAvatar) {
  //         whereCondition.userId = searchId;
  //         whereCondition.kind = FileKind.AVATAR; // Для аватаров указываем специальный kind
  //       } else if (listingId) {
  //         whereCondition.listingId = listingId;
  //       }

  //       await prisma.file.updateMany({
  //         where: whereCondition,
  //         data: {
  //           uploadStatus: 'failed',
  //         },
  //       });
  //     } catch (dbError) {
  //       this.logger.error(
  //         `Failed to update file status to failed: ${s3Key}`,
  //         dbError,
  //       );
  //     }

  //     throw error;
  //   }
  // }

  private async handleMessageV2(msg: ConsumeMessage | null): Promise<void> {
    if (!msg || !this.channel) {
      return;
    }

    // message может быть null, если JSON невалидный
    let message: FileUploadMessage | null = null;

    try {
      // 1. Парсим JSON
      message = JSON.parse(msg.content.toString()) as FileUploadMessage;

      this.logger.log(
        `Получено сообщение для загрузки файла: ${message.s3Key}`,
      );

      // 2. Обрабатываем загрузку
      await this.handleFileUploadV2(message);

      // 3. Подтверждаем успешную обработку
      this.channel.ack(msg);

      this.logger.log(`Файл успешно обработан: ${message.s3Key}`);
    } catch (error) {
      this.logger.error('Ошибка обработки сообщения:', error);

      // 4. Если message === null → JSON повреждён → мы не можем обновить статус
      if (message === null) {
        this.logger.error(
          'Сообщение повреждено, невозможно обновить статус файла',
        );
        this.channel.nack(msg, false, false);
        return;
      }

      // 5. Обновляем статус файла на failed
      try {
        const owner = this.resolveOwner({
          listingId: message.listingId,
          userId: message.userId,
          complaintId: message.complaintId,
          workerId: message.workerId,
          suggestionId: message.suggestionId,
        });

        const kind = this.resolveKind(message.fileType);

        await this.updateStatus(owner, kind, message.fileIndex, 'failed');
      } catch (dbError) {
        this.logger.error('Ошибка обновления статуса файла на failed', dbError);
      }

      // 6. Отклоняем сообщение
      this.channel.nack(msg, false, false);
    }
  }

  private async handleFileUploadV2(message: FileUploadMessage): Promise<void> {
    const {
      listingId,
      userId,
      complaintId,
      workerId,
      suggestionId,
      fileType,
      fileIndex,
      fileData,
      contentType,
      s3Key,
    } = message;

    const owner = this.resolveOwner({
      listingId,
      userId,
      complaintId,
      workerId,
      suggestionId,
    });
    const kind = this.resolveKind(fileType);

    this.logger.log(
      `Processing file upload: ${s3Key} for ${owner.ownerType}(id=${owner.id}), fileIndex=${fileIndex}, kind=${kind}`,
    );

    try {
      const buffer = this.s3Service.base64ToBuffer(fileData);
      this.logger.debug(`Buffer created: ${buffer.length} bytes`);

      const s3Url = await this.s3Service.upload(buffer, s3Key, contentType);
      this.logger.log(`S3 upload completed, URL: ${s3Url}`);

      if (!s3Url) {
        await this.updateStatus(owner, kind, fileIndex, 'failed');
        this.logger.warn(`Failed to upload file: ${s3Key}`);
        return;
      }

      await this.updateFileRecord(owner, kind, fileIndex, s3Url, s3Key);
      this.logger.log(`File record updated successfully: ${s3Key}`);

      this.logger.log(`Successfully uploaded: ${s3Key}`);
    } catch (error) {
      this.logger.error(`Error uploading file: ${s3Key}`, error);
      await this.updateStatus(owner, kind, fileIndex, 'failed');
    }
  }

  private resolveOwner(params: {
    listingId?: string | undefined;
    userId?: string | undefined;
    complaintId?: string | undefined;
    workerId?: string | undefined;
    suggestionId?: number | undefined;
  }) {
    const { listingId, userId, complaintId, workerId, suggestionId } = params;

    if (complaintId) {
      return { id: complaintId, ownerType: FileOwnerType.COMPLAINT };
    }

    if (listingId) {
      return { id: listingId, ownerType: FileOwnerType.LISTING };
    }

    if (workerId) {
      return { id: workerId, ownerType: FileOwnerType.WORKER };
    }

    if (suggestionId) {
      return { id: suggestionId, ownerType: FileOwnerType.SUGGESTION };
    }

    return { id: userId!, ownerType: FileOwnerType.USER };
  }

  private resolveKind(fileType: string): typeof FileKind {
    switch (fileType) {
      case 'photo':
        return FileKind.PHOTO;
      case 'avatar':
        return FileKind.AVATAR;
      case 'complaint_photo':
        return FileKind.COMPLAINT_PHOTO;
      default:
        return FileKind.DOCUMENT;
    }
  }

  private buildWhere(owner: any, kind: typeof FileKind, fileIndex: number) {
    const where: any = {
      sortOrder: fileIndex,
      kind,
      ownerType: owner.ownerType,
    };

    // Правильно используем owner.ownerType вместо owner.type
    if (owner.ownerType === FileOwnerType.USER) where.userId = owner.id;
    if (owner.ownerType === FileOwnerType.LISTING) where.listingId = owner.id;
    if (owner.ownerType === FileOwnerType.COMPLAINT)
      where.complaintId = owner.id;
    if (owner.ownerType === FileOwnerType.WORKER) where.workerId = owner.id;
    if (owner.ownerType === FileOwnerType.SUGGESTION)
      where.suggestionId = owner.id;

    return where;
  }

  private async updateFileRecord(
    owner: any,
    kind: typeof FileKind,
    fileIndex: number,
    s3Url: string,
    s3Key: string,
  ) {
    const where = this.buildWhere(owner, kind, fileIndex);

    this.logger.log(
      `Updating file record with WHERE condition: ${JSON.stringify(where)}`,
    );

    // Use transaction to ensure consistency between file and profile updates
    await prisma.$transaction(async (tx) => {
      const result = await tx.file.updateMany({
        where,
        data: {
          url: s3Url,
          s3Key,
          s3Bucket: this.configService.get<string>('S3_BUCKET_NAME') || '',
          uploadStatus: 'completed',
        },
      });

      this.logger.log(
        `File record update result: ${result.count} record(s) updated`,
      );

      if (result.count === 0) {
        this.logger.warn(
          `⚠️ No file records found to update! WHERE: ${JSON.stringify(where)}`,
        );
      }

      // Update profile avatar_url for user avatars in the same transaction
      if (owner.ownerType === FileOwnerType.USER && kind === FileKind.AVATAR) {
        this.logger.log(`Updating profile avatar_url for user ${owner.id}`);
        await tx.profile.update({
          where: { userId: owner.id },
          data: { avatarUrl: s3Url },
        });
        this.logger.log(
          `Profile avatar_url updated successfully for user ${owner.id}`,
        );
      }
    });

    // Cache and search operations outside transaction (they are idempotent)
    if (owner.ownerType === FileOwnerType.USER && kind === FileKind.AVATAR) {
      // Invalidate user cache
      await this.cacheService.invalidateUser(owner.id);
      this.logger.log(`User cache invalidated for user ${owner.id}`);

      // Re-index profile in Elasticsearch
      const updatedProfile = await prisma.profile.findFirst({
        where: { userId: owner.id },
      });
      if (updatedProfile) {
        await this.searchService.indexProfileWithoutTx(updatedProfile);
        this.logger.log(
          `Profile re-indexed in Elasticsearch for user ${owner.id}`,
        );
      }
    }
  }

  private async updateStatus(
    owner: any,
    kind: typeof FileKind,
    fileIndex: number,
    status: 'failed' | 'pending',
  ) {
    const where = this.buildWhere(owner, kind, fileIndex);

    this.logger.log(
      `Updating file status to "${status}" with WHERE: ${JSON.stringify(where)}`,
    );

    const result = await prisma.file.updateMany({
      where,
      data: { uploadStatus: status },
    });

    this.logger.log(
      `File status update result: ${result.count} record(s) updated`,
    );
  }
}
