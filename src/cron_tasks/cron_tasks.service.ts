import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs';
import * as path from 'path';
import { prisma } from '@/lib/prisma';
import { ListingStatus } from '@/listings/enums/listing-status.enum';

const execAsync = promisify(exec);

@Injectable()
export class CronTasksService {
  private readonly logger = new Logger(CronTasksService.name);
  private readonly backupsDir = path.join(process.cwd(), 'backups');

  @Cron(CronExpression.EVERY_DAY_AT_3AM)
  async databaseBackup() {
    this.logger.log(' Начало ежедневного бэкапа базы данных...');

    try {
      // Запускаем shell скрипт бэкапа
      const scriptPath = path.join(process.cwd(), 'src/scripts/backup-database.sh');
      const command = `"${scriptPath}"`;

      this.logger.log(` Выполнение команды: ${command}`);

      const { stdout, stderr } = await execAsync(command);

      this.logger.log(` Скрипт бэкапа выполнен`);
      this.logger.log(` stdout: ${stdout}`);

      if (stderr) {
        this.logger.warn(` stderr: ${stderr}`);
      }

      // Парсим результат из JSON
      let result;
      try {
        // Ищем JSON в выводе
        const jsonMatch = stdout.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          result = JSON.parse(jsonMatch[0]);
        } else {
          result = {
            success: true,
            message: 'Бэкап создан успешно',
            stdout: stdout,
          };
        }
      } catch (parseError) {
        result = {
          success: true,
          message: 'Бэкап создан успешно',
          stdout: stdout,
        };
      }

      return result;
    } catch (error) {
      this.logger.error(' Ошибка при создании бэкапа:', error.message);
      throw error;
    }
  }

  // TODO: перенести в триггер функцию в postgres
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async deleteExpiredListing() {
    const expired = await prisma.listing.findMany({
      where: {
        status: ListingStatus.ARCHIVED,
        autoDeleteAt: {
          lte: new Date(),
        },
      },
    });

    await prisma.listing.deleteMany({
      where: {
        id: {
          in: expired.map((i) => i.id),
        },
      },
    });

    this.logger.log(`Deleted ${expired.length} expired listing(ARCHIVED)`);
  }

  async manualBackup() {
    this.logger.log(' Запуск ручного бэкапа...');
    return this.databaseBackup();
  }

  async getBackupStatus() {
    try {
      const files = await fs.promises.readdir(this.backupsDir);
      const backupFiles = files
        .filter(
          (file: string) => file.startsWith('backup-') && file.endsWith('.sql'),
        )
        .map((file: string) => {
          const filePath = path.join(this.backupsDir, file);
          const stats = fs.statSync(filePath);
          return {
            name: file,
            size: (stats.size / (1024 * 1024)).toFixed(2) + ' MB',
            created: stats.birthtime.toISOString(),
            modified: stats.mtime.toISOString(),
          };
        })
        .sort(
          (a: any, b: any) =>
            new Date(b.created).getTime() - new Date(a.created).getTime(),
        );

      return {
        totalBackups: backupFiles.length,
        backups: backupFiles,
        lastBackup: backupFiles.length > 0 ? backupFiles[0] : null,
      };
    } catch (error) {
      this.logger.error('Ошибка при получении статуса бэкапов:', error.message);
      return {
        totalBackups: 0,
        backups: [],
        lastBackup: null,
        error: error.message,
      };
    }
  }

  async resetBackup(date: string) {
    try {
      this.logger.log(` Попытка удаления бэкапа за дату: ${date}`);

      const files = await fs.promises.readdir(this.backupsDir);
      const backupFiles = files.filter(
        (file: string) => file.startsWith('backup-') && file.endsWith('.sql'),
      );

      // Ищем файл по дате (формат YYYY-MM-DD или YYYY-MM-DDTHH-MM-SS)
      let targetFile: string | null = null;

      if (date.includes('T')) {
        // Полный формат с временем
        targetFile =
          backupFiles.find((file: string) => file.includes(date)) || null;
      } else {
        // Только дата
        targetFile =
          backupFiles.find((file: string) =>
            file.startsWith(`backup-${date}`),
          ) || null;
      }

      if (!targetFile) {
        throw new Error(`Бэкап за дату ${date} не найден`);
      }

      const filePath = path.join(this.backupsDir, targetFile);
      await fs.promises.unlink(filePath);

      this.logger.log(`✅ Бэкап ${targetFile} успешно удален`);

      return {
        success: true,
        message: `Бэкап ${targetFile} успешно удален`,
        deletedFile: targetFile,
      };
    } catch (error) {
      this.logger.error(
        `❌ Ошибка при удалении бэкапа за дату ${date}:`,
        error.message,
      );
      throw error;
    }
  }

  async restoreBackup(date: string) {
    try {
      this.logger.log(`🔄 Запуск восстановления бэкапа за дату: ${date}`);

      // Запускаем shell скрипт восстановления
      const scriptPath = path.join(
        process.cwd(),
        'src/scripts/restore-database.sh',
      );
      const command = `"${scriptPath}" "${date}"`;

      this.logger.log(`🚀 Выполнение команды: ${command}`);

      const { stdout, stderr } = await execAsync(command);

      this.logger.log(`✅ Скрипт восстановления выполнен`);
      this.logger.log(`📤 stdout: ${stdout}`);

      if (stderr) {
        this.logger.warn(`⚠️ stderr: ${stderr}`);
      }

      // Парсим результат из JSON
      let result;
      try {
        // Ищем JSON в выводе
        const jsonMatch = stdout.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          result = JSON.parse(jsonMatch[0]);
        } else {
          result = {
            success: true,
            message: 'Восстановление завершено успешно',
            stdout: stdout,
          };
        }
      } catch (parseError) {
        result = {
          success: true,
          message: 'Восстановление завершено успешно',
          stdout: stdout,
        };
      }

      return result;
    } catch (error) {
      this.logger.error(
        `❌ Ошибка при восстановлении бэкапа за дату ${date}:`,
        error.message,
      );
      throw error;
    }
  }
}
