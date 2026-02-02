# Database Seed Script Documentation

## Overview

Comprehensive seed script that populates the SQLite database with realistic demo data for development and testing.

## Running the Seed

### Seed the database
```bash
npm run seed
```

### Reset and reseed the database
```bash
npm run seed:reset
```

### Alternative command
```bash
npm run db:seed
```

## What Gets Created

### 1. Users & Profiles (10 total)

#### Tutors (2)
- **Sarah Johnson** (tutor1@example.com)
  - Math Teacher at Lincoln Elementary
  - Subject: Mathematics
  - Groups: Grade 5 Math, Algebra Basics
  - Games: Multiplication Tables, States and Capitals, Fractions Quiz

- **Michael Chen** (tutor2@example.com)
  - Science Teacher at Roosevelt Middle School
  - Subject: Science
  - Groups: Science Explorers
  - Games: Quick Math, True or False Science

#### Students (8)
1. **Emma Wilson** (student1@example.com) - Grade 5
2. **Liam Brown** (student2@example.com) - Grade 5
3. **Olivia Martinez** (student3@example.com) - Grade 5
4. **Noah Garcia** (student4@example.com) - Grade 5
5. **Ava Davis** (student5@example.com) - Grade 6
6. **Ethan Rodriguez** (student6@example.com) - Grade 6
7. **Sophia Lopez** (student7@example.com) - Grade 6
8. **Mason Gonzalez** (student8@example.com) - Grade 7

### 2. Groups (3)

#### Grade 5 Math
- **Tutor**: Sarah Johnson
- **Join Code**: MATH01
- **Age Range**: 10-11
- **Subject**: Mathematics
- **Members**: 4 students (Emma, Liam, Olivia, Noah)

#### Algebra Basics
- **Tutor**: Sarah Johnson
- **Join Code**: ALG101
- **Age Range**: 11-12
- **Subject**: Mathematics
- **Members**: 3 students (Ava, Ethan, Sophia)

#### Science Explorers
- **Tutor**: Michael Chen
- **Join Code**: SCI999
- **Age Range**: 10-12
- **Subject**: Science
- **Members**: 5 students (Emma, Olivia, Ava, Sophia, Mason)
- **Note**: Some students overlap with other groups

### 3. Games (5 - covering all types)

#### 1. Multiplication Tables (PAIRS)
- **Tutor**: Sarah Johnson
- **Type**: Pairs
- **Content**: 12 multiplication pairs (3×4=12, 6×7=42, etc.)
- **Description**: Match multiplication problems with their answers

#### 2. States and Capitals (FLASHCARDS)
- **Tutor**: Sarah Johnson
- **Type**: Flashcards
- **Content**: 20 US state capitals (California → Sacramento, etc.)
- **Description**: Learn US state capitals

#### 3. Fractions Quiz (MULTIPLE_CHOICE)
- **Tutor**: Sarah Johnson
- **Type**: Multiple Choice
- **Content**: 10 fraction questions with 4 options each
- **Description**: Test your knowledge of fractions

#### 4. Quick Math (SPLAT)
- **Tutor**: Michael Chen
- **Type**: Splat
- **Content**: 15 quick math questions
- **Time Limit**: 8 seconds per question
- **Description**: Answer fast! Test your quick thinking

#### 5. True or False Science (SWIPE)
- **Tutor**: Michael Chen
- **Type**: Swipe
- **Content**: 20 true/false science statements
- **Description**: Swipe right for true, left for false

### 4. Assignments (8 - varied states)

| # | Game | Group | Due Date | Pass % | Status |
|---|------|-------|----------|--------|--------|
| 1 | Multiplication Tables | Grade 5 Math | -5 days | 70% | Past due, mixed completion |
| 2 | States and Capitals | Grade 5 Math | -2 days | 75% | Past due, partial completion |
| 3 | Fractions Quiz | Algebra Basics | Today | 80% | Due today, some complete |
| 4 | Quick Math | Science Explorers | +1 day | 60% | Due tomorrow, early birds |
| 5 | True or False Science | Science Explorers | +3 days | 70% | Future, one eager student |
| 6 | Fractions Quiz | Grade 5 Math | +7 days | 70% | Future, not started |
| 7 | Multiplication Tables | Algebra Basics | -10 days | 70% | Past, 100% completion |
| 8 | Quick Math | Science Explorers | +5 days | 65% | Future, not started |

### 5. Game Attempts (18 - realistic variety)

#### Distribution by Assignment:
- **Assignment 1** (Multiplication - Past due): 4 attempts
  - Emma Wilson: 100% (Perfect!)
  - Liam Brown: 83%
  - Olivia Martinez: 58% (failed) → 75% (passed on retry)

