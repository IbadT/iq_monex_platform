import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule } from '@nestjs/config';
import { CronTasksService } from './cron_tasks.service';
import { CronTasksController } from './cron_tasks.controller';

@Module({
  imports: [ConfigModule, ScheduleModule.forRoot()],
  controllers: [CronTasksController],
  providers: [CronTasksService],
})
export class CronTasksModule {}
