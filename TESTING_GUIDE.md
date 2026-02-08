# API Testing Guide

## Setup Steps

### 1. Run the Auth Triggers
```sql
-- In Supabase SQL Editor, run:
supabase-add-triggers.sql
```

### 2. Create Test Users in Supabase Dashboard

Go to **Authentication → Users** and create these users:

**Tutor 1:**
- Email: `tutor1@test.com`
- Password: `Test123!`
- User Metadata (Important!): `{"role": "TUTOR"}`

**Tutor 2:**
- Email: `tutor2@test.com`
- Password: `Test123!`
- User Metadata: `{"role": "TUTOR"}`

**Student 1:**
- Email: `student1@test.com`
- Password: `Test123!`
- User Metadata: `{"role": "STUDENT"}`

**Student 2:**
- Email: `student2@test.com`
- Password: `Test123!`
- User Metadata: `{"role": "STUDENT"}`

**Student 3:**
- Email: `student3@test.com`
- Password: `Test123!`
- User Metadata: `{"role": "STUDENT"}`

> **Triggers will automatically create User, Tutor, and Student records!**

### 3. Load Test Data
```sql
-- In Supabase SQL Editor, run:
supabase-test-data.sql
```

This creates:
- 3 Groups with join codes (MATH001, SCI002, ENG003)
- 3 Games (Times Tables, Science Vocab, Shakespeare Quiz)
- 3 Assignments
- 5 Game Attempts

### 4. Get IDs for Testing

⚠️ **CRITICAL:** Use `Tutor.id` and `Student.id`, NOT `User.id`!

Run `supabase-get-ids.sql` in Supabase SQL Editor - it shows all IDs you need.

Or run these queries manually:

```sql
-- Get Tutor IDs (⭐ USE THESE for tutorId)
SELECT
    u.email,
    t.id as tutor_id  -- ⭐ COPY THIS
FROM "Tutor" t
JOIN "User" u ON t."userId" = u.id;

-- Get Student IDs (⭐ USE THESE for studentId)
SELECT
    u.email,
    s.id as student_id  -- ⭐ COPY THIS
FROM "Student" s
JOIN "User" u ON s."userId" = u.id;

-- Get Group IDs with join codes
SELECT id, name, "joinCode"
FROM "Group";

-- Get Game IDs
SELECT id, name, "gameType"
FROM "Game";

-- Get Assignment IDs
SELECT id, "gameId", "groupId"
FROM "Assignment";
```

## Testing on /api Page

Navigate to `http://localhost:5173/api`

### Example Test Flow

1. **Copy IDs from Supabase**
   - Get a tutor ID
   - Get a student ID
   - Get a group ID
   - Get a join code

2. **Paste IDs into the input fields at the top**

3. **Test Game Operations**
   - Click "Get Tutor Games" → Should show existing games
   - Click "Create Test Game" → Creates new game
   - Copy the new game ID from results
   - Paste it in "Game ID" field
   - Click "Get Game by ID" → Shows full game data
   - Click "Update Game" → Changes name
   - Click "Duplicate Game" → Makes a copy

4. **Test Group Operations**
   - Click "Get Tutor Groups" → Shows tutor's groups
   - Click "Create Test Group" → Creates new group
   - Copy the new group ID and join code
   - Click "Get Group by Join Code" → Finds by code
   - Click "Add Student to Group" → Adds student
   - Click "Get Group by ID" → Shows members

5. **Test Student Operations**
   - Use student ID
   - Click "Get Student Groups" → Shows joined groups
   - Click "Get Student Assignments" → Shows assignments
   - Click "Get Student Stats" → Dashboard stats
   - Click "Join Group with Code" → Use MATH001, SCI002, or ENG003

6. **Test Game Attempts**
   - Get an assignment ID from query
   - Use student ID
   - Click "Save Test Attempt" → Records a score
   - Click "Get Assignment Attempts" → Shows all attempts
   - Click "Get Best Attempt" → Shows highest score

## Dummy Data Examples

### Create Game (Manual)
```json
{
  "name": "Capital Cities Quiz",
  "gameType": "MULTIPLE_CHOICE",
  "gameData": {
    "description": "Test your geography knowledge",
    "questions": [
      {
        "id": "1",
        "question": "What is the capital of France?",
        "options": [
          {"id": "1", "text": "Paris", "isCorrect": true},
          {"id": "2", "text": "London", "isCorrect": false},
          {"id": "3", "text": "Berlin", "isCorrect": false}
        ]
      }
    ]
  }
}
```

### Create Group (Manual)
```json
{
  "name": "History Year 8",
  "ageRange": "12-13",
  "subjectArea": "History"
}
```

### Save Game Attempt (Manual)
```json
{
  "assignmentId": "your-assignment-id",
  "studentId": "your-student-id",
  "scorePercentage": 85.5,
  "timeTaken": 120,
  "attemptData": {
    "answers": ["correct", "wrong", "correct"],
    "totalQuestions": 3,
    "correctAnswers": 2
  }
}
```

## Common Test Scenarios

### Scenario 1: Tutor Creates Game and Assigns to Group
1. Get tutor ID
2. Create game → Copy game ID
3. Get/Create group → Copy group ID
4. Create assignment (need to do this via Supabase UI for now):
   ```sql
   INSERT INTO "Assignment" ("gameId", "groupId", "dueDate", "passPercentage")
   VALUES ('game-id', 'group-id', NOW() + INTERVAL '7 days', 70);
   ```

### Scenario 2: Student Joins Group and Completes Assignment
1. Get student ID
2. Get join code (e.g., MATH001)
3. Use "Join Group with Code" → Student joins
4. Use "Get Student Assignments" → See the assignment
5. Get assignment ID
6. Use "Save Test Attempt" → Record completion

### Scenario 3: Check Progress
1. Use "Get Student Stats" → See totals
2. Use "Get Student Personal Bests" → Best scores per game
3. Use "Get Progress Trends" → Performance over time

## Troubleshooting

### "Foreign key violation"
- Check that IDs exist in parent tables
- Ensure tutor/student/group IDs are valid

### "Not found" or null results
- Check ID is correct (copy from Supabase)
- Ensure test data was loaded successfully

### "RLS policy violation"
- Supabase has Row Level Security enabled
- For testing, you might need to disable RLS temporarily:
  ```sql
  ALTER TABLE "Game" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "Group" DISABLE ROW LEVEL SECURITY;
  -- etc for other tables
  ```

### JSON parse errors
- Check that gameData is valid JSON string
- Check that attemptData is valid JSON string

## Quick Reference: Sample IDs

After running test data, your IDs will look like:

```
Tutor ID: clxxxxx1234567890abcdef (from Supabase Auth)
Student ID: clxxxxx9876543210fedcba (from Supabase Auth)
Group ID: clxxxxx1111222233334444
Game ID: clxxxxx5555666677778888
Assignment ID: clxxxxx9999aaabbbcccddd
Join Code: MATH001, SCI002, ENG003
```

## Next Steps

After testing the API page:
1. Replace old service imports in your app:
   ```typescript
   // Old
   import * as gameService from '@/services/game.service';

   // New
   import * as gameService from '@/services/supabase/game.service';
   ```

2. Test in your actual UI
3. Remove old localStorage-based services
4. Enable RLS policies for production
