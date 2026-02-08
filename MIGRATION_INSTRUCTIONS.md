# Game Table Migration: tutorId → userId

## Overview

This migration changes the `Game` table to reference `auth.users` directly via `userId` instead of going through the `Tutor` table with `tutorId`.

## Benefits

1. **Simpler Architecture** - Direct reference to auth users eliminates unnecessary join through Tutor table
2. **Better Performance** - One less table lookup required
3. **Cleaner RLS** - Row Level Security policies can use `auth.uid()` directly
4. **Consistency** - Matches how other tables reference users

## Migration Steps

### 1. Run the SQL Migration

Go to your Supabase SQL Editor and run the migration script:

```bash
# File: supabase-migration-game-userid.sql
```

**⚠️ Important Notes:**
- The migration preserves all existing data by copying `Tutor.userId` to `Game.userId`
- It runs in a transaction, so it will roll back if anything fails
- Existing games will automatically be assigned to the correct user

### 2. Regenerate TypeScript Types

After running the migration, regenerate the types:

```bash
supabase gen types typescript --project-id <your-project-id> > src/types/database.types.ts
```

### 3. Verify the Migration

Run these queries in Supabase SQL Editor to verify:

```sql
-- Check the new structure
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'Game';

-- Verify data integrity - all games should have a userId
SELECT COUNT(*) as total_games,
       COUNT("userId") as games_with_userId
FROM "Game";

-- Verify userId matches actual users
SELECT g.id, g.name, g."userId", u.email
FROM "Game" g
JOIN auth.users u ON g."userId" = u.id
LIMIT 10;
```

### 4. Test the Application

1. **Sign in as a tutor**
2. **Navigate to Games page** - you should see all your games
3. **Create a new game** - should save with your userId
4. **Edit a game** - should work normally
5. **Delete a game** - should work normally

## Code Changes Made

### Service Layer (`game.service.ts`)
- ✅ Replaced `getCurrentTutorId()` with `getCurrentUserId()`
- ✅ Changed all `tutorId` references to `userId`
- ✅ Removed dependency on Tutor table lookup
- ✅ Simplified queries to use `userId` directly

### Type Definitions (`game.ts`)
- ✅ Updated `Game` interface: `tutorId: string` → `userId: string`
- ✅ Added comment explaining userId references auth.users

### Database Schema
- ✅ Column changed from `tutorId` to `userId`
- ✅ Foreign key now points to `auth.users(id)`
- ✅ Index created on `userId` for performance
- ✅ CASCADE delete preserved

## Rollback Plan

If you need to rollback, run this SQL:

```sql
BEGIN;

-- Add back tutorId column
ALTER TABLE "Game" ADD COLUMN "tutorId" TEXT;

-- Populate tutorId from userId
UPDATE "Game" g
SET "tutorId" = t.id
FROM "Tutor" t
WHERE g."userId" = t."userId";

-- Make it NOT NULL
ALTER TABLE "Game" ALTER COLUMN "tutorId" SET NOT NULL;

-- Restore foreign key
ALTER TABLE "Game"
ADD CONSTRAINT "Game_tutorId_fkey"
FOREIGN KEY ("tutorId") REFERENCES "Tutor"(id) ON DELETE CASCADE;

-- Drop the new constraint and column
ALTER TABLE "Game" DROP CONSTRAINT "Game_userId_fkey";
ALTER TABLE "Game" DROP COLUMN "userId";

COMMIT;
```

## RLS Policy Update (Optional)

Consider updating RLS policies to use the simpler userId:

```sql
-- Old policy (complex)
CREATE POLICY "Users can see own games" ON "Game"
  FOR SELECT USING (
    "tutorId" IN (
      SELECT id FROM "Tutor" WHERE "userId" = auth.uid()
    )
  );

-- New policy (simpler)
CREATE POLICY "Users can see own games" ON "Game"
  FOR SELECT USING ("userId" = auth.uid());
```

## Testing Checklist

- [ ] Migration completed without errors
- [ ] All games have userId populated
- [ ] TypeScript types regenerated
- [ ] No TypeScript compilation errors
- [ ] Can view existing games
- [ ] Can create new games
- [ ] Can edit games
- [ ] Can delete games
- [ ] API test page works
- [ ] Game assignments still work correctly

## Support

If you encounter issues:
1. Check the Supabase logs for errors
2. Verify all games have userId values
3. Ensure TypeScript types are regenerated
4. Check that RLS policies are updated if applicable
