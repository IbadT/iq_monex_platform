#!/bin/bash

# Shell скрипт для восстановления базы данных из бэкапа
# Использование: ./restore-database.sh 2024-03-18

set -e  # Выход при ошибке

BACKUP_DATE="$1"
BACKUPS_DIR="$(dirname "$0")/../../backups"

if [ -z "$BACKUP_DATE" ]; then
    echo "❌ Не указана дата бэкапа"
    echo "Использование: $0 <date>"
    echo "Формат даты: YYYY-MM-DD или YYYY-MM-DDTHH-MM-SS"
    exit 1
fi

echo "🔄 Поиск бэкапа за дату: $BACKUP_DATE"

# Поиск файла бэкапа
BACKUP_FILE=""
if [[ "$BACKUP_DATE" == *"T"* ]]; then
    # Полный формат с временем
    BACKUP_FILE=$(find "$BACKUPS_DIR" -name "backup-${BACKUP_DATE}.sql" -type f | head -1)
else
    # Только дата - ищем самый свежий за эту дату
    BACKUP_FILE=$(find "$BACKUPS_DIR" -name "backup-${BACKUP_DATE}*.sql" -type f | head -1)
fi

if [ -z "$BACKUP_FILE" ]; then
    echo "❌ Бэкап за дату $BACKUP_DATE не найден"
    exit 1
fi

echo "📁 Найден файл: $BACKUP_FILE"

# Проверка DATABASE_URL
if [ -z "$DATABASE_URL" ]; then
    echo "❌ DATABASE_URL не найден в переменных окружения"
    exit 1
fi

# Извлечение параметров подключения
if [[ "$DATABASE_URL" == *"api_key="* ]]; then
    # Декодируем api_key
    API_KEY=$(echo "$DATABASE_URL" | cut -d'?' -f2 | cut -d'=' -f2)
    DECODED=$(echo "$API_KEY" | base64 -d)
    REAL_URL=$(echo "$DECODED" | jq -r '.databaseUrl')
    CONNECTION_STRING="$REAL_URL"
else
    CONNECTION_STRING="${DATABASE_URL#prisma+}"
fi

echo "🔗 Connection string: $CONNECTION_STRING"

# Извлечение параметров для psql
HOST=$(echo "$CONNECTION_STRING" | sed -n 's/.*@\([^:]*\):.*/\1/p')
PORT=$(echo "$CONNECTION_STRING" | sed -n 's/.*:\([0-9]*\)\/.*/\1/p')
DB_NAME=$(echo "$CONNECTION_STRING" | sed -n 's/.*\/\([^?]*\).*/\1/p')
USER=$(echo "$CONNECTION_STRING" | sed -n 's/.*:\/\/\([^:]*\):.*/\1/p')
PASSWORD=$(echo "$CONNECTION_STRING" | sed -n 's/.*:\([^@]*\)@.*/\1/p')

if [ -z "$HOST" ]; then
    HOST="localhost"
fi
if [ -z "$PORT" ]; then
    PORT="5432"
fi
if [ -z "$DB_NAME" ]; then
    DB_NAME="postgres"
fi
if [ -z "$USER" ]; then
    USER="postgres"
fi

echo "📊 Параметры подключения:"
echo "  Host: $HOST"
echo "  Port: $PORT"
echo "  Database: $DB_NAME"
echo "  User: $USER"

# Очистка и восстановление базы данных
echo "🧹 Очистка базы данных..."

# Отключаем все активные подключения к базе данных
echo "🔌 Отключение активных подключений..."
PGPASSWORD="$PASSWORD" psql -h "$HOST" -p "$PORT" -U "$USER" -d postgres -c "
SELECT pg_terminate_backend(pg_stat_activity.pid)
FROM pg_stat_activity
WHERE pg_stat_activity.datname = '$DB_NAME'
  AND pid <> pg_backend_pid();
" || echo "⚠️ Не удалось отключить подключения"

# Удаляем и пересоздаем базу данных
echo "🗑️ Удаление базы данных $DB_NAME..."
PGPASSWORD="$PASSWORD" psql -h "$HOST" -p "$PORT" -U "$USER" -d postgres -c "DROP DATABASE IF EXISTS $DB_NAME;" || echo "⚠️ База данных не существует"

echo "➕ Создание базы данных $DB_NAME..."
PGPASSWORD="$PASSWORD" psql -h "$HOST" -p "$PORT" -U "$USER" -d postgres -c "CREATE DATABASE $DB_NAME;" || {
    echo "❌ Не удалось создать базу данных"
    exit 1
}

echo "✅ База данных $DB_NAME создана"

# Восстановление данных
echo "📦 Восстановление данных из бэкапа..."
PGPASSWORD="$PASSWORD" psql -h "$HOST" -p "$PORT" -U "$USER" -d "$DB_NAME" < "$BACKUP_FILE" || {
    echo "❌ Ошибка при восстановлении данных"
    exit 1
}

# Получаем размер файла
FILE_SIZE=$(du -h "$BACKUP_FILE" | cut -f1)

echo "✅ База данных успешно восстановлена!"
echo "📁 Файл: $(basename "$BACKUP_FILE")"
echo "📏 Размер: $FILE_SIZE"
echo "⏰ Время: $(date)"

# Вывод в JSON для API
cat << EOF
{
  "success": true,
  "message": "База данных успешно восстановлена из $(basename "$BACKUP_FILE")",
  "restoredFile": "$(basename "$BACKUP_FILE")",
  "fileSize": "$FILE_SIZE",
  "restoredAt": "$(date -Iseconds)"
}
EOF
