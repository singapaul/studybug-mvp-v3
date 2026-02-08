# Supabase Migration Guide

## Overview
Successfully migrated all localStorage-based services to Supabase PostgreSQL database with full CRUD operations.

## What Was Created

### 1. Database Schema (`supabase-schema.sql`)
**NEW**: Includes automatic user creation triggers!
A complete PostgreSQL schema with:
- ✅ UUID-based IDs using `gen_random_uuid()`
- ✅ Automatic `updated_at` triggers
- ✅ JSONB columns for `game_data` and `attempt_data`
- ✅ Row Level Security (RLS) policies
- ✅ Proper indexes and foreign keys
- ✅ Tables: User, Tutor, Student, Group, GroupMember, Game, Assignment, GameAttempt
- ✅ Triggers: Auto-create User/Tutor/Student on auth signup, email verification sync, cleanup on delete

### 2. Supabase Service Functions

#### `src/services/supabase/game.service.ts`
- `getTutorGames(tutorId)` - Get all games for a tutor
- `getGameById(gameId)` - Get single game with parsed data
- `getGamesByType(tutorId, type)` - Filter games by type
- `createGame(tutorId, input)` - Create new game
- `updateGame(gameId, input)` - Update existing game
- `deleteGame(gameId)` - Delete game
- `isGameAssigned(gameId)` - Check if game has assignments
- `duplicateGame(gameId, tutorId)` - Duplicate a game

#### `src/services/supabase/group.service.ts`
- `getTutorGroups(tutorId)` - Get all groups for a tutor
- `getGroupById(groupId)` - Get single group with members & assignments
- `getGroupByJoinCode(joinCode)` - Find group by join code
- `createGroup(tutorId, input)` - Create new group with unique join code
- `updateGroup(groupId, input)` - Update group details
- `deleteGroup(groupId)` - Delete group
- `addStudentToGroup(groupId, studentId, email)` - Add student to group
- `removeStudentFromGroup(groupId, studentId)` - Remove student
- `getStudentGroups(studentId)` - Get all groups for a student

#### `src/services/supabase/student.service.ts`
- `joinGroup(studentId, email, joinCode)` - Join group via code
- `getStudentGroups(studentId)` - Get student's groups
- `getStudentAssignments(studentId, filter, sort)` - Get assignments with filtering
- `getStudentStats(studentId)` - Dashboard statistics
- `getStudentAttempts(studentId, filters)` - Get attempts with filtering
- `getStudentPersonalBests(studentId)` - Best scores per game
- `getStudentProgressTrends(studentId, days)` - Progress over time
- `getAttemptDetails(attemptId)` - Detailed attempt data

#### `src/services/supabase/game-attempt.service.ts`
- `saveGameAttempt(assignmentId, studentId, score, time, data)` - Save attempt
- `getAssignmentAttempts(assignmentId, studentId)` - Get all attempts
- `getBestAttempt(assignmentId, studentId)` - Get highest scoring attempt
- `getStudentAttempts(studentId)` - Get all student attempts
- `deleteAssignmentAttempts(assignmentId)` - Delete attempts (testing)

### 3. Auth Helper Functions (`src/lib/supabase-auth-helpers.ts`)
Simplified authentication functions:
- `signUp(email, password, role)` - Sign up with automatic User/Tutor/Student creation
- `signIn(email, password)` - Sign in existing user
- `signOut()` - Sign out current user
- `getCurrentUser()` - Get current authenticated user
- `getCurrentUserRole()` - Get user's role
- `getUserProfile(userId)` - Get Tutor or Student profile
- `resetPassword(email)` - Send password reset email
- `updatePassword(newPassword)` - Update password for logged-in user

### 4. API Testing Page (`/api`)
A comprehensive testing interface at `/api` route with:
- Tabs for each service (Games, Groups, Students, Attempts)
- Input fields for IDs and parameters
- Buttons to test each function
- Live results display with JSON formatting
- Error handling and loading states

## Automatic User Creation

The schema includes **database triggers** that automatically create User and Tutor/Student records when someone signs up via Supabase Auth:

### How it works:
1. User signs up with email/password via Supabase Auth
2. Trigger `handle_new_user()` fires automatically
3. Creates record in `User` table with same ID as auth.users
4. Reads `role` from user metadata ('TUTOR' or 'STUDENT')
5. Creates corresponding `Tutor` or `Student` record
6. Defaults to 'STUDENT' if no role specified

