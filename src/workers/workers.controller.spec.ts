import { Test, TestingModule } from '@nestjs/testing';
import { WorkersController } from './workers.controller';
import { WorkersService } from './workers.service';
import { CreateWorkersDto } from './dto/create-workers.dto';
import { CreateWorkerDto } from './dto/create-worker.dto';
import { JwtPayload } from '@/common/interfaces/jwt-payload.interface';
import { JwtTokenService } from '@/auth/jwt/jwt.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

describe('WorkersController', () => {
  let controller: WorkersController;
  let workersService: jest.Mocked<WorkersService>;

  beforeEach(async () => {
    const mockWorkersService = {
      createWorker: jest.fn(),
      changeWorkerActiveStatus: jest.fn(),
      getUserWorkers: jest.fn(),
      getRoles: jest.fn(),
      createRole: jest.fn(),
      updateWorkers: jest.fn(),
    };

    const mockJwtTokenService = {
      issueTokens: jest.fn(),
      verifyToken: jest.fn(),
      decodeToken: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [WorkersController],
      providers: [
        {
          provide: WorkersService,
          useValue: mockWorkersService,
        },
        {
          provide: JwtTokenService,
          useValue: mockJwtTokenService,
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn(),
            verifyAsync: jest.fn(),
            decode: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
            getOrThrow: jest.fn(() => 'test-secret'),
          },
        },
      ],
    }).compile();

    controller = module.get<WorkersController>(WorkersController);
    workersService = module.get<jest.Mocked<WorkersService>>(WorkersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createWorker', () => {
    it('should create workers', async () => {
      const user: JwtPayload = {
        id: 'user-123',
        name: 'Test User',
        email: 'test@example.com',
      };

      const createWorkerDto1 = new CreateWorkerDto(
        'Иванов Иван Иванович',
        'ivanov@example.com',
        '+79991234567',
        'role-123',
      );

      const createWorkerDto2 = new CreateWorkerDto(
        'Петров Петр Петрович',
        'petrov@example.com',
        '+79998765432',
        'role-456',
      );

      const createWorkersDto: CreateWorkersDto = {
        workers: [createWorkerDto1, createWorkerDto2],
      };

      const mockResponse = {
        count: 2,
      };

      workersService.createWorker.mockResolvedValue(mockResponse);

      const result = await controller.createWorker(user, createWorkersDto);

      expect(workersService.createWorker).toHaveBeenCalledWith(
        user.id,
        createWorkersDto.workers,
      );
      expect(result).toEqual(mockResponse);
    });
  });
});