- **Assignment 2** (Flashcards - Past due): 4 attempts
  - Emma Wilson: 65% → 85% (improving)
  - Liam Brown: 80%
  - Noah Garcia: 95% (excellent)

- **Assignment 3** (Multiple Choice - Due today): 2 attempts
  - Ava Davis: 90%
  - Ethan Rodriguez: 70%

- **Assignment 4** (Splat - Due tomorrow): 3 attempts
  - Sophia Lopez: 87% (fast and accurate)
  - Emma Wilson: 73%
  - Ava Davis: 47% (needs retry)

- **Assignment 5** (Swipe - Future): 2 attempts
  - Olivia Martinez: 100% (perfect, eager student)
  - Sophia Lopez: 75%

- **Assignment 7** (Pairs - Past, 100% complete): 3 attempts
  - Ava Davis: 92%
  - Ethan Rodriguez: 100% (perfect)
  - Sophia Lopez: 83%

#### Score Distribution:
- Perfect scores (100%): 3 attempts
- Excellent (90-99%): 2 attempts
- Good (80-89%): 4 attempts
- Passing (70-79%): 4 attempts
- Below passing (<70%): 5 attempts

#### Multiple Attempts:
- Emma Wilson: 4 attempts across 2 assignments (showing improvement)
- Olivia Martinez: 3 attempts (one failure, then success, then perfect)
- Sophia Lopez: 3 attempts (varied performance)

## Data Characteristics

### Realistic Features

#### 1. Varied Due Dates
- Past due assignments (5, 2, 10 days ago)
- Due today
- Due soon (tomorrow, 3 days, 5 days)
- Due later (7 days)

#### 2. Completion States
- 0% completion (not started)
- Partial completion (some students finished)
- 100% completion (all students finished)
- Mixed scores (some passed, some failed)

#### 3. Student Behaviors
- **Eager students**: Complete assignments early
- **Struggling students**: Multiple attempts, low scores
- **Improving students**: Better scores on retries
- **Excellent students**: High scores, fast completion
- **Procrastinators**: Complete on due date

#### 4. Score Patterns
- Realistic distribution (40-100%)
- Multiple attempts showing improvement
- Some perfect scores
- Some failing scores requiring retries

#### 5. Time Patterns
- Fast completions (3-4 minutes)
- Moderate completions (5-7 minutes)
- Slow completions (7-8 minutes)
- Realistic variation by game type

### Edge Cases Included

#### 1. Group Membership
- Students in multiple groups (Emma, Olivia, Ava, Sophia)
- Different group sizes (3, 4, 5 students)

#### 2. Assignment Completion
- Past due with no attempts
- Past due with partial completion
- Future with early completion (eager students)
- Due today with mixed status

#### 3. Multiple Attempts
- Failed then passed (Olivia - Assignment 1)
- Improving scores (Emma - Assignment 2: 65% → 85%)
- Multiple students same assignment

#### 4. Score Scenarios
- Perfect score on first try
- Failed score requiring retry
- Just passing (70-75%)
- Excellent scores (90-100%)

## Usage Examples

### Testing Tutor Features

1. **Login as Sarah Johnson**
   ```
   Email: tutor1@example.com
   ```

2. **View Dashboard**
   - See 2 groups
   - See 3 games
   - See recent activity

3. **View Groups**
   - "Grade 5 Math" - 4 members
   - "Algebra Basics" - 3 members
   - View member lists
   - See assignments per group

4. **View Games**
   - 3 games created
   - Preview each game
   - See assignment count

5. **View Assignments**
   - Past due assignments with completion stats
   - Upcoming assignments
   - Completion rates

### Testing Student Features

1. **Login as Emma Wilson**
   ```
   Email: student1@example.com
   ```

2. **View Dashboard**
   - See 2 groups (Grade 5 Math, Science Explorers)
   - See upcoming assignments
   - View recent scores

3. **Join New Group**
   ```
   Join Code: ALG101
   ```
   - Should successfully join "Algebra Basics"

4. **Play Games**
   - Start assignment
   - Complete game
   - View score
   - See improvement on retry

5. **View My Scores**
   - See all attempts
   - View score history
   - See improvement over time

## Testing Scenarios

### 1. Assignment Lifecycle

#### Past Due (Assignment 1)
- View on tutor dashboard as overdue
- See completion stats (3/4 students)
- View individual attempts
- See who passed vs failed

#### Due Today (Assignment 3)
- Highlighted in both tutor and student dashboards
- Some students already completed
- Others still need to complete

#### Future (Assignment 5)
- Visible in upcoming assignments
- One eager student already completed
- Others haven't started

### 2. Student Progress Tracking

#### Emma Wilson (High Performer)
- Multiple attempts showing improvement
- Perfect score on Multiplication Tables
- 65% → 85% improvement on Flashcards
- Active in multiple groups

