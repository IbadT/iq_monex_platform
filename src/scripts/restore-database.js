#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

class DatabaseRestore {
  constructor() {
    this.backupsDir = path.join(process.cwd(), 'backups');
  }

  async findBackupFile(date) {
    try {
      const files = await fs.promises.readdir(this.backupsDir);
      const backupFiles = files.filter(file => file.startsWith('backup-') && file.endsWith('.sql'));
      
      let targetFile = null;
      
      if (date.includes('T')) {
        // Полный формат с временем
        targetFile = backupFiles.find(file => file.includes(date)) || null;
      } else {
        // Только дата - ищем самый свежий за эту дату
        const dateFiles = backupFiles.filter(file => file.startsWith(`backup-${date}`));
        if (dateFiles.length > 0) {
          const filesWithStats = dateFiles.map(file => ({
            name: file,
            path: path.join(this.backupsDir, file),
            time: fs.statSync(path.join(this.backupsDir, file)).mtime
          })).sort((a, b) => b.time.getTime() - a.time.getTime());
          
          targetFile = filesWithStats[0].name;
        }
      }
      
      if (!targetFile) {
        throw new Error(`Бэкап за дату ${date} не найден`);
      }
      
      return path.join(this.backupsDir, targetFile);
    } catch (error) {
      throw new Error(`Ошибка поиска бэкапа: ${error.message}`);
    }
  }

  parseDatabaseUrl(databaseUrl) {
    try {
      if (databaseUrl.startsWith('prisma+')) {
        databaseUrl = databaseUrl.replace('prisma+', '');
      }

      // Для сложных URL с api_key, извлекаем реальный connection string
      if (databaseUrl.includes('?api_key=')) {
        const urlParams = new URLSearchParams(databaseUrl.split('?')[1]);
        const apiKey = urlParams.get('api_key');
        
        if (apiKey) {
          try {
            const keyData = JSON.parse(atob(apiKey));
            return keyData.databaseUrl;
          } catch (decodeError) {
            console.warn('⚠️ Не удалось декодировать api_key, используем оригинальный URL');
          }
        }
      }

      return databaseUrl;
    } catch (error) {
      throw new Error(`Ошибка парсинга DATABASE_URL: ${error.message}`);
    }
  }

  async restore(filePath) {
    try {
      console.log('🔄 Начало восстановления базы данных...');
      
      const databaseUrl = process.env.DATABASE_URL;
      if (!databaseUrl) {
        throw new Error('DATABASE_URL не найден в переменных окружения');
      }

      const connectionString = this.parseDatabaseUrl(databaseUrl);
      console.log(`📥 Восстановление из файла: ${filePath}`);

      // Извлекаем параметры подключения
      const url = new URL(connectionString);
      const dbName = url.pathname.slice(1) || 'postgres';
      const host = url.hostname;
      const port = url.port || '5432';
      const user = url.username || 'postgres';
      const password = url.password || '';

      // Подключаемся к postgres для управления базой
      const adminConnectionString = `postgresql://${user}:${password}@${host}:${port}/postgres`;
      
      console.log(`🧹 Очистка базы данных ${dbName}...`);
      
      // Удаляем и пересоздаем базу данных
      const dropCommand = `PGPASSWORD="${password}" psql "${adminConnectionString}" -c "DROP DATABASE IF EXISTS ${dbName};"`;
      const createCommand = `PGPASSWORD="${password}" psql "${adminConnectionString}" -c "CREATE DATABASE ${dbName};"`;
      
      try {
        await execAsync(dropCommand);
        console.log(`🗑️ База данных ${dbName} удалена`);
      } catch (error) {
        console.warn(`⚠️ Не удалось удалить базу данных: ${error.message}`);
      }
      
      await execAsync(createCommand);
      console.log(`✅ База данных ${dbName} создана`);
      
      // Восстанавливаем данные через psql
      const restoreCommand = `PGPASSWORD="${password}" psql "${connectionString}" < "${filePath}"`;
      
      console.log('📦 Восстановление данных...');
      await execAsync(restoreCommand);
      
      const stats = await fs.promises.stat(filePath);
      const fileSizeMB = (stats.size / (1024 * 1024)).toFixed(2);
      
      console.log(`✅ База данных успешно восстановлена!`);
      console.log(`📁 Файл: ${filePath}`);
      console.log(`📏 Размер: ${fileSizeMB} MB`);
      
      return {
        success: true,
        message: `База данных успешно восстановлена из ${path.basename(filePath)}`,
        restoredFile: path.basename(filePath),
        fileSize: fileSizeMB,
        restoredAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('❌ Ошибка при восстановлении:', error.message);
      throw error;
    }
  }

  async run(date) {
    try {
      const filePath = await this.findBackupFile(date);
      return await this.restore(filePath);
    } catch (error) {
      console.error('💥 Критическая ошибка:', error.message);
      throw error;
    }
  }
}

// Запуск скрипта
if (require.main === module) {
  const date = process.argv[2];
  
  if (!date) {
    console.error('❌ Не указана дата бэкапа');
    console.log('Использование: node restore-database.js <date>');
    console.log('Формат даты: YYYY-MM-DD или YYYY-MM-DDTHH-MM-SS');
    process.exit(1);
  }
  
  const restore = new DatabaseRestore();
  
  restore.run(date)
    .then((result) => {
      console.log('🎉 Восстановление завершено успешно!');
      console.log(JSON.stringify(result, null, 2));
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Критическая ошибка:', error.message);
      process.exit(1);
    });
}

module.exports = DatabaseRestore;
