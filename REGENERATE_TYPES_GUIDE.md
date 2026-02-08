# Regenerating Supabase Types

After running the database migration, you need to regenerate TypeScript types to match the new schema.

## Option 1: Use the Script (Easiest)

```bash
./regenerate-types.sh
```

This script will:
1. Extract your project ID from `.env.local`
2. Generate types from Supabase
3. Save to `src/types/database.types.ts`

## Option 2: Manual Command

### Step 1: Find Your Project ID

Your Supabase URL looks like: `https://YOUR_PROJECT_ID.supabase.co`

Find it in your `.env.local` file or Supabase dashboard.

### Step 2: Run the Generation Command

```bash
supabase gen types typescript --project-id YOUR_PROJECT_ID > src/types/database.types.ts
```

Replace `YOUR_PROJECT_ID` with your actual project ID.

## Option 3: Use Linked Project

If you have linked your local project to Supabase:

```bash
supabase gen types typescript --linked > src/types/database.types.ts
```

## After Regeneration

### 1. Verify the Types Were Generated

```bash
# Check the file was created and has content
ls -lh src/types/database.types.ts
head -20 src/types/database.types.ts
```

You should see:
- File size > 10KB
- TypeScript type definitions
- Database table types

### 2. Check for userId in Game Type

```bash
# Search for the Game type definition
grep -A 15 "Game: {" src/types/database.types.ts
```

You should see `userId: string` instead of `tutorId: string`.

### 3. Rebuild the Application

```bash
npm run build
```

This should now complete without TypeScript errors.

### 4. Start Dev Server

```bash
npm run dev
```

## Troubleshooting

### "Not logged in"

```bash
supabase login
```

Then try regenerating again.

### "Project not found"

1. Check your project ID is correct
2. Verify you have access to the project
3. Make sure the migration completed successfully

### "Permission denied on .env.local"

Your `.env.local` file might have restricted permissions. Check the project ID manually:

```bash
cat .env.local | grep VITE_SUPABASE_URL
```

Then use the manual command with that project ID.

### Types still show tutorId

1. Verify the migration completed: Check in Supabase SQL Editor:
   ```sql
   SELECT column_name FROM information_schema.columns
   WHERE table_name = 'Game' AND column_name IN ('userId', 'tutorId');
   ```

   Should only show `userId`, not `tutorId`.

2. Regenerate types again
3. Clear any cached builds: `rm -rf dist node_modules/.vite`

## What Changed

The generated types should now show:

```typescript
Game: {
  Row: {
    id: string
    userId: string  // ✅ Changed from tutorId
    name: string
    gameType: Database["public"]["Enums"]["GameType"]
    gameData: string
    createdAt: string
    updatedAt: string
  }
  // ...
}
```

## Next Steps

After types are regenerated and the build succeeds:

1. ✅ Test the Games page
2. ✅ Create a new game
3. ✅ Edit a game
4. ✅ Delete a game
5. ✅ Verify games are associated with your user account

All game operations should now work directly with your auth user ID!
