import { Test, TestingModule } from '@nestjs/testing';
import { WorkersService } from './workers.service';
import { CreateWorkerDto } from './dto/create-worker.dto';

describe('WorkersService', () => {
  let service: WorkersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WorkersService],
    }).compile();

    service = module.get<WorkersService>(WorkersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createWorker', () => {
    it('should create workers successfully', async () => {
      const userId = 'user-123';
      const createWorkerDto1 = new CreateWorkerDto(
        'Иванов Иван Иванович',
        'ivanov@example.com',
        '+79991234567',
        'role-123'
      );

      const createWorkerDto2 = new CreateWorkerDto(
        'Петров Петр Петрович',
        'petrov@example.com',
        '+79998765432',
        'role-456'
      );

      const workers = [createWorkerDto1, createWorkerDto2];

      const mockBatchPayload = {
        count: 2,
      };

      // Mock prisma methods
      const prisma = require('@/lib/prisma').prisma;
      prisma.worker.createMany = jest.fn().mockResolvedValue(mockBatchPayload);

      const result = await service.createWorker(userId, workers);

      expect(prisma.worker.createMany).toHaveBeenCalledWith({
        data: workers.map(worker => ({
          ...worker,
          userId: userId,
          isAcitve: true,
        })),
      });
      expect(result).toEqual(mockBatchPayload);
    });

    it('should create single worker successfully', async () => {
      const userId = 'user-123';
      const createWorkerDto = new CreateWorkerDto(
        'Тестовый Работник',
        'worker@example.com',
        '+79991112233',
        'role-789'
      );

      const workers = [createWorkerDto];

      const mockBatchPayload = {
        count: 1,
      };

      // Mock prisma methods
      const prisma = require('@/lib/prisma').prisma;
      prisma.worker.createMany = jest.fn().mockResolvedValue(mockBatchPayload);

      const result = await service.createWorker(userId, workers);

      expect(prisma.worker.createMany).toHaveBeenCalledWith({
        data: workers.map(worker => ({
          ...worker,
          userId: userId,
          isAcitve: true,
        })),
      });
      expect(result).toEqual(mockBatchPayload);
    });

    it('should handle empty workers array', async () => {
      const userId = 'user-123';
      const workers: CreateWorkerDto[] = [];

      const mockBatchPayload = {
        count: 0,
      };

      // Mock prisma methods
      const prisma = require('@/lib/prisma').prisma;
      prisma.worker.createMany = jest.fn().mockResolvedValue(mockBatchPayload);

      const result = await service.createWorker(userId, workers);

      expect(prisma.worker.createMany).toHaveBeenCalledWith({
        data: [],
      });
      expect(result).toEqual(mockBatchPayload);
    });
  });
});
