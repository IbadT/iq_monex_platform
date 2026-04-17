-- SQL скрипт для создания бэкапа базы данных
-- Использование: pg_dump -d postgres -f backup-database.sql

-- Устанавливаем переменные
\set ON_ERROR_STOP on

-- Выводим информацию о создании бэкапа
\echo '🚀 Начало создания бэкапа базы данных...'

-- Создаем временную таблицу для информации о бэкапе
DROP TABLE IF EXISTS backup_info;
CREATE TEMP TABLE backup_info (
    step TEXT,
    message TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Вставляем начальную информацию
INSERT INTO backup_info (step, message) VALUES ('start', 'Начало создания бэкапа');

-- Получаем имя текущей базы данных
DO $$
DECLARE
    current_db TEXT;
BEGIN
    SELECT current_database() INTO current_db;
    
    INSERT INTO backup_info (step, message) 
    VALUES ('current_db', 'Текущая база данных: ' || current_db);
    
    RAISE NOTICE '📁 Текущая база данных: %', current_db;
END $$;

-- Получаем размер базы данных
DO $$
DECLARE
    db_size TEXT;
BEGIN
    SELECT pg_size_pretty(pg_database_size(current_database())) INTO db_size;
    
    INSERT INTO backup_info (step, message) 
    VALUES ('db_size', 'Размер базы данных: ' || db_size);
    
    RAISE NOTICE '📏 Размер базы данных: %', db_size;
END $$;

-- Получаем количество таблиц
DO $$
DECLARE
    table_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO table_count 
    FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_type = 'BASE TABLE';
    
    INSERT INTO backup_info (step, message) 
    VALUES ('table_count', 'Количество таблиц: ' || table_count);
    
    RAISE NOTICE '📊 Количество таблиц: %', table_count;
END $$;

-- Выводим информацию о завершении
INSERT INTO backup_info (step, message) VALUES ('complete', 'Подготовка к бэкапу завершена');

-- Показываем информацию о бэкапе
\echo '✅ Подготовка к бэкапу завершена!'
SELECT * FROM backup_info ORDER BY timestamp;

-- Очистка
DROP TABLE backup_info;

-- Примечание: сам бэкап создается через pg_dump, этот скрипт только для информации
-- Команда для создания бэкапа:
-- pg_dump -h host -p port -U user -d database > backup-file.sql
