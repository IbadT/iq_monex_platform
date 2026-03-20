import { Controller, Get, Post, Delete, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { CronTasksService } from './cron_tasks.service';
import { ResetBackupDto } from './dto/reset-backup.dto';
import { RestoreBackupDto } from './dto/restore-backup.dto';

@ApiTags('Cron Tasks')
@Controller('cron-tasks')
export class CronTasksController {
  constructor(private readonly cronTasksService: CronTasksService) {}

  @Post('backup/manual')
  @ApiOperation({ summary: 'Ручной запуск бэкапа базы данных' })
  @ApiResponse({ status: 200, description: 'Бэкап успешно создан' })
  @ApiResponse({ status: 500, description: 'Ошибка при создании бэкапа' })
  async manualBackup() {
    return this.cronTasksService.manualBackup();
  }

  @Get('backup/status')
  @ApiOperation({ summary: 'Получить статус бэкапов' })
  @ApiResponse({ status: 200, description: 'Статус бэкапов' })
  async getBackupStatus() {
    return this.cronTasksService.getBackupStatus();
  }

  @Delete('backup/reset')
  @ApiOperation({ summary: 'Удалить бэкап по дате' })
  @ApiResponse({ status: 200, description: 'Бэкап успешно удален' })
  @ApiResponse({ status: 404, description: 'Бэкап не найден' })
  @ApiResponse({ status: 400, description: 'Неверный формат даты' })
  async resetBackup(@Body() resetBackupDto: ResetBackupDto) {
    return this.cronTasksService.resetBackup(resetBackupDto.date);
  }

  @Delete('backup/reset/:date')
  @ApiOperation({ summary: 'Удалить бэкап по дате (через URL параметр)' })
  @ApiParam({
    name: 'date',
    description: 'Дата в формате YYYY-MM-DD или YYYY-MM-DDTHH-MM-SS',
  })
  @ApiResponse({ status: 200, description: 'Бэкап успешно удален' })
  @ApiResponse({ status: 404, description: 'Бэкап не найден' })
  @ApiResponse({ status: 400, description: 'Неверный формат даты' })
  async resetBackupByParam(@Param('date') date: string) {
    return this.cronTasksService.resetBackup(date);
  }

  @Post('backup/restore')
  @ApiOperation({ summary: 'Восстановить базу данных из бэкапа' })
  @ApiResponse({
    status: 200,
    description: 'База данных успешно восстановлена',
  })
  @ApiResponse({ status: 404, description: 'Бэкап не найден' })
  @ApiResponse({ status: 400, description: 'Неверный формат даты' })
  @ApiResponse({
    status: 500,
    description: 'Ошибка при восстановлении базы данных',
  })
  async restoreBackup(@Body() restoreBackupDto: RestoreBackupDto) {
    return this.cronTasksService.restoreBackup(restoreBackupDto.date);
  }

  @Post('backup/restore/:date')
  @ApiOperation({
    summary: 'Восстановить базу данных из бэкапа (через URL параметр)',
  })
  @ApiParam({
    name: 'date',
    description: 'Дата в формате YYYY-MM-DD или YYYY-MM-DDTHH-MM-SS',
  })
  @ApiResponse({
    status: 200,
    description: 'База данных успешно восстановлена',
  })
  @ApiResponse({ status: 404, description: 'Бэкап не найден' })
  @ApiResponse({ status: 400, description: 'Неверный формат даты' })
  @ApiResponse({
    status: 500,
    description: 'Ошибка при восстановлении базы данных',
  })
  async restoreBackupByParam(@Param('date') date: string) {
    return this.cronTasksService.restoreBackup(date);
  }
}
