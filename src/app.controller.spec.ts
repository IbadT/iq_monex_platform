import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { S3Service } from './s3/s3.service';
import { JwtTokenService } from '@/auth/jwt/jwt.service';
import { RabbitmqService } from '@/rabbitmq/rabbitmq.service';
import { Reflector } from '@nestjs/core';

interface MulterFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  destination?: string;
  filename: string;
  path?: string;
  buffer: Buffer;
}

describe('AppController', () => {
  let appController: AppController;
  let mockS3Service: any;

  beforeEach(async () => {
    const mockJwtTokenService = {
      verifyToken: jest.fn().mockResolvedValue({
        id: 'user-123',
        email: 'test@example.com',
        name: 'Test User',
      }),
    };

    const mockReflector = {
      getAllAndOverride: jest.fn().mockReturnValue(false),
    };

    mockS3Service = {
      listObjects: jest.fn().mockResolvedValue([]),
      deleteObject: jest.fn().mockResolvedValue(true),
      deleteAllObjects: jest.fn().mockResolvedValue({ success: 5, failed: 0 }),
      upload: jest
        .fn()
        .mockResolvedValue('https://storage.clo.ru/images/test.jpg'),
      customEndpoint: 'https://storage.clo.ru',
    } as any;

    const mockRabbitmqService = {
      sendMessage: jest.fn(),
    };

    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        AppService,
        {
          provide: S3Service,
          useValue: mockS3Service,
        },
        {
          provide: JwtTokenService,
          useValue: mockJwtTokenService,
        },
        {
          provide: Reflector,
          useValue: mockReflector,
        },
        {
          provide: RabbitmqService,
          useValue: mockRabbitmqService,
        },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "Pong"', () => {
      expect(appController.getHello()).toBe('Pong');
    });
  });

  describe('images', () => {
    it('should get images', async () => {
      const result = await appController.getImages();
      expect(result).toEqual([]);
      expect(mockS3Service.listObjects).toHaveBeenCalled();
    });

    it('should upload image', async () => {
      const mockFile: MulterFile = {
        buffer: Buffer.from('test'),
        originalname: 'test.jpg',
        mimetype: 'image/jpeg',
        size: 1024,
        fieldname: 'file',
        encoding: '7bit',
        filename: 'test.jpg',
      };

      const result = await appController.uploadImage(mockFile);
      expect(result).toEqual({
        success: true,
        message: 'Изображение успешно загружено',
        data: {
          key: expect.any(String),
          url: 'https://storage.clo.ru/images/test.jpg',
        },
      });
      expect(mockS3Service.upload).toHaveBeenCalled();
    });

    // it('should fail upload when no file provided', async () => {
    //   const result = await appController.uploadImage(undefined);
    //   expect(result).toEqual({
    //     success: false,
    //     message: 'No file provided'
    //   });
    // });

    it('should get banner by key', async () => {
      // Мокаем listObjects чтобы вернуть баннер
      mockS3Service.listObjects.mockResolvedValueOnce(['banner1.jpg']);

      const result = await appController.getBanner({ url: '/banners/banner1.jpg' });
      expect(result).toEqual({
        success: true,
        message: 'Баннер успешно найден',
        data: {
          key: 'banner1.jpg',
          url: 'https://storage.clo.ru/banner1.jpg',
        },
      });
      expect(mockS3Service.listObjects).toHaveBeenCalled();
    });

    it('should return error when banner not found', async () => {
      // Мокаем listObjects чтобы вернуть пустой массив
      mockS3Service.listObjects.mockResolvedValueOnce([]);

      const result = await appController.getBanner({ url: '/banners/nonexistent.jpg' });
      expect(result).toEqual({
        success: false,
        message: 'Баннер не найден',
      });
      expect(mockS3Service.listObjects).toHaveBeenCalled();
    });

    it('should delete single image', async () => {
      const result = await appController.deleteImage('test-key.jpg');
      expect(result).toEqual({
        success: true,
        message: 'Изображение успешно удалено',
      });
      expect(mockS3Service.deleteObject).toHaveBeenCalledWith('test-key.jpg');
    });

    it('should delete all images', async () => {
      const result = await appController.deleteAllImages();
      expect(result).toEqual({
        success: true,
        message: 'Операция удаления завершена: 5 удалено, 0 не удалось',
        details: { success: 5, failed: 0 },
      });
      expect(mockS3Service.deleteAllObjects).toHaveBeenCalled();
    });
  });
});
