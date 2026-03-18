#!/bin/bash

# Shell скрипт для создания бэкапа базы данных
# Использование: ./backup-database.sh

set -e  # Выход при ошибке

BACKUPS_DIR="$(dirname "$0")/../backups"
TIMESTAMP=$(date +"%Y-%m-%dT%H-%M-%S")
BACKUP_FILE="$BACKUPS_DIR/backup-$TIMESTAMP.sql"

echo "🚀 Начало создания бэкапа базы данных..."
echo "📦 Файл бэкапа: $BACKUP_FILE"

# Проверка и создание директории backups
if [ ! -d "$BACKUPS_DIR" ]; then
    echo "📁 Создание директории backups: $BACKUPS_DIR"
    mkdir -p "$BACKUPS_DIR"
    echo "✅ Директория backups создана успешно"
else
    echo "✓ Директория backups существует: $BACKUPS_DIR"
fi

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

# Извлечение параметров для pg_dump
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

# Очистка старых бэкапов (оставляем последние 7)
echo "🧹 Очистка старых бэкапов..."
cd "$BACKUPS_DIR"
BACKUP_COUNT=$(ls backup-*.sql 2>/dev/null | wc -l)

if [ "$BACKUP_COUNT" -ge 7 ]; then
    echo "🗑️ Найдено $BACKUP_COUNT бэкапов, удаляем старые (оставляем последние 7)..."
    # Удаляем самые старые файлы, оставляем 7 самых новых
    ls -t backup-*.sql | tail -n +8 | xargs -r rm
    echo "✅ Очистка завершена"
else
    echo "📦 Текущее количество бэкапов: $BACKUP_COUNT (лимит: 7)"
fi

# Создание бэкапа
echo "📦 Создание бэкапа базы данных..."
PGPASSWORD="$PASSWORD" pg_dump -h "$HOST" -p "$PORT" -U "$USER" -d "$DB_NAME" > "$BACKUP_FILE" || {
    echo "❌ Ошибка при создании бэкапа"
    exit 1
}

# Проверка размера файла
if [ ! -f "$BACKUP_FILE" ]; then
    echo "❌ Файл бэкапа не был создан"
    exit 1
fi

FILE_SIZE=$(du -h "$BACKUP_FILE" | cut -f1)

echo "✅ Бэкап успешно создан!"
echo "📁 Файл: $BACKUP_FILE"
echo "📏 Размер: $FILE_SIZE"
echo "⏰ Время: $(date)"

# Вывод в JSON для API
cat << EOF
{
  "success": true,
  "message": "Бэкап успешно создан",
  "file": "$BACKUP_FILE",
  "size": "$FILE_SIZE",
  "timestamp": "$TIMESTAMP",
  "createdAt": "$(date -Iseconds)"
}
EOF