#### Olivia Martinez (Improving Student)
- Failed first attempt (58%)
- Passed on retry (75%)
- Perfect score later (100% on Swipe)
- Shows growth over time

#### Ava Davis (Mixed Performance)
- Excellent score on Multiple Choice (90%)
- Good score on Pairs (92%)
- Low score on Splat (47%) - needs retry

### 3. Group Management

#### Multiple Groups
- Students can be in multiple groups
- Tutors can manage multiple groups
- Join codes work correctly

#### Group Size Variety
- Small group: 3 students (Algebra Basics)
- Medium group: 4 students (Grade 5 Math)
- Larger group: 5 students (Science Explorers)

### 4. Game Type Coverage

Test all 5 game types:
1. **Pairs**: Matching game
2. **Flashcards**: Memory/learning
3. **Multiple Choice**: Quiz format
4. **Splat**: Timed quick answers
5. **Swipe**: True/false judgment

## Database Statistics

```
Users: 10 (2 tutors, 8 students)
Groups: 3
Group Members: 12 (some students in multiple groups)
Games: 5 (one of each type)
Assignments: 8 (varied states)
Game Attempts: 18 (varied scores and times)
```

## Technical Details

### ID Generation
- Uses timestamp + random alphanumeric
- Format: `{prefix}_{timestamp}_{random}`
- Example: `user_1234567890_abc123def`

### Date Handling
- Helper function `addDays()` for date math
- All dates stored as JavaScript Date objects
- Realistic past and future dates

### Faker.js Usage
- Random join dates within realistic ranges
- Could be extended for more randomization
- Currently uses controlled data for consistency

### Game Data Structure
- Stored as JSON strings in `gameData` field
- Type-specific structure for each game type
- Realistic content (actual states, math problems, etc.)

### Attempt Data
- Game-specific `attemptData` structure
- Includes moves, timing, answers
- Realistic performance metrics

## Extending the Seed Data

### Adding More Tutors
```typescript
const tutor3User = await prisma.user.create({
  data: {
    id: generateId('user'),
    email: 'tutor3@example.com',
    role: 'TUTOR',
  },
});

const tutor3 = await prisma.tutor.create({
  data: {
    id: generateId('tutor'),
    userId: tutor3User.id,
    firstName: 'Your',
    lastName: 'Name',
    schoolName: 'Your School',
    subjectArea: 'Your Subject',
  },
});
```

### Adding More Students
```typescript
// Add to studentNames array
{ first: 'NewFirst', last: 'NewLast' }

// Increase loop count
for (let i = 0; i < 9; i++) { // Changed from 8 to 9
  // ... student creation code
}
```

### Adding More Games
```typescript
const newGame = await prisma.game.create({
  data: {
    id: generateId('game'),
    tutorId: tutor1.id,
    name: 'Your Game Name',
    gameType: GameType.YOUR_TYPE,
    gameData: JSON.stringify({
      description: 'Your description',
      items: [/* your items */],
    }),
  },
});
```

### Adding More Assignments
```typescript
const newAssignment = await prisma.assignment.create({
  data: {
    id: generateId('assignment'),
    gameId: yourGame.id,
    groupId: yourGroup.id,
    dueDate: addDays(today, 3), // 3 days from now
    passPercentage: 70,
  },
});
```

## Best Practices

### 1. Clear Before Seeding
- Script automatically deletes all existing data
- Ensures clean state
- Prevents duplicate key errors

### 2. Ordered Deletion
- Delete in reverse dependency order
- GameAttempts → Assignments → GroupMembers → Games → Groups → Students/Tutors → Users

### 3. Realistic Data
- Use actual educational content
- Realistic scores and times
- Varied student behaviors

### 4. Test Coverage
- Cover all game types
- Include edge cases
- Test different user scenarios

## Troubleshooting

### Error: "Unique constraint failed"
- Run `npm run seed:reset` to clear database first
- Check for duplicate join codes
- Ensure IDs are unique

### Error: "Foreign key constraint failed"
- Check deletion order (must delete children before parents)
- Verify tutorId/studentId/groupId references exist
- Ensure all IDs are properly generated

### Error: "Cannot find module"
- Run `npm install` to ensure all dependencies installed
- Check that `@faker-js/faker` is installed
- Verify `tsx` is in devDependencies

### Seed Takes Long Time
- Normal for 10+ users, 5 games, 18 attempts
- Should complete in 5-10 seconds
- If longer, check database connection

## Summary

The seed script creates a comprehensive, realistic dataset for:
- ✅ Development testing
- ✅ Demo presentations
- ✅ Feature validation
- ✅ UI/UX testing
- ✅ Performance testing
- ✅ Edge case validation

All data is consistent, realistic, and covers the full range of application features.

**Quick Start**: `npm run seed`
