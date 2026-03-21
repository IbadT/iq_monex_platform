import { Test, TestingModule } from '@nestjs/testing';
import { CronTasksService } from './cron_tasks.service';

describe('CronTasksService', () => {
  let service: CronTasksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CronTasksService],
    }).compile();

    service = module.get<CronTasksService>(CronTasksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
