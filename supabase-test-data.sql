-- Test Data for StudyBug Supabase
-- Creates dummy Users, Tutors, Students, Groups, Games, Assignments, and Attempts
-- Run this AFTER setting up the schema and triggers

-- ============================================================================
-- STEP 1: Create Test Users via Supabase Auth Dashboard
-- ============================================================================
-- You need to manually create these users in Supabase Dashboard → Authentication:
--
-- Tutor 1:
--   Email: tutor1@test.com
--   Password: Test123!
--   Metadata: {"role": "TUTOR"}
--
-- Tutor 2:
--   Email: tutor2@test.com
--   Password: Test123!
--   Metadata: {"role": "TUTOR"}
--
-- Student 1:
--   Email: student1@test.com
--   Password: Test123!
--   Metadata: {"role": "STUDENT"}
--
-- Student 2:
--   Email: student2@test.com
--   Password: Test123!
--   Metadata: {"role": "STUDENT"}
--
-- Student 3:
--   Email: student3@test.com
--   Password: Test123!
--   Metadata: {"role": "STUDENT"}
--
-- The triggers will automatically create User, Tutor, and Student records!

-- ============================================================================
-- STEP 2: Get the created IDs
-- ============================================================================
-- After creating users, run these queries to get the IDs:

-- Get Tutor IDs
SELECT
    u.id as user_id,
    u.email,
    t.id as tutor_id
FROM "User" u
JOIN "Tutor" t ON t."userId" = u.id
ORDER BY u.email;

-- Get Student IDs
SELECT
    u.id as user_id,
    u.email,
    s.id as student_id
FROM "User" u
JOIN "Student" s ON s."userId" = u.id
ORDER BY u.email;

-- ============================================================================
-- STEP 3: Insert Test Data (Replace UUIDs with actual IDs from above)
-- ============================================================================

-- Replace these with your actual tutor IDs from the query above
DO $$
DECLARE
    tutor1_id text;
    tutor2_id text;
    student1_id text;
    student2_id text;
    student3_id text;

    -- Group IDs (will be generated)
    group1_id text;
    group2_id text;
    group3_id text;

    -- Game IDs (will be generated)
    game1_id text;
    game2_id text;
    game3_id text;

    -- Assignment IDs (will be generated)
    assign1_id text;
    assign2_id text;
    assign3_id text;
