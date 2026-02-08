-- Check Current Schema Structure
-- Run this to verify your tables are compatible with the triggers

-- Check User table structure
SELECT
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name = 'User'
ORDER BY ordinal_position;

-- Check if enum types exist
SELECT
    typname as enum_name,
    array_agg(enumlabel ORDER BY enumsortorder) as values
FROM pg_type t
JOIN pg_enum e ON t.oid = e.enumtypid
WHERE t.typname IN ('role', 'subscription_status', 'game_type')
GROUP BY typname;

-- Check existing triggers on auth.users
SELECT
    trigger_name,
    event_manipulation,
    action_statement
FROM information_schema.triggers
WHERE event_object_schema = 'auth'
AND event_object_table = 'users';

-- Check User table constraints
SELECT
    tc.constraint_name,
    tc.constraint_type,
    kcu.column_name
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu
    ON tc.constraint_name = kcu.constraint_name
WHERE tc.table_schema = 'public'
AND tc.table_name = 'User'
ORDER BY tc.constraint_type, kcu.column_name;
