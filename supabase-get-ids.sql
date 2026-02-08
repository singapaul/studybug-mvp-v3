-- Quick ID Lookup Queries
-- Copy these IDs to use in the /api testing page

-- ============================================================================
-- GET TUTOR IDs (Use these for Game and Group operations)
-- ============================================================================
SELECT
    u.id as user_id,
    u.email,
    t.id as tutor_id,  -- ⭐ USE THIS for tutorId field
    t."subscriptionStatus"
FROM "User" u
JOIN "Tutor" t ON t."userId" = u.id
ORDER BY u.email;

-- ============================================================================
-- GET STUDENT IDs (Use these for Student operations)
-- ============================================================================
SELECT
    u.id as user_id,
    u.email,
    s.id as student_id,  -- ⭐ USE THIS for studentId field
    s."createdAt"
FROM "User" u
JOIN "Student" s ON s."userId" = u.id
ORDER BY u.email;

-- ============================================================================
-- GET ALL IDs AT ONCE
-- ============================================================================
SELECT
    'TUTORS' as type,
    u.email,
    t.id as id_to_use,
    'Use for: tutorId in games/groups' as usage
FROM "User" u
JOIN "Tutor" t ON t."userId" = u.id

UNION ALL

SELECT
    'STUDENTS' as type,
    u.email,
    s.id as id_to_use,
    'Use for: studentId in operations' as usage
FROM "User" u
JOIN "Student" s ON s."userId" = u.id

ORDER BY type, email;

-- ============================================================================
-- GET EXISTING TEST DATA IDs
-- ============================================================================

-- Groups (with join codes)
SELECT
    id as group_id,
    name,
    "joinCode",
    'Use for: groupId in operations' as usage
FROM "Group"
ORDER BY name;

-- Games
SELECT
    id as game_id,
    name,
    "gameType",
    'Use for: gameId in operations' as usage
FROM "Game"
ORDER BY name;

-- Assignments
SELECT
    a.id as assignment_id,
    g.name as game_name,
    gr.name as group_name,
    'Use for: assignmentId in attempts' as usage
FROM "Assignment" a
JOIN "Game" g ON a."gameId" = g.id
JOIN "Group" gr ON a."groupId" = gr.id
ORDER BY gr.name;
