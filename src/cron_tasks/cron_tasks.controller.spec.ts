import { Test, TestingModule } from '@nestjs/testing';
import { CronTasksController } from './cron_tasks.controller';
import { CronTasksService } from './cron_tasks.service';

describe('CronTasksController', () => {
  let controller: CronTasksController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CronTasksController],
      providers: [CronTasksService],
    }).compile();

    controller = module.get<CronTasksController>(CronTasksController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
