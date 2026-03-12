-- Создание тестовых данных для пользователя с 2 активными слотами
-- Пользователь: 3fb61848-641a-459d-afcb-7b2a2d7dda88

-- Создаем тариф
INSERT INTO tariffs (
    id,
    code,
    name,
    description,
    base_slots,
    base_days,
    max_total_days,
    is_extendable,
    price,
    currency_code,
    is_active,
    created_at,
    updated_at
) VALUES (
    gen_random_uuid(),
    'BASE',
    'Base Plan',
    'Base subscription plan',
    3,
    30,
    365,
    true,
    100.00,
    'USD',
    true,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
) RETURNING id;

-- Создаем подписку для FK constraint
WITH tariff AS (
    SELECT id FROM tariffs WHERE code = 'BASE' LIMIT 1
)
INSERT INTO subscriptions (
    id,
    user_id,
    tariff_id,
    is_active,
    total_slots,
    created_at,
    updated_at
) 
SELECT 
    gen_random_uuid(),
    '3fb61848-641a-459d-afcb-7b2a2d7dda88',
    tariff.id,
    true,
    2,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
FROM tariff;

-- Создаем пакет слотов
INSERT INTO slot_packages (
    id,
    user_id,
    slots,
    price,
    expires_at,
    is_active,
    created_at
) VALUES (
    gen_random_uuid(),
    '3fb61848-641a-459d-afcb-7b2a2d7dda88',
    2,
    100.00,
    CURRENT_DATE + INTERVAL '1 month',
    true,
    CURRENT_TIMESTAMP
);

-- Создаем 2 слота, используя ID подписки для source_id
WITH subscription AS (
    SELECT id FROM subscriptions WHERE user_id = '3fb61848-641a-459d-afcb-7b2a2d7dda88' LIMIT 1
)
INSERT INTO user_slots (
    id,
    user_id,
    slot_index,
    source_type,
    source_id,
    created_at,
    expires_at
) 
SELECT 
    gen_random_uuid(),
    '3fb61848-641a-459d-afcb-7b2a2d7dda88',
    generate_series,
    'SLOT_PACKAGE',
    subscription.id,
    CURRENT_TIMESTAMP,
    CURRENT_DATE + INTERVAL '1 month'
FROM subscription, generate_series(1, 2) AS generate_series;

-- Проверка результата
SELECT 
    (SELECT COUNT(*) FROM slot_packages WHERE user_id = '3fb61848-641a-459d-afcb-7b2a2d7dda88') as package_count,
    (SELECT COUNT(*) FROM user_slots WHERE user_id = '3fb61848-641a-459d-afcb-7b2a2d7dda88' AND expires_at > CURRENT_TIMESTAMP) as active_slots_count;