### Usage in your signup form:
```typescript
import { signUp } from '@/lib/supabase-auth-helpers';
import { Role } from '@/types/auth';

// Sign up as tutor
const result = await signUp('tutor@example.com', 'password123', Role.TUTOR);

// Sign up as student
const result = await signUp('student@example.com', 'password123', Role.STUDENT);
```

### Additional Triggers:
- **Email verification sync**: Updates `User.email_verified` when user confirms email
- **User deletion cleanup**: Deletes User/Tutor/Student records when auth user is deleted

## Setup Instructions

### Step 1: Run Database Schema
1. Open your Supabase dashboard
2. Go to SQL Editor
3. Create a new query
4. Copy the contents of `supabase-schema.sql`
5. Execute the query
6. Verify tables are created in Table Editor

### Step 2: Environment Variables
Ensure `.env.local` has:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

### Step 3: Test User Signup
1. Use the auth helpers to create test users:
   ```typescript
   import { signUp } from '@/lib/supabase-auth-helpers';
   import { Role } from '@/types/auth';

   // This automatically creates User + Tutor records
   await signUp('tutor@test.com', 'password123', Role.TUTOR);

   // This automatically creates User + Student records
   await signUp('student@test.com', 'password123', Role.STUDENT);
   ```

2. Verify in Supabase dashboard:
   - Check `Authentication > Users` for auth records
   - Check `Table Editor > User` for User records
   - Check `Table Editor > Tutor` or `Student` for role records

### Step 4: Test the API
1. Start your dev server: `npm run dev`
2. Navigate to `http://localhost:5173/api`
3. Get user IDs from Supabase dashboard (or from signup response)
4. Test each service:
   - **Use the IDs from your created users**
   - Create a game with the "Create Test Game" button
   - Create a group with the "Create Test Group" button
   - Add student to group
   - Create assignments (you may need to do this in Supabase dashboard for now)
   - Test attempts

## Key Differences from Prisma Schema

### Column Naming
- `camelCase` → `snake_case` (PostgreSQL convention)
- Example: `tutorId` → `tutor_id`

### Data Types
- IDs: `String @default(cuid())` → `uuid DEFAULT gen_random_uuid()`
- JSON: `String` → `jsonb` (native PostgreSQL JSON)
- Timestamps: Auto-managed with triggers

### JSON Storage
- **Before**: `gameData: JSON.stringify(data)` and `JSON.parse(string)`
- **After**: Direct JSONB - Supabase handles it automatically

## Migration Path for Existing Services

To switch from localStorage to Supabase in your app:

1. **Import the new service:**
   ```typescript
   // Old
   import * as gameService from '@/services/game.service';

   // New
   import * as gameService from '@/services/supabase/game.service';
   ```

2. **Update function calls if needed:**
   - Most function signatures are identical
   - JSON data is now parsed automatically (no need for JSON.parse)

3. **Handle async operations:**
   - All functions return Promises
   - Make sure to use `await` or `.then()`

## RLS Policies

Basic Row Level Security policies are included:
- Users can view their own data
- Tutors can manage their own groups and games
- Students can view groups they're members of
- Students can view assignments in their groups
- Students can manage their own attempts

**Note**: You may need to adjust these policies based on your authentication strategy.

## Next Steps

1. ✅ Run `supabase-schema.sql` in Supabase dashboard
2. ✅ Test all functions using `/api` page
3. ✅ Create test data (users, tutors, students)
4. ✅ Gradually replace old services with Supabase services in your app
5. ✅ Update authentication to work with Supabase Auth (if not already)
6. ✅ Consider adding Assignment service functions if needed

## Notes

- **Game Data**: Now stored as JSONB, automatically parsed by Supabase
- **Attempt Data**: Also JSONB for better querying capabilities
- **Timestamps**: All use `timestamptz` for timezone awareness
- **Cascading Deletes**: Configured on all foreign keys
- **Error Handling**: All services include proper error handling and logging

## Troubleshooting

### "relation does not exist" error
- Schema not created yet - run `supabase-schema.sql`

### "null value in column violates not-null constraint"
- Check that all required fields are provided
- Verify UUIDs are valid

### RLS Policy errors
- Policies might be too restrictive
- Check if user is authenticated
- Verify user has correct permissions

## Testing Checklist

- [ ] Schema created successfully
- [ ] Can create games
- [ ] Can create groups
- [ ] Can add students to groups
- [ ] Can create assignments
- [ ] Can save game attempts
- [ ] Can retrieve student stats
- [ ] Can get progress trends
- [ ] RLS policies working correctly
