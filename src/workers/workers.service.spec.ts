import { Test, TestingModule } from '@nestjs/testing';
import { WorkersService } from './workers.service';
import { CreateWorkerDto, WorkerAction } from './dto/create-worker.dto';

describe('WorkersService', () => {
  let service: WorkersService;

  beforeEach(async () => {
    // Mock prisma methods
    const prisma = require('@/lib/prisma').prisma;
    
    prisma.role = {
      findUnique: jest.fn(),
      findMany: jest.fn(),
    };
    
    prisma.worker = {
      create: jest.fn(),
      createMany: jest.fn(),
      update: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
    };

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
        null,
        'Иванов Иван Иванович',
        'ivanov@example.com',
        '+79991234567',
        'role-123',
        WorkerAction.CREATE,
      );

      const createWorkerDto2 = new CreateWorkerDto(
        null,
        'Петров Петр Петрович',
        'petrov@example.com',
        '+79998765432',
        'role-456',
        WorkerAction.CREATE,
      );

      const workers = [createWorkerDto1, createWorkerDto2];

      const mockResponse = [
        { id: 'worker-1', name: 'Иванов Иван Иванович' },
        { id: 'worker-2', name: 'Петров Петр Петрович' },
      ];

      // Mock prisma methods
      const prisma = require('@/lib/prisma').prisma;
      prisma.role.findUnique.mockResolvedValue({ id: 'role-123', name: 'Worker' });
      prisma.worker.create.mockResolvedValueOnce(mockResponse[0]);
      prisma.worker.create.mockResolvedValueOnce(mockResponse[1]);

      const result = await service.createWorker(userId, workers);

      expect(result).toEqual(mockResponse);
    });

    it('should create single worker successfully', async () => {
      const userId = 'user-123';
      const createWorkerDto = new CreateWorkerDto(
        null,
        'Тестовый Работник',
        'worker@example.com',
        '+79991112233',
        'role-789',
        WorkerAction.CREATE,
      );

      const workers = [createWorkerDto];

      const mockResponse = [
        { id: 'worker-1', name: 'Тестовый Работник' },
      ];

      // Mock prisma methods
      const prisma = require('@/lib/prisma').prisma;
      prisma.role.findUnique.mockResolvedValue({ id: 'role-789', name: 'Worker' });
      prisma.worker.create.mockResolvedValue(mockResponse[0]);

      const result = await service.createWorker(userId, workers);

      expect(result).toEqual(mockResponse);
    });

    it('should handle empty workers array', async () => {
      const userId = 'user-123';
      const workers: CreateWorkerDto[] = [];

      const result = await service.createWorker(userId, workers);

      expect(result).toEqual([]);
    });
  });
});
