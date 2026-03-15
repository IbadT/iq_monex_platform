import { Controller } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { Logger } from '@nestjs/common';
import { S3Service } from '@/s3/s3.service';
import { FileUploadMessage } from '@/rabbitmq/interfaces/file-upload-message.interface';
import { prisma } from '@/lib/prisma';
import { ConfigService } from '@nestjs/config';

@Controller()
export class FileUploadController {
  private readonly logger = new Logger(FileUploadController.name);

  constructor(
    private readonly s3Service: S3Service,
    private readonly configService: ConfigService
  ) {}

  @EventPattern('file_upload')
  async handleFileUpload(message: FileUploadMessage) {
    const { listingId, fileType, fileIndex, fileData, contentType, s3Key } = message;
    
    this.logger.log(`Processing file upload: ${s3Key} for listing: ${listingId}`);
    this.logger.log(`File data length: ${fileData.length} characters`);
    
    try {
      // Загружаем файл в S3
      const buffer = this.s3Service.base64ToBuffer(fileData);
      this.logger.log(`Buffer created, size: ${buffer.length} bytes`);
      
      const s3Url = await this.s3Service.upload(buffer, s3Key, contentType);
      this.logger.log(`S3 upload result: ${s3Url}`);
      
      if (s3Url) {
        // Обновляем запись в базе данных с URL из S3
        const updatedFile = await prisma.file.updateMany({
          where: {
            listingId,
            sortOrder: fileIndex,
            kind: fileType === 'photo' ? 'PHOTO' : 'DOCUMENT',
          },
          data: {
            url: s3Url,
            s3Key,
            s3Bucket: this.configService.get<string>('S3_BUCKET_NAME') || '',
          },
        });
        
        this.logger.log(`Successfully uploaded and updated ${updatedFile.count} files: ${s3Key}`);
        this.logger.log(`Updated URL: ${s3Url}`);
      } else {
        this.logger.warn(`Failed to upload file to S3: ${s3Key}, keeping base64`);
      }
    } catch (error) {
      this.logger.error(`Error processing file upload: ${s3Key}`, error);
    }
  }
}
