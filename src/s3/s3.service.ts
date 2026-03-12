import { Injectable, Logger } from '@nestjs/common';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class S3Service {
  private s3Client!: S3Client;
  private bucketName: string = '';
  private readonly logger = new Logger(S3Service.name);

  constructor(private readonly configService: ConfigService) {
    const awsRegion = this.configService.get<string>('AWS_REGION');
    const accessKeyId = this.configService.get<string>('AWS_ACCESS_KEY_ID');
    const secretAccessKey = this.configService.get<string>(
      'AWS_SECRET_ACCESS_KEY',
    );
    const bucketName = this.configService.get<string>('S3_BUCKET_NAME');

    if (!awsRegion || !accessKeyId || !secretAccessKey || !bucketName) {
      this.logger.warn(
        'AWS S3 configuration is missing. S3Service will be disabled.',
      );
      return;
    }

    this.s3Client = new S3Client({
      region: awsRegion,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });
    this.bucketName = bucketName;
    this.logger.log(`S3Service initialized with bucket: ${bucketName}`);
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

      const url = `https://${this.bucketName}.s3.${this.configService.get<string>('AWS_REGION')}.amazonaws.com/${key}`;
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

  // Получение размера файла из base64
  getFileSizeFromBase64(base64String: string): number {
    const base64Data = base64String.replace(/^data:.+?;base64,/, '');
    return Buffer.byteLength(base64Data, 'base64');
  }
}
