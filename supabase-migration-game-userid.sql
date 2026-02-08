-- Migration: Change Game.tutorId to Game.userId
-- This changes the Game table to reference auth.users directly instead of going through the Tutor table

BEGIN;

-- Step 1: Drop existing RLS policies that depend on tutorId
DROP POLICY IF EXISTS "Tutors can view own games" ON "Game";
DROP POLICY IF EXISTS "Tutors can insert own games" ON "Game";
DROP POLICY IF EXISTS "Tutors can update own games" ON "Game";
DROP POLICY IF EXISTS "Tutors can delete own games" ON "Game";

-- Step 2: Add new userId column as UUID (to match auth.users.id)
ALTER TABLE "Game"
ADD COLUMN "userId" UUID;

-- Step 3: Populate userId from tutorId
-- Map tutorId -> Tutor.userId (which is the auth user ID)
UPDATE "Game" g
SET "userId" = t."userId"::UUID
FROM "Tutor" t
WHERE g."tutorId" = t.id;

-- Step 4: Make userId NOT NULL after population
ALTER TABLE "Game"
ALTER COLUMN "userId" SET NOT NULL;

-- Step 5: Drop the old foreign key constraint
ALTER TABLE "Game"
DROP CONSTRAINT IF EXISTS "Game_tutorId_fkey";

-- Step 6: Drop the old tutorId column (now safe after dropping policies)
ALTER TABLE "Game"
DROP COLUMN "tutorId";

-- Step 7: Add foreign key to auth.users
ALTER TABLE "Game"
ADD CONSTRAINT "Game_userId_fkey"
FOREIGN KEY ("userId") REFERENCES auth.users(id) ON DELETE CASCADE;

-- Step 8: Create index on userId for performance
CREATE INDEX IF NOT EXISTS "Game_userId_idx" ON "Game"("userId");

-- Step 9: Recreate RLS policies using userId (simpler and more direct!)
CREATE POLICY "Users can view own games" ON "Game"
  FOR SELECT USING ("userId" = auth.uid());

CREATE POLICY "Users can insert own games" ON "Game"
  FOR INSERT WITH CHECK ("userId" = auth.uid());

CREATE POLICY "Users can update own games" ON "Game"
  FOR UPDATE USING ("userId" = auth.uid());

CREATE POLICY "Users can delete own games" ON "Game"
  FOR DELETE USING ("userId" = auth.uid());

COMMIT;

-- Verification queries (run these separately after migration):
-- Check the new structure
-- SELECT column_name, data_type, is_nullable
-- FROM information_schema.columns
-- WHERE table_name = 'Game' AND column_name IN ('userId', 'tutorId');

-- Verify all games have userId
-- SELECT COUNT(*) as total_games,
--        COUNT("userId") as games_with_userId
-- FROM "Game";

-- Check games with user emails
-- SELECT g.id, g.name, g."userId", u.email
-- FROM "Game" g
-- JOIN auth.users u ON g."userId" = u.id
-- LIMIT 5;

-- Verify RLS policies are in place
-- SELECT schemaname, tablename, policyname, cmd, qual
-- FROM pg_policies
-- WHERE tablename = 'Game';
