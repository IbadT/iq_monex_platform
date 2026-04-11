import { Injectable, Logger } from '@nestjs/common';
import {
  PutObjectCommand,
  S3Client,
  ListObjectsV2Command,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class S3Service {
  private s3Client!: S3Client;
  private bucketName: string = '';
  public customEndpoint: string = '';
  private readonly logger = new Logger(S3Service.name);

  constructor(private readonly configService: ConfigService) {
    const accessKeyId = this.configService.get<string>('AWS_ACCESS_KEY_ID');
    const secretAccessKey = this.configService.get<string>(
      'AWS_SECRET_ACCESS_KEY',
    );
    const bucketName = this.configService.get<string>('S3_BUCKET_NAME');
    this.customEndpoint =
      this.configService.get<string>('S3_PATH_STYLE') ||
      'https://storage.clo.ru';

    if (!accessKeyId || !secretAccessKey || !bucketName) {
      this.logger.warn(
        'S3 configuration is missing. S3Service will be disabled.',
      );
      return;
    }

    // Используем кастомный S3 провайдер (Selectel)
    this.s3Client = new S3Client({
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
      // Указываем endpoint для Selectel
      endpoint:
        this.customEndpoint?.replace(/\/[^\/]*$/, '') ||
        'https://storage.clo.ru', // Убираем /adverts
      region: 'us-east-1', // Selectel требует указания региона
      forcePathStyle: true, // Для S3-совместимых API
    });

    this.bucketName = bucketName;
    this.logger.log(
      `S3Service initialized with bucket: ${bucketName} using Selectel S3`,
    );
  }

  async upload(
    buffer: Buffer,
    key: string,
    contentType: string,
  ): Promise<string | null> {
    if (!this.s3Client || !this.bucketName) {
      this.logger.warn('S3Service is not configured. Upload skipped.');
      return null;
    }

    try {
      const object = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        Body: buffer,
        ContentType: contentType,
        ACL: 'public-read', // Делаем файлы доступными для чтения
      });

      await this.s3Client.send(object);

      // Используем URL для Selectel
      const url = `${this.customEndpoint}/${key}`;
      this.logger.log(`Successfully uploaded file to S3: ${key}`);

      return url;
    } catch (error) {
      this.logger.error(`Failed to upload file to S3: ${key}`, error);
      return null;
    }
  }

  // Вспомогательные методы для генерации ключей
  generateListingKey(listingId: string, fileName: string): string {
    return `listings/${listingId}/${fileName}`;
  }

  generatePhotoKey(listingId: string, index: number): string {
    return `listings/${listingId}/photos/photo_${index}.jpg`;
  }

  generateComplaintPhotoKey(complaintId: string, index: number): string {
    return `complaints/${complaintId}/photos/photo_${index}.jpg`;
  }

  generateAvatarKey(userId: string): string {
    return `users/${userId}/avatar/avatar.jpg`;
  }

  generateUserPhotoKey(userId: string, index: number): string {
    return `users/${userId}/photos/photo_${index}.jpg`;
  }

  generateUserFileKey(
    userId: string,
    index: number,
    extension: string,
  ): string {
    return `users/${userId}/files/file_${index}.${extension}`;
  }

  generateDocumentKey(listingId: string, index: number): string {
    return `listings/${listingId}/documents/document_${index}.pdf`;
  }

  // Конвертация base64 в Buffer
  base64ToBuffer(base64String: string): Buffer {
    const base64Data = base64String.replace(/^data:.+?;base64,/, '');
    return Buffer.from(base64Data, 'base64');
  }

  // Определение типа файла из base64
  getContentTypeFromBase64(base64String: string): string {
    const matches = base64String.match(/^data:(.+?);base64,/);
    return matches ? matches[1] : 'application/octet-stream';
  }

  // Извлечение расширения файла из base64
  getFileExtensionFromBase64(base64String: string): string {
    const contentType = this.getContentTypeFromBase64(base64String);
    const mimeToExt: Record<string, string> = {
      'image/jpeg': 'jpg',
      'image/jpg': 'jpg',
      'image/png': 'png',
      'image/gif': 'gif',
      'image/webp': 'webp',
      'application/pdf': 'pdf',
      'text/plain': 'txt',
      'application/msword': 'doc',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        'docx',
      'application/vnd.ms-excel': 'xls',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
        'xlsx',
    };

    return mimeToExt[contentType] || 'bin';
  }

  // Генерация имени файла из base64
  generateFileNameFromBase64(
    base64String: string,
    index: number,
    prefix?: string,
  ): string {
    const extension = this.getFileExtensionFromBase64(base64String);
    const timestamp = Date.now();
    return `${prefix || 'file'}_${index}_${timestamp}.${extension}`;
  }

  generateListingFileKey(listingId: string, index: number, type: string) {
    return `listings/${listingId}/${type}-${index}-${Date.now()}`;
  }

  // Получение размера файла из base64
  getFileSizeFromBase64(base64String: string): number {
    const base64Data = base64String.replace(/^data:.+?;base64,/, '');
    return Buffer.byteLength(base64Data, 'base64');
  }

  // Получение списка всех объектов в бакете
  async listObjects(): Promise<string[]> {
    if (!this.s3Client || !this.bucketName) {
      this.logger.warn('S3Service is not configured. List objects skipped.');
      return [];
    }

    try {
      const command = new ListObjectsV2Command({
        Bucket: this.bucketName,
      });

      const response = await this.s3Client.send(command);

      if (response.Contents) {
        const objectKeys = response.Contents.map((obj) => obj.Key || '');
        this.logger.log(`Found ${objectKeys.length} objects in S3 bucket`);
        return objectKeys;
      }

      return [];
    } catch (error) {
      this.logger.error('Failed to list S3 objects', error);
      return [];
    }
  }

  // Удаление объекта из S3
  async deleteObject(key: string): Promise<boolean> {
    if (!this.s3Client || !this.bucketName) {
      this.logger.warn('S3Service is not configured. Delete skipped.');
      return false;
    }

    try {
      const command = new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      await this.s3Client.send(command);
      this.logger.log(`Successfully deleted S3 object: ${key}`);
      return true;
    } catch (error) {
      this.logger.error(`Failed to delete S3 object: ${key}`, error);
      return false;
    }
  }

  // Удаление всех объектов из бакета
  async deleteAllObjects(): Promise<{ success: number; failed: number }> {
    if (!this.s3Client || !this.bucketName) {
      this.logger.warn('S3Service is not configured. Delete all skipped.');
      return { success: 0, failed: 0 };
    }

    try {
      // Сначала получаем список всех объектов
      const listCommand = new ListObjectsV2Command({
        Bucket: this.bucketName,
      });

      const response = await this.s3Client.send(listCommand);

      if (!response.Contents || response.Contents.length === 0) {
        this.logger.log('No objects found to delete');
        return { success: 0, failed: 0 };
      }

      let successCount = 0;
      let failedCount = 0;

      // Удаляем каждый объект по отдельности
      for (const object of response.Contents) {
        if (object.Key) {
          try {
            const deleteCommand = new DeleteObjectCommand({
              Bucket: this.bucketName,
              Key: object.Key,
            });

            await this.s3Client.send(deleteCommand);
            successCount++;
            this.logger.log(`Deleted: ${object.Key}`);
          } catch (error) {
            failedCount++;
            this.logger.error(`Failed to delete: ${object.Key}`, error);
          }
        }
      }

      this.logger.log(
        `Delete all completed: ${successCount} success, ${failedCount} failed`,
      );
      return { success: successCount, failed: failedCount };
    } catch (error) {
      this.logger.error('Failed to delete all S3 objects', error);
      return { success: 0, failed: 1 };
    }
  }
}