BEGIN
    -- Get tutor IDs
    SELECT t.id INTO tutor1_id FROM "Tutor" t
    JOIN "User" u ON t."userId" = u.id
    WHERE u.email = 'tutor1@test.com' LIMIT 1;

    SELECT t.id INTO tutor2_id FROM "Tutor" t
    JOIN "User" u ON t."userId" = u.id
    WHERE u.email = 'tutor2@test.com' LIMIT 1;

    -- Get student IDs
    SELECT s.id INTO student1_id FROM "Student" s
    JOIN "User" u ON s."userId" = u.id
    WHERE u.email = 'student1@test.com' LIMIT 1;

    SELECT s.id INTO student2_id FROM "Student" s
    JOIN "User" u ON s."userId" = u.id
    WHERE u.email = 'student2@test.com' LIMIT 1;

    SELECT s.id INTO student3_id FROM "Student" s
    JOIN "User" u ON s."userId" = u.id
    WHERE u.email = 'student3@test.com' LIMIT 1;

    -- Verify we have the IDs
    IF tutor1_id IS NULL OR student1_id IS NULL THEN
        RAISE EXCEPTION 'Users not found. Please create users in Auth first.';
    END IF;

    -- Create Groups
    INSERT INTO "Group" ("tutorId", name, "ageRange", "subjectArea", "joinCode")
    VALUES
        (tutor1_id, 'Math Class Year 7', '11-12', 'Mathematics', 'MATH001')
    RETURNING id INTO group1_id;

    INSERT INTO "Group" ("tutorId", name, "ageRange", "subjectArea", "joinCode")
    VALUES
        (tutor1_id, 'Science Club', '12-13', 'Science', 'SCI002')
    RETURNING id INTO group2_id;

    INSERT INTO "Group" ("tutorId", name, "ageRange", "subjectArea", "joinCode")
    VALUES
        (tutor2_id, 'English Literature', '13-14', 'English', 'ENG003')
    RETURNING id INTO group3_id;

    RAISE NOTICE 'Created groups: %, %, %', group1_id, group2_id, group3_id;

    -- Add students to groups
    INSERT INTO "GroupMember" ("groupId", "studentId")
    VALUES
        (group1_id, student1_id),
        (group1_id, student2_id),
        (group2_id, student1_id),
        (group2_id, student3_id),
        (group3_id, student2_id);

    RAISE NOTICE 'Added students to groups';

    -- Create Games
    INSERT INTO "Game" ("tutorId", name, "gameType", "gameData")
    VALUES
        (tutor1_id, 'Times Tables Practice', 'PAIRS',
         '{"description":"Match numbers with their products","items":[{"id":"1","leftText":"2 × 3","rightText":"6"},{"id":"2","leftText":"4 × 5","rightText":"20"},{"id":"3","leftText":"7 × 8","rightText":"56"}]}')
    RETURNING id INTO game1_id;

    INSERT INTO "Game" ("tutorId", name, "gameType", "gameData")
    VALUES
        (tutor1_id, 'Science Vocabulary', 'FLASHCARDS',
         '{"description":"Learn key science terms","cards":[{"id":"1","front":"Photosynthesis","back":"The process by which plants make food"},{"id":"2","front":"Atom","back":"The smallest unit of matter"}]}')
    RETURNING id INTO game2_id;

    INSERT INTO "Game" ("tutorId", name, "gameType", "gameData")
    VALUES
        (tutor2_id, 'Shakespeare Quiz', 'MULTIPLE_CHOICE',
         '{"description":"Test your Shakespeare knowledge","questions":[{"id":"1","question":"Who wrote Romeo and Juliet?","options":[{"id":"1","text":"William Shakespeare","isCorrect":true},{"id":"2","text":"Charles Dickens","isCorrect":false}]}]}')
    RETURNING id INTO game3_id;

    RAISE NOTICE 'Created games: %, %, %', game1_id, game2_id, game3_id;

    -- Create Assignments
    INSERT INTO "Assignment" ("gameId", "groupId", "dueDate", "passPercentage")
    VALUES
        (game1_id, group1_id, NOW() + INTERVAL '7 days', 70)
    RETURNING id INTO assign1_id;

    INSERT INTO "Assignment" ("gameId", "groupId", "dueDate", "passPercentage")
    VALUES
        (game2_id, group2_id, NOW() + INTERVAL '14 days', 80)
    RETURNING id INTO assign2_id;

    INSERT INTO "Assignment" ("gameId", "groupId", "dueDate", "passPercentage")
    VALUES
        (game3_id, group3_id, NOW() - INTERVAL '2 days', 75)
    RETURNING id INTO assign3_id;

    RAISE NOTICE 'Created assignments: %, %, %', assign1_id, assign2_id, assign3_id;

    -- Create Game Attempts
    INSERT INTO "GameAttempt" ("assignmentId", "studentId", "scorePercentage", "timeTaken", "attemptData")
    VALUES
        (assign1_id, student1_id, 85.5, 120, '{"answers":["correct","correct","wrong"],"totalQuestions":3,"correctAnswers":2}'),
        (assign1_id, student1_id, 92.0, 95, '{"answers":["correct","correct","correct"],"totalQuestions":3,"correctAnswers":3}'),
        (assign1_id, student2_id, 65.0, 180, '{"answers":["correct","wrong","wrong"],"totalQuestions":3,"correctAnswers":1}'),
        (assign2_id, student1_id, 78.5, 200, '{"cardsReviewed":10,"cardsCorrect":8}'),
        (assign2_id, student3_id, 88.0, 150, '{"cardsReviewed":10,"cardsCorrect":9}');

    RAISE NOTICE 'Created game attempts';
    RAISE NOTICE 'Test data setup complete!';

END $$;

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

-- Check created data
SELECT 'Groups' as table_name, COUNT(*) as count FROM "Group"
UNION ALL
SELECT 'GroupMembers', COUNT(*) FROM "GroupMember"
UNION ALL
SELECT 'Games', COUNT(*) FROM "Game"
UNION ALL
SELECT 'Assignments', COUNT(*) FROM "Assignment"
UNION ALL
SELECT 'GameAttempts', COUNT(*) FROM "GameAttempt";

-- View group details
SELECT
    g.name as group_name,
    g."joinCode",
    u.email as tutor_email,
    COUNT(DISTINCT gm.id) as member_count
FROM "Group" g
JOIN "Tutor" t ON g."tutorId" = t.id
JOIN "User" u ON t."userId" = u.id
LEFT JOIN "GroupMember" gm ON g.id = gm."groupId"
GROUP BY g.id, g.name, g."joinCode", u.email
ORDER BY g.name;

-- View student assignments
SELECT
    u.email as student_email,
    g.name as group_name,
    gm.name as game_name,
    a."dueDate",
    a."passPercentage",
    COUNT(ga.id) as attempts,
    MAX(ga."scorePercentage") as best_score
FROM "GroupMember" gmem
JOIN "Student" s ON gmem."studentId" = s.id
JOIN "User" u ON s."userId" = u.id
JOIN "Group" g ON gmem."groupId" = g.id
LEFT JOIN "Assignment" a ON a."groupId" = g.id
LEFT JOIN "Game" gm ON a."gameId" = gm.id
LEFT JOIN "GameAttempt" ga ON ga."assignmentId" = a.id AND ga."studentId" = s.id
GROUP BY u.email, g.name, gm.name, a."dueDate", a."passPercentage"
ORDER BY u.email, g.name;
