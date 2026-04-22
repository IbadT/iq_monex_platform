-- ============================================
-- Миграция: Добавление групп активностей
-- Вариант: Гибрид (старые активности в группу "Прочее")
-- ============================================

-- 1. Создаем таблицу групп активностей
CREATE TABLE IF NOT EXISTS "activity_groups" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "activity_groups_pkey" PRIMARY KEY ("id")
);

-- 2. Добавляем поле group_id в таблицу activities (nullable для начала)
ALTER TABLE "activities" ADD COLUMN IF NOT EXISTS "group_id" INTEGER;

-- 3. Создаем группы активностей (29 основных групп + группа "Прочее")
-- ВАЖНО: created_at и updated_at обязательны!
INSERT INTO "activity_groups" ("id", "name", "created_at", "updated_at") VALUES
(1, 'ЮРИДИЧЕСКИЕ И РЕГУЛЯТОРНЫЕ УСЛУГИ', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(2, 'ФИНАНСЫ, ПЛАТЕЖИ И СТРАХОВАНИЕ', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(3, 'ПРОМЫШЛЕННОЕ ПРОИЗВОДСТВО', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(4, 'ЛЁГКАЯ И ПОТРЕБИТЕЛЬСКАЯ ПРОМЫШЛЕННОСТЬ', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(5, 'ПИЩЕВОЕ И АГРОПРОИЗВОДСТВО', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(6, 'СЕЛЬСКОЕ ХОЗЯЙСТВО', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(7, 'СЫРЬЁ И МАТЕРИАЛЫ', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(8, 'СТРОИТЕЛЬСТВО И ИНФРАСТРУКТУРА', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(9, 'НЕДВИЖИМОСТЬ И ДЕВЕЛОПМЕНТ', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(10, 'ЛОГИСТИКА И ЦЕПОЧКИ ПОСТАВОК', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(11, 'ТРАНСПОРТ И СПЕЦТЕХНИКА', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(12, 'ОПТОВАЯ ТОРГОВЛЯ И ДИСТРИБУЦИЯ', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(13, 'ЗАКУПКИ И СНАБЖЕНИЕ', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(14, 'ИНФОРМАЦИОННЫЕ ТЕХНОЛОГИИ', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(15, 'ДАННЫЕ, АВТОМАТИЗАЦИЯ И ИИ', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(16, 'МАРКЕТИНГ И ПРОДАЖИ', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(17, 'ДИЗАЙН И КРЕАТИВ', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(18, 'HR И УПРАВЛЕНИЕ ПЕРСОНАЛОМ', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(19, 'ОБРАЗОВАНИЕ И ОБУЧЕНИЕ', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(20, 'МЕДИЦИНА И ЗДРАВООХРАНЕНИЕ', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(21, 'ОХРАНА И БЕЗОПАСНОСТЬ', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(22, 'HoReCa (ГОСТИНИЦЫ, РЕСТОРАНЫ, КАФЕ) И ОБЩЕПИТ', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(23, 'МЕДИА, ПОЛИГРАФИЯ И ИВЕНТ', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(24, 'СЕРВИСНЫЕ B2B-УСЛУГИ', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(25, 'ЭНЕРГЕТИКА И РЕСУРСЫ', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(26, 'ЭКОЛОГИЯ И ESG (УСТОЙЧИВОЕ РАЗВИТИЕ)', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(27, 'НАУКА, R&D (ИССЛЕДОВАНИЯ И РАЗРАБОТКИ) И ИННОВАЦИИ', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(28, 'КОНСАЛТИНГ И УПРАВЛЕНИЕ БИЗНЕСОМ', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(29, 'ГОСУДАРСТВЕННЫЙ СЕКТОР И НКО', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(99, 'ПРОЧИЕ', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT ("id") DO UPDATE SET 
    "name" = EXCLUDED."name",
    "updated_at" = CURRENT_TIMESTAMP;

-- 4. Создаем новые активности с фиксированными ID (101-2904)
-- ВАЖНО: updated_at обязателен для всех INSERT!
-- Группа 1: ЮРИДИЧЕСКИЕ И РЕГУЛЯТОРНЫЕ УСЛУГИ
INSERT INTO "activities" ("id", "name", "group_id", "updated_at") VALUES
(101, 'Юридическое сопровождение бизнеса', 1, CURRENT_TIMESTAMP),
(102, 'Судебное представительство', 1, CURRENT_TIMESTAMP),
(103, 'Договорная работа', 1, CURRENT_TIMESTAMP),
(104, 'Корпоративное право', 1, CURRENT_TIMESTAMP),
(105, 'Налоговое право', 1, CURRENT_TIMESTAMP),
(106, 'Международное право', 1, CURRENT_TIMESTAMP),
(107, 'Интеллектуальная собственность', 1, CURRENT_TIMESTAMP),
(108, 'Лицензирование и разрешения', 1, CURRENT_TIMESTAMP),
(109, 'Комплаенс и регуляторика', 1, CURRENT_TIMESTAMP),
(110, 'Антимонопольное право', 1, CURRENT_TIMESTAMP),
(111, 'Банкротство и реструктуризация', 1, CURRENT_TIMESTAMP)
ON CONFLICT ("id") DO UPDATE SET 
    "name" = EXCLUDED."name",
    "group_id" = EXCLUDED."group_id",
    "updated_at" = CURRENT_TIMESTAMP;

-- Группа 2: ФИНАНСЫ, ПЛАТЕЖИ И СТРАХОВАНИЕ
INSERT INTO "activities" ("id", "name", "group_id", "updated_at") VALUES
(201, 'Бухгалтерское обслуживание', 2, CURRENT_TIMESTAMP),
(202, 'Налоговое консультирование', 2, CURRENT_TIMESTAMP),
(203, 'Финансовый аудит', 2, CURRENT_TIMESTAMP),
(204, 'Управленческий учёт', 2, CURRENT_TIMESTAMP),
(205, 'Финансовый консалтинг', 2, CURRENT_TIMESTAMP),
(206, 'Инвестиционный консалтинг', 2, CURRENT_TIMESTAMP),
(207, 'Корпоративные финансы', 2, CURRENT_TIMESTAMP),
(208, 'Казначейские услуги', 2, CURRENT_TIMESTAMP),
(209, 'Платёжные решения', 2, CURRENT_TIMESTAMP),
(210, 'Эквайринг', 2, CURRENT_TIMESTAMP),
(211, 'Финтех-платформы', 2, CURRENT_TIMESTAMP),
(212, 'Криптосервисы', 2, CURRENT_TIMESTAMP),
(213, 'Страхование бизнеса', 2, CURRENT_TIMESTAMP),
(214, 'Страхование грузов', 2, CURRENT_TIMESTAMP),
(215, 'Управление рисками', 2, CURRENT_TIMESTAMP),
(216, 'Лизинг', 2, CURRENT_TIMESTAMP),
(217, 'Факторинг', 2, CURRENT_TIMESTAMP)
ON CONFLICT ("id") DO UPDATE SET 
    "name" = EXCLUDED."name",
    "group_id" = EXCLUDED."group_id",
    "updated_at" = CURRENT_TIMESTAMP;

-- Группа 3: ПРОМЫШЛЕННОЕ ПРОИЗВОДСТВО
INSERT INTO "activities" ("id", "name", "group_id", "updated_at") VALUES
(301, 'Машиностроение', 3, CURRENT_TIMESTAMP),
(302, 'Металлообработка', 3, CURRENT_TIMESTAMP),
(303, 'Химическое производство', 3, CURRENT_TIMESTAMP),
(304, 'Электронное производство', 3, CURRENT_TIMESTAMP),
(305, 'Приборостроение', 3, CURRENT_TIMESTAMP),
(306, 'Производство компонентов', 3, CURRENT_TIMESTAMP),
(307, 'Контрактное производство', 3, CURRENT_TIMESTAMP),
(308, 'Деревообработка', 3, CURRENT_TIMESTAMP),
(309, 'Производство стройматериалов', 3, CURRENT_TIMESTAMP),
(310, 'Резинотехническое производство', 3, CURRENT_TIMESTAMP)
ON CONFLICT ("id") DO UPDATE SET 
    "name" = EXCLUDED."name",
    "group_id" = EXCLUDED."group_id",
    "updated_at" = CURRENT_TIMESTAMP;

-- Группа 4: ЛЁГКАЯ И ПОТРЕБИТЕЛЬСКАЯ ПРОМЫШЛЕННОСТЬ
INSERT INTO "activities" ("id", "name", "group_id", "updated_at") VALUES
(401, 'Производство одежды', 4, CURRENT_TIMESTAMP),
(402, 'Производство обуви', 4, CURRENT_TIMESTAMP),
(403, 'Текстильное производство', 4, CURRENT_TIMESTAMP),
(404, 'Производство упаковки', 4, CURRENT_TIMESTAMP),
(405, 'Производство аксессуаров', 4, CURRENT_TIMESTAMP),
(406, 'Частные торговые марки', 4, CURRENT_TIMESTAMP),
(407, 'Производство мебели', 4, CURRENT_TIMESTAMP),
(408, 'Производство игрушек и товаров для детей', 4, CURRENT_TIMESTAMP),
(409, 'Производство бытовой химии', 4, CURRENT_TIMESTAMP)
ON CONFLICT ("id") DO UPDATE SET 
    "name" = EXCLUDED."name",
    "group_id" = EXCLUDED."group_id",
    "updated_at" = CURRENT_TIMESTAMP;

-- Группа 5: ПИЩЕВОЕ И АГРОПРОИЗВОДСТВО
INSERT INTO "activities" ("id", "name", "group_id", "updated_at") VALUES
(501, 'Производство продуктов питания', 5, CURRENT_TIMESTAMP),
(502, 'Производство напитков', 5, CURRENT_TIMESTAMP),
(503, 'Агропереработка', 5, CURRENT_TIMESTAMP),
(504, 'Пищевая упаковка', 5, CURRENT_TIMESTAMP),
(505, 'Контрактное пищевое производство', 5, CURRENT_TIMESTAMP),
(506, 'Производство кормов', 5, CURRENT_TIMESTAMP),
(507, 'Производство алкоголя', 5, CURRENT_TIMESTAMP),
(508, 'Кондитерское производство', 5, CURRENT_TIMESTAMP)
ON CONFLICT ("id") DO UPDATE SET 
    "name" = EXCLUDED."name",
    "group_id" = EXCLUDED."group_id",
    "updated_at" = CURRENT_TIMESTAMP;

-- Группа 6: СЕЛЬСКОЕ ХОЗЯЙСТВО
INSERT INTO "activities" ("id", "name", "group_id", "updated_at") VALUES
(601, 'Растениеводство', 6, CURRENT_TIMESTAMP),
(602, 'Животноводство', 6, CURRENT_TIMESTAMP),
(603, 'Птицеводство', 6, CURRENT_TIMESTAMP),
(604, 'Рыболовство и аквакультура', 6, CURRENT_TIMESTAMP),
(605, 'Агрохолдинги', 6, CURRENT_TIMESTAMP),
(606, 'Тепличные хозяйства', 6, CURRENT_TIMESTAMP),
(607, 'Пчеловодство', 6, CURRENT_TIMESTAMP),
(608, 'Агроснабжение', 6, CURRENT_TIMESTAMP)
ON CONFLICT ("id") DO UPDATE SET 
    "name" = EXCLUDED."name",
    "group_id" = EXCLUDED."group_id",
    "updated_at" = CURRENT_TIMESTAMP;

-- Группа 7: СЫРЬЁ И МАТЕРИАЛЫ
INSERT INTO "activities" ("id", "name", "group_id", "updated_at") VALUES
(701, 'Сырьевые материалы', 7, CURRENT_TIMESTAMP),
(702, 'Металлы и сплавы', 7, CURRENT_TIMESTAMP),
(703, 'Полимеры и пластики', 7, CURRENT_TIMESTAMP),
(704, 'Строительные материалы', 7, CURRENT_TIMESTAMP),
(705, 'Химическое сырьё', 7, CURRENT_TIMESTAMP),
(706, 'Древесина и продукты переработки', 7, CURRENT_TIMESTAMP),
(707, 'Нефтепродукты и топливо', 7, CURRENT_TIMESTAMP),
(708, 'Текстильное сырьё', 7, CURRENT_TIMESTAMP),
(709, 'Вторичное сырьё и переработка', 7, CURRENT_TIMESTAMP)
ON CONFLICT ("id") DO UPDATE SET 
    "name" = EXCLUDED."name",
    "group_id" = EXCLUDED."group_id",
    "updated_at" = CURRENT_TIMESTAMP;

-- Группа 8: СТРОИТЕЛЬСТВО И ИНФРАСТРУКТУРА
INSERT INTO "activities" ("id", "name", "group_id", "updated_at") VALUES
(801, 'Генеральное строительство', 8, CURRENT_TIMESTAMP),
(802, 'Промышленное строительство', 8, CURRENT_TIMESTAMP),
(803, 'Коммерческое строительство', 8, CURRENT_TIMESTAMP),
(804, 'Инженерные системы', 8, CURRENT_TIMESTAMP),
(805, 'Проектирование и архитектура', 8, CURRENT_TIMESTAMP),
(806, 'Технический надзор', 8, CURRENT_TIMESTAMP),
(807, 'Реконструкция и модернизация', 8, CURRENT_TIMESTAMP),
(808, 'Дорожное строительство', 8, CURRENT_TIMESTAMP),
(809, 'Ландшафтное проектирование', 8, CURRENT_TIMESTAMP)
ON CONFLICT ("id") DO UPDATE SET 
    "name" = EXCLUDED."name",
    "group_id" = EXCLUDED."group_id",
    "updated_at" = CURRENT_TIMESTAMP;

-- Группа 9: НЕДВИЖИМОСТЬ И ДЕВЕЛОПМЕНТ
INSERT INTO "activities" ("id", "name", "group_id", "updated_at") VALUES
(901, 'Девелопмент', 9, CURRENT_TIMESTAMP),
(902, 'Управление недвижимостью', 9, CURRENT_TIMESTAMP),
(903, 'Коммерческая аренда', 9, CURRENT_TIMESTAMP),
(904, 'Инвестиционная недвижимость', 9, CURRENT_TIMESTAMP),
(905, 'Оценка недвижимости', 9, CURRENT_TIMESTAMP),
(906, 'Управление и обслуживание объектов', 9, CURRENT_TIMESTAMP),
(907, 'Риэлторские услуги', 9, CURRENT_TIMESTAMP)
ON CONFLICT ("id") DO UPDATE SET 
    "name" = EXCLUDED."name",
    "group_id" = EXCLUDED."group_id",
    "updated_at" = CURRENT_TIMESTAMP;

-- Группа 10: ЛОГИСТИКА И ЦЕПОЧКИ ПОСТАВОК
INSERT INTO "activities" ("id", "name", "group_id", "updated_at") VALUES
(1001, 'Грузоперевозки', 10, CURRENT_TIMESTAMP),
(1002, 'Экспедирование', 10, CURRENT_TIMESTAMP),
(1003, 'Складская логистика', 10, CURRENT_TIMESTAMP),
(1004, '3PL (аутсорсинг склада и доставки)', 10, CURRENT_TIMESTAMP),
(1005, '4PL (полный аутсорсинг логистики)', 10, CURRENT_TIMESTAMP),
(1006, 'Таможенное оформление', 10, CURRENT_TIMESTAMP),
(1007, 'Управление цепочкой поставок', 10, CURRENT_TIMESTAMP),
(1008, 'Фулфилмент', 10, CURRENT_TIMESTAMP),
(1009, 'Курьерские и экспресс-сервисы', 10, CURRENT_TIMESTAMP),
(1010, 'Холодная цепочка', 10, CURRENT_TIMESTAMP)
ON CONFLICT ("id") DO UPDATE SET 
    "name" = EXCLUDED."name",
    "group_id" = EXCLUDED."group_id",
    "updated_at" = CURRENT_TIMESTAMP;

-- Группа 11: ТРАНСПОРТ И СПЕЦТЕХНИКА
INSERT INTO "activities" ("id", "name", "group_id", "updated_at") VALUES
(1101, 'Автомобильные перевозки', 11, CURRENT_TIMESTAMP),
(1102, 'Железнодорожные перевозки', 11, CURRENT_TIMESTAMP),
(1103, 'Морские перевозки', 11, CURRENT_TIMESTAMP),
(1104, 'Авиационные перевозки', 11, CURRENT_TIMESTAMP),
(1105, 'Аренда спецтехники', 11, CURRENT_TIMESTAMP),
(1106, 'Техническое обслуживание транспорта', 11, CURRENT_TIMESTAMP),
(1107, 'Продажа транспорта', 11, CURRENT_TIMESTAMP),
(1108, 'Аренда транспорта', 11, CURRENT_TIMESTAMP)
ON CONFLICT ("id") DO UPDATE SET 
    "name" = EXCLUDED."name",
    "group_id" = EXCLUDED."group_id",
    "updated_at" = CURRENT_TIMESTAMP;

-- Группа 12: ОПТОВАЯ ТОРГОВЛЯ И ДИСТРИБУЦИЯ
INSERT INTO "activities" ("id", "name", "group_id", "updated_at") VALUES
(1201, 'B2B-дистрибуция', 12, CURRENT_TIMESTAMP),
(1202, 'Импорт / экспорт', 12, CURRENT_TIMESTAMP),
(1203, 'Контрактные поставки', 12, CURRENT_TIMESTAMP),
(1204, 'Торговые дома', 12, CURRENT_TIMESTAMP),
(1205, 'Оптовые поставщики', 12, CURRENT_TIMESTAMP),
(1206, 'Параллельный импорт', 12, CURRENT_TIMESTAMP),
(1207, 'Кросс-докинг', 12, CURRENT_TIMESTAMP)
ON CONFLICT ("id") DO UPDATE SET 
    "name" = EXCLUDED."name",
    "group_id" = EXCLUDED."group_id",
    "updated_at" = CURRENT_TIMESTAMP;

-- Группа 13: ЗАКУПКИ И СНАБЖЕНИЕ
INSERT INTO "activities" ("id", "name", "group_id", "updated_at") VALUES
(1301, 'Корпоративные закупки', 13, CURRENT_TIMESTAMP),
(1302, 'Тендерное сопровождение', 13, CURRENT_TIMESTAMP),
(1303, 'Поиск поставщиков', 13, CURRENT_TIMESTAMP),
(1304, 'Управление категориями товаров', 13, CURRENT_TIMESTAMP),
(1305, 'Аутсорсинг снабжения', 13, CURRENT_TIMESTAMP),
(1306, 'Тендерные площадки', 13, CURRENT_TIMESTAMP)
ON CONFLICT ("id") DO UPDATE SET 
    "name" = EXCLUDED."name",
    "group_id" = EXCLUDED."group_id",
    "updated_at" = CURRENT_TIMESTAMP;

-- Группа 14: ИНФОРМАЦИОННЫЕ ТЕХНОЛОГИИ
INSERT INTO "activities" ("id", "name", "group_id", "updated_at") VALUES
(1401, 'Разработка ПО', 14, CURRENT_TIMESTAMP),
(1402, 'Веб-разработка', 14, CURRENT_TIMESTAMP),
(1403, 'Мобильные приложения', 14, CURRENT_TIMESTAMP),
(1404, 'Корпоративные IT-системы', 14, CURRENT_TIMESTAMP),
(1405, 'SaaS (облачное ПО по подписке)', 14, CURRENT_TIMESTAMP),
(1406, 'IT-аутсорсинг', 14, CURRENT_TIMESTAMP),
(1407, 'Облачные сервисы', 14, CURRENT_TIMESTAMP),
(1408, 'Хостинг и дата-центры', 14, CURRENT_TIMESTAMP),
(1409, 'DevOps (объединение разработки)', 14, CURRENT_TIMESTAMP),
(1410, 'Кибербезопасность', 14, CURRENT_TIMESTAMP),
(1411, 'Сетевые решения', 14, CURRENT_TIMESTAMP),
(1412, 'IT-поддержка и сопровождение', 14, CURRENT_TIMESTAMP),
(1413, 'Телекоммуникации и корпоративная связь', 14, CURRENT_TIMESTAMP),
(1414, 'Интернет-провайдеры', 14, CURRENT_TIMESTAMP),
(1415, 'Интеграция систем', 14, CURRENT_TIMESTAMP),
(1416, 'Блокчейн-решения', 14, CURRENT_TIMESTAMP)
ON CONFLICT ("id") DO UPDATE SET 
    "name" = EXCLUDED."name",
    "group_id" = EXCLUDED."group_id",
    "updated_at" = CURRENT_TIMESTAMP;

-- Группа 15: ДАННЫЕ, АВТОМАТИЗАЦИЯ И ИИ
INSERT INTO "activities" ("id", "name", "group_id", "updated_at") VALUES
(1501, 'Аналитика данных', 15, CURRENT_TIMESTAMP),
(1502, 'Большие данные', 15, CURRENT_TIMESTAMP),
(1503, 'Искусственный интеллект', 15, CURRENT_TIMESTAMP),
(1504, 'Машинное обучение', 15, CURRENT_TIMESTAMP),
(1505, 'RPA (роботизированная автоматизация)', 15, CURRENT_TIMESTAMP),
(1506, 'BI-системы (бизнес-аналитика)', 15, CURRENT_TIMESTAMP),
(1507, 'IoT (Интернет вещей)', 15, CURRENT_TIMESTAMP),
(1508, 'Цифровые двойники', 15, CURRENT_TIMESTAMP),
(1509, 'Промышленная автоматизация', 15, CURRENT_TIMESTAMP)
ON CONFLICT ("id") DO UPDATE SET 
    "name" = EXCLUDED."name",
    "group_id" = EXCLUDED."group_id",
    "updated_at" = CURRENT_TIMESTAMP;

-- Группа 16: МАРКЕТИНГ И ПРОДАЖИ
INSERT INTO "activities" ("id", "name", "group_id", "updated_at") VALUES
(1601, 'B2B-маркетинг', 16, CURRENT_TIMESTAMP),
(1602, 'Цифровой маркетинг', 16, CURRENT_TIMESTAMP),
(1603, 'SEO (поисковая оптимизация)', 16, CURRENT_TIMESTAMP),
(1604, 'SMM (продвижение в соцсетях)', 16, CURRENT_TIMESTAMP),
(1605, 'PR (связи с общественностью)', 16, CURRENT_TIMESTAMP),
(1606, 'Лидогенерация', 16, CURRENT_TIMESTAMP),
(1607, 'Работа с маркетплейсами', 16, CURRENT_TIMESTAMP),
(1608, 'Email-маркетинг', 16, CURRENT_TIMESTAMP),
(1609, 'Контент-маркетинг', 16, CURRENT_TIMESTAMP),
(1610, 'Аутсорсинг отдела продаж', 16, CURRENT_TIMESTAMP)
ON CONFLICT ("id") DO UPDATE SET 
    "name" = EXCLUDED."name",
    "group_id" = EXCLUDED."group_id",
    "updated_at" = CURRENT_TIMESTAMP;

-- Группа 17: ДИЗАЙН И КРЕАТИВ
INSERT INTO "activities" ("id", "name", "group_id", "updated_at") VALUES
(1701, 'Брендинг', 17, CURRENT_TIMESTAMP),
(1702, 'Графический дизайн', 17, CURRENT_TIMESTAMP),
(1703, 'UX / UI (проектирование интерфейса)', 17, CURRENT_TIMESTAMP),
(1704, 'Промышленный дизайн', 17, CURRENT_TIMESTAMP),
(1705, 'Motion-дизайн (анимированная графика)', 17, CURRENT_TIMESTAMP),
(1706, 'Дизайн упаковки', 17, CURRENT_TIMESTAMP),
(1707, '3D-визуализация', 17, CURRENT_TIMESTAMP),
(1708, 'Фото- и видеопроизводство', 17, CURRENT_TIMESTAMP),
(1709, 'Копирайтинг (написание текстов)', 17, CURRENT_TIMESTAMP)
ON CONFLICT ("id") DO UPDATE SET 
    "name" = EXCLUDED."name",
    "group_id" = EXCLUDED."group_id",
    "updated_at" = CURRENT_TIMESTAMP;

-- Группа 18: HR И УПРАВЛЕНИЕ ПЕРСОНАЛОМ
INSERT INTO "activities" ("id", "name", "group_id", "updated_at") VALUES
(1801, 'Подбор персонала', 18, CURRENT_TIMESTAMP),
(1802, 'HR-аутсорсинг (передача внешней компании)', 18, CURRENT_TIMESTAMP),
(1803, 'Кадровый консалтинг', 18, CURRENT_TIMESTAMP),
(1804, 'Корпоративное обучение', 18, CURRENT_TIMESTAMP),
(1805, 'HR-Tech (технологии управления персоналом)', 18, CURRENT_TIMESTAMP),
(1806, 'Аутстаффинг (персонал в аренду)', 18, CURRENT_TIMESTAMP),
(1807, 'Оценка и аттестация персонала', 18, CURRENT_TIMESTAMP),
(1808, 'Охрана труда', 18, CURRENT_TIMESTAMP)
ON CONFLICT ("id") DO UPDATE SET 
    "name" = EXCLUDED."name",
    "group_id" = EXCLUDED."group_id",
    "updated_at" = CURRENT_TIMESTAMP;

-- Группа 19: ОБРАЗОВАНИЕ И ОБУЧЕНИЕ
INSERT INTO "activities" ("id", "name", "group_id", "updated_at") VALUES
(1901, 'Корпоративные курсы и тренинги', 19, CURRENT_TIMESTAMP),
(1902, 'Онлайн-обучение', 19, CURRENT_TIMESTAMP),
(1903, 'Профессиональная переподготовка', 19, CURRENT_TIMESTAMP),
(1904, 'EdTech (технологии в образовании)', 19, CURRENT_TIMESTAMP),
(1905, 'MBA (деловое администрирования)', 19, CURRENT_TIMESTAMP),
(1906, 'Языковые курсы', 19, CURRENT_TIMESTAMP),
(1907, 'Сертификация и аккредитация', 19, CURRENT_TIMESTAMP)
ON CONFLICT ("id") DO UPDATE SET 
    "name" = EXCLUDED."name",
    "group_id" = EXCLUDED."group_id",
    "updated_at" = CURRENT_TIMESTAMP;

-- Группа 20: МЕДИЦИНА И ЗДРАВООХРАНЕНИЕ
INSERT INTO "activities" ("id", "name", "group_id", "updated_at") VALUES
(2001, 'Медицинские услуги', 20, CURRENT_TIMESTAMP),
(2002, 'Фармацевтическое производство', 20, CURRENT_TIMESTAMP),
(2003, 'Медицинское оборудование', 20, CURRENT_TIMESTAMP),
(2004, 'Лабораторная диагностика', 20, CURRENT_TIMESTAMP),
(2005, 'Корпоративная медицина и ДМС', 20, CURRENT_TIMESTAMP),
(2006, 'Телемедицина (онлайн-консультации врачей)', 20, CURRENT_TIMESTAMP),
(2007, 'Санитария и дезинфекция', 20, CURRENT_TIMESTAMP)
ON CONFLICT ("id") DO UPDATE SET 
    "name" = EXCLUDED."name",
    "group_id" = EXCLUDED."group_id",
    "updated_at" = CURRENT_TIMESTAMP;

-- Группа 21: ОХРАНА И БЕЗОПАСНОСТЬ
INSERT INTO "activities" ("id", "name", "group_id", "updated_at") VALUES
(2101, 'Охрана объектов (ЧОП)', 21, CURRENT_TIMESTAMP),
(2102, 'Видеонаблюдение и СКУД', 21, CURRENT_TIMESTAMP),
(2103, 'Пожарная безопасность', 21, CURRENT_TIMESTAMP),
(2104, 'Инкассация', 21, CURRENT_TIMESTAMP),
(2105, 'Тревожные кнопки и мониторинг', 21, CURRENT_TIMESTAMP),
(2106, 'Консалтинг по безопасности', 21, CURRENT_TIMESTAMP)
ON CONFLICT ("id") DO UPDATE SET 
    "name" = EXCLUDED."name",
    "group_id" = EXCLUDED."group_id",
    "updated_at" = CURRENT_TIMESTAMP;

-- Группа 22: HoReCa (ГОСТИНИЦЫ, РЕСТОРАНЫ, КАФЕ) И ОБЩЕПИТ
INSERT INTO "activities" ("id", "name", "group_id", "updated_at") VALUES
(2201, 'Поставки для ресторанов и кафе', 22, CURRENT_TIMESTAMP),
(2202, 'Кейтеринг (выездное питание)', 22, CURRENT_TIMESTAMP),
(2203, 'Гостиничный бизнес', 22, CURRENT_TIMESTAMP),
(2204, 'Оборудование для общепита', 22, CURRENT_TIMESTAMP),
(2205, 'Корпоративное питание', 22, CURRENT_TIMESTAMP),
(2206, 'Вендинг (торговые автоматы)', 22, CURRENT_TIMESTAMP)
ON CONFLICT ("id") DO UPDATE SET 
    "name" = EXCLUDED."name",
    "group_id" = EXCLUDED."group_id",
    "updated_at" = CURRENT_TIMESTAMP;

-- Группа 23: МЕДИА, ПОЛИГРАФИЯ И ИВЕНТ
INSERT INTO "activities" ("id", "name", "group_id", "updated_at") VALUES
(2301, 'Полиграфия (печатная продукция)', 23, CURRENT_TIMESTAMP),
(2302, 'Издательское дело', 23, CURRENT_TIMESTAMP),
(2303, 'СМИ и медиапроизводство', 23, CURRENT_TIMESTAMP),
(2304, 'Организация мероприятий', 23, CURRENT_TIMESTAMP),
(2305, 'Выставки и конференции', 23, CURRENT_TIMESTAMP),
(2306, 'Наружная реклама', 23, CURRENT_TIMESTAMP),
(2307, 'Сувенирная и промо-продукция', 23, CURRENT_TIMESTAMP)
ON CONFLICT ("id") DO UPDATE SET 
    "name" = EXCLUDED."name",
    "group_id" = EXCLUDED."group_id",
    "updated_at" = CURRENT_TIMESTAMP;

-- Группа 24: СЕРВИСНЫЕ B2B-УСЛУГИ
INSERT INTO "activities" ("id", "name", "group_id", "updated_at") VALUES
(2401, 'Клининговые услуги', 24, CURRENT_TIMESTAMP),
(2402, 'Техническое обслуживание оборудования', 24, CURRENT_TIMESTAMP),
(2403, 'Обслуживание зданий и территорий', 24, CURRENT_TIMESTAMP),
(2404, 'BPO (Аутсорсинг бизнес-процессов)', 24, CURRENT_TIMESTAMP),
(2405, 'Переводческие услуги', 24, CURRENT_TIMESTAMP),
(2406, 'Нотариальные и апостильные услуги', 24, CURRENT_TIMESTAMP),
(2407, 'Клиентский сервис и колл-центры', 24, CURRENT_TIMESTAMP)
ON CONFLICT ("id") DO UPDATE SET 
    "name" = EXCLUDED."name",
    "group_id" = EXCLUDED."group_id",
    "updated_at" = CURRENT_TIMESTAMP;

-- Группа 25: ЭНЕРГЕТИКА И РЕСУРСЫ
INSERT INTO "activities" ("id", "name", "group_id", "updated_at") VALUES
(2501, 'Энергоснабжение', 25, CURRENT_TIMESTAMP),
(2502, 'Возобновляемая энергетика', 25, CURRENT_TIMESTAMP),
(2503, 'Энергоаудит (оценка)', 25, CURRENT_TIMESTAMP),
(2504, 'Инженерные энергосистемы', 25, CURRENT_TIMESTAMP),
(2505, 'Нефтегазовая отрасль', 25, CURRENT_TIMESTAMP),
(2506, 'Торговля электроэнергией', 25, CURRENT_TIMESTAMP),
(2507, 'Резервное электроснабжение', 25, CURRENT_TIMESTAMP)
ON CONFLICT ("id") DO UPDATE SET 
    "name" = EXCLUDED."name",
    "group_id" = EXCLUDED."group_id",
    "updated_at" = CURRENT_TIMESTAMP;

-- Группа 26: ЭКОЛОГИЯ И ESG (УСТОЙЧИВОЕ РАЗВИТИЕ)
INSERT INTO "activities" ("id", "name", "group_id", "updated_at") VALUES
(2601, 'Утилизация отходов', 26, CURRENT_TIMESTAMP),
(2602, 'Переработка', 26, CURRENT_TIMESTAMP),
(2603, 'Экологический консалтинг', 26, CURRENT_TIMESTAMP),
(2604, 'ESG-отчётность (экология)', 26, CURRENT_TIMESTAMP),
(2605, 'Углеродный учёт', 26, CURRENT_TIMESTAMP),
(2606, 'Рекультивация территорий', 26, CURRENT_TIMESTAMP),
(2607, 'Водоочистка и водоподготовка', 26, CURRENT_TIMESTAMP)
ON CONFLICT ("id") DO UPDATE SET 
    "name" = EXCLUDED."name",
    "group_id" = EXCLUDED."group_id",
    "updated_at" = CURRENT_TIMESTAMP;

-- Группа 27: НАУКА, R&D (ИССЛЕДОВАНИЯ И РАЗРАБОТКИ) И ИННОВАЦИИ
INSERT INTO "activities" ("id", "name", "group_id", "updated_at") VALUES
(2701, 'Научные исследования', 27, CURRENT_TIMESTAMP),
(2702, 'R&D-центры (центры исследований)', 27, CURRENT_TIMESTAMP),
(2703, 'Инженерные разработки', 27, CURRENT_TIMESTAMP),
(2704, 'Прототипирование', 27, CURRENT_TIMESTAMP),
(2705, 'DeepTech (Глубокие технологии)', 27, CURRENT_TIMESTAMP),
(2706, 'Биотехнологии', 27, CURRENT_TIMESTAMP),
(2707, 'Сертификация продукции', 27, CURRENT_TIMESTAMP),
(2708, 'Испытательные лаборатории', 27, CURRENT_TIMESTAMP)
ON CONFLICT ("id") DO UPDATE SET 
    "name" = EXCLUDED."name",
    "group_id" = EXCLUDED."group_id",
    "updated_at" = CURRENT_TIMESTAMP;

-- Группа 28: КОНСАЛТИНГ И УПРАВЛЕНИЕ БИЗНЕСОМ
INSERT INTO "activities" ("id", "name", "group_id", "updated_at") VALUES
(2801, 'Стратегический консалтинг', 28, CURRENT_TIMESTAMP),
(2802, 'Управленческий консалтинг', 28, CURRENT_TIMESTAMP),
(2803, 'Операционный консалтинг', 28, CURRENT_TIMESTAMP),
(2804, 'Бизнес-аналитика', 28, CURRENT_TIMESTAMP),
(2805, 'Антикризисное управление', 28, CURRENT_TIMESTAMP),
(2806, 'M&A (слияния компаний)', 28, CURRENT_TIMESTAMP),
(2807, 'Франчайзинг', 28, CURRENT_TIMESTAMP),
(2808, 'Стартап-консалтинг', 28, CURRENT_TIMESTAMP)
ON CONFLICT ("id") DO UPDATE SET 
    "name" = EXCLUDED."name",
    "group_id" = EXCLUDED."group_id",
    "updated_at" = CURRENT_TIMESTAMP;

-- Группа 29: ГОСУДАРСТВЕННЫЙ СЕКТОР И НКО
INSERT INTO "activities" ("id", "name", "group_id", "updated_at") VALUES
(2901, 'Государственные закупки', 29, CURRENT_TIMESTAMP),
(2902, 'Работа с НКО', 29, CURRENT_TIMESTAMP),
(2903, 'Социальное предпринимательство', 29, CURRENT_TIMESTAMP),
(2904, 'Субсидии и гранты', 29, CURRENT_TIMESTAMP)
ON CONFLICT ("id") DO UPDATE SET 
    "name" = EXCLUDED."name",
    "group_id" = EXCLUDED."group_id",
    "updated_at" = CURRENT_TIMESTAMP;

-- 6. Присваиваем старые активности (без group_id) в группу "Прочее" (id = 99)
UPDATE "activities" 
SET "group_id" = 99 
WHERE "group_id" IS NULL;

-- 7. Делаем group_id NOT NULL (если все старые активности получили группу)
-- Примечание: Если есть конфликты имен с новыми активностями, старые активности 
-- останутся в группе "Прочее" с их текущими ID
DO $$
BEGIN
    -- Проверяем, есть ли еще NULL значения
    IF NOT EXISTS (SELECT 1 FROM "activities" WHERE "group_id" IS NULL) THEN
        ALTER TABLE "activities" ALTER COLUMN "group_id" SET NOT NULL;
    END IF;
END $$;

-- 8. Добавляем foreign key constraint (если еще не добавлен)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'activities_group_id_fkey' 
        AND conrelid = '"activities"'::regclass
    ) THEN
        ALTER TABLE "activities" 
        ADD CONSTRAINT "activities_group_id_fkey" 
        FOREIGN KEY ("group_id") REFERENCES "activity_groups"("id") 
        ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;
