# Service Architecture: Auth-Based Implementation

## Decision Made: Option 1 - Auth UID Based Services

All services have been refactored to use Supabase Auth UIDs instead of requiring explicit Tutor/Student IDs.

## Implementation

### Before (Old Approach)
```typescript
// ❌ Required explicit database IDs
await createGame(tutorId, gameData);
await getStudentAssignments(studentId);
await getTutorGames(tutorId);
```

### After (Current Implementation)
```typescript
// ✅ Uses authenticated user automatically
await createGame(gameData);
await getMyAssignments();
await getMyGames();
```

## Benefits

- **Simpler API**: No IDs required in function calls
- **More Secure**: Uses Supabase Auth automatically
- **RLS Compatible**: Works seamlessly with Row Level Security policies
- **Better UX**: Services know who the current user is

## Service Functions

All services now follow this pattern:

### Helper Functions (Internal)
```typescript
// Gets Tutor.id from current auth user
async function getCurrentTutorId(): Promise<string> {
  const { data: { user } } = await supabase.auth.getUser();
  const { data } = await supabase
    .from('Tutor')
    .select('id')
    .eq('userId', user.id)
    .single();
  return data.id;
}

// Gets Student.id from current auth user
async function getCurrentStudentId(): Promise<string> {
  const { data: { user } } = await supabase.auth.getUser();
  const { data } = await supabase
    .from('Student')
    .select('id')
    .eq('userId', user.id)
    .single();
  return data.id;
}
```

### Game Service (src/services/supabase/game.service.ts)
```typescript
export async function getMyGames(): Promise<Game[]>
export async function createGame(input: CreateGameInput): Promise<GameWithData>
export async function updateGame(gameId: string, input: UpdateGameInput): Promise<GameWithData>
export async function deleteGame(gameId: string): Promise<void>
export async function duplicateGame(gameId: string): Promise<GameWithData>
```

### Group Service (src/services/supabase/group.service.ts)
```typescript
// Tutor functions
export async function getMyGroups(): Promise<Group[]>
export async function createGroup(input: CreateGroupInput): Promise<Group>
export async function updateGroup(groupId: string, input: Partial<CreateGroupInput>): Promise<Group>
export async function deleteGroup(groupId: string): Promise<void>

// Student functions
export async function getMyGroupsAsStudent(): Promise<GroupWithDetails[]>
```

### Student Service (src/services/supabase/student.service.ts)
```typescript
export async function joinGroup(joinCode: string): Promise<void>
export async function getMyAssignments(filter?, sort?): Promise<StudentAssignment[]>
export async function getMyStats(): Promise<StudentStats>
export async function getMyAttempts(filters?): Promise<GameAttempt[]>
export async function getMyPersonalBests(): Promise<PersonalBest[]>
export async function getMyProgressTrends(days = 30): Promise<ProgressTrend[]>
```

### Game Attempt Service (src/services/supabase/game-attempt.service.ts)
```typescript
export async function saveGameAttempt(
  assignmentId: string,
  scorePercentage: number,
  timeTaken: number,
  attemptData: any
): Promise<GameAttempt>

export async function getMyAssignmentAttempts(assignmentId: string): Promise<GameAttempt[]>
export async function getMyBestAttempt(assignmentId: string): Promise<GameAttempt | null>
export async function getMyAttempts(): Promise<GameAttempt[]>
```

## Testing

The `/api` test page requires authentication:

1. Sign in with test accounts (tutor1@test.com, student1@test.com, etc.)
2. Test functions work automatically in the authenticated context
3. No need to pass IDs manually

## Security with RLS

Services work seamlessly with Row Level Security policies:

```sql
-- Users can only see their own games
CREATE POLICY "Users see own games" ON "Game"
  FOR SELECT USING (
    tutorId IN (
      SELECT id FROM "Tutor" WHERE "userId" = auth.uid()
    )
  );

-- Students can only see their own attempts
CREATE POLICY "Students see own attempts" ON "GameAttempt"
  FOR SELECT USING (
    studentId IN (
      SELECT id FROM "Student" WHERE "userId" = auth.uid()
    )
  );
```

The auth.uid() function in RLS policies matches the user ID that services use internally, ensuring consistent security.
