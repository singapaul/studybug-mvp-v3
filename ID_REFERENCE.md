# Understanding IDs in StudyBug

## ⚠️ Common Mistake: Using Wrong IDs

**DON'T DO THIS:**
```typescript
// ❌ WRONG - Using User.id
const userId = '2b868f92-4bd9-47f7-8b93-8092c54c067e';
await createGame(userId, gameData); // FAILS! Foreign key error
```

**DO THIS:**
```typescript
// ✅ CORRECT - Using Tutor.id
const tutorId = 'abc123-different-id-456';
await createGame(tutorId, gameData); // Works!
```

## Table Relationships

```
┌─────────────────────────────────────────────────────┐
│ auth.users (Supabase Auth)                          │
│ ┌─────────────────────────────────────────────┐    │
│ │ id: 2b868f92-4bd9-47f7-8b93-8092c54c067e   │    │
│ │ email: tutor1@test.com                      │    │
│ │ metadata: {"role": "TUTOR"}                 │    │
│ └─────────────────┬───────────────────────────┘    │
└───────────────────┼────────────────────────────────┘
                    │
                    │ Trigger creates:
                    ↓
┌─────────────────────────────────────────────────────┐
│ User (public.User)                                  │
│ ┌─────────────────────────────────────────────┐    │
│ │ id: 2b868f92-4bd9-47f7-8b93-8092c54c067e   │←───┐
│ │ email: tutor1@test.com                      │    │
│ │ role: TUTOR                                 │    │ Same ID
│ └─────────────────┬───────────────────────────┘    │
└───────────────────┼────────────────────────────────┘
                    │
                    │ userId reference
                    ↓
┌─────────────────────────────────────────────────────┐
│ Tutor (public.Tutor)                                │
│ ┌─────────────────────────────────────────────┐    │
│ │ id: abc123-different-id-456                 │←───┼── ⭐ USE THIS for tutorId!
│ │ userId: 2b868f92-4bd9-47f7-8b93-8092c54c067e│    │
│ │ subscriptionStatus: FREE                    │    │
│ └─────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────┘
                    │
                    │ Foreign key
                    ↓
┌─────────────────────────────────────────────────────┐
│ Game (public.Game)                                  │
│ ┌─────────────────────────────────────────────┐    │
│ │ id: game-xyz-789                            │    │
│ │ tutorId: abc123-different-id-456            │←───┘
│ │ name: "Math Quiz"                           │
│ └─────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────┘
```

## Three Different IDs for One Tutor

When a tutor signs up, they get **3 different IDs**:

1. **auth.users.id** (Supabase Auth)
   - Example: `2b868f92-4bd9-47f7-8b93-8092c54c067e`
   - Used for: Authentication, JWT tokens
   - **DON'T use this for tutorId in Game/Group**

2. **User.id** (public.User table)
   - Example: `2b868f92-4bd9-47f7-8b93-8092c54c067e` (same as auth)
   - Used for: References to user profile
   - **DON'T use this for tutorId in Game/Group**

3. **Tutor.id** (public.Tutor table)
   - Example: `abc123-different-id-456` (different!)
   - Used for: Foreign keys in Game, Group
   - **✅ USE THIS for tutorId**

## Quick Reference

### For Game Operations
```typescript
// Need: Tutor.id
const tutorId = 'abc123-different-id-456'; // From Tutor table
await createGame(tutorId, gameData);
```

### For Group Operations
```typescript
// Need: Tutor.id
const tutorId = 'abc123-different-id-456'; // From Tutor table
await createGroup(tutorId, groupData);
```

### For Student Operations
```typescript
// Need: Student.id
const studentId = 'student-xyz-789'; // From Student table
await getStudentAssignments(studentId);
```

## How to Get the Right IDs

### Option 1: Run supabase-get-ids.sql
```sql
-- In Supabase SQL Editor
-- This shows TUTOR IDs and STUDENT IDs clearly
```

### Option 2: Manual Query
```sql
-- Get Tutor ID from email
SELECT t.id as tutor_id
FROM "Tutor" t
JOIN "User" u ON t."userId" = u.id
WHERE u.email = 'tutor1@test.com';

-- Get Student ID from email
SELECT s.id as student_id
FROM "Student" s
JOIN "User" u ON s."userId" = u.id
WHERE u.email = 'student1@test.com';
```

### Option 3: From API Response
When you create users via auth, you can query for the role-specific ID:

```typescript
// After signup
const { userId } = await signUp(email, password, Role.TUTOR);

// Query for Tutor ID
const { data } = await supabase
  .from('Tutor')
  .select('id')
  .eq('userId', userId)
  .single();

const tutorId = data.id; // ⭐ This is what you need
```

## Common Errors

### Error: Foreign key constraint violation
```
Key (tutorId)=(2b868f92-...) is not present in table "Tutor"
```
**Cause:** You're using User.id instead of Tutor.id
**Fix:** Get the correct Tutor.id using the queries above

### Error: Not found
```
null or empty result
```
**Cause:** Using wrong ID type
**Fix:** Make sure you're using:
- `Tutor.id` for game/group operations
- `Student.id` for student operations
- `Game.id` for game operations
- `Group.id` for group operations

## Testing Checklist

Before testing on `/api` page:

- [ ] Run `supabase-get-ids.sql` in SQL Editor
- [ ] Copy **Tutor.id** (not User.id) for tutor operations
- [ ] Copy **Student.id** (not User.id) for student operations
- [ ] Paste IDs into the input fields on `/api` page
- [ ] Test operations - they should work now!

## Schema Summary

```
auth.users.id = User.id  (SAME ID)
    ↓
User.id → Tutor.userId
    ↓
Tutor.id → Game.tutorId  (USE THIS!)
Tutor.id → Group.tutorId (USE THIS!)
```

```
auth.users.id = User.id  (SAME ID)
    ↓
User.id → Student.userId
    ↓
Student.id → GameAttempt.studentId  (USE THIS!)
Student.id → GroupMember.studentId  (USE THIS!)
```
