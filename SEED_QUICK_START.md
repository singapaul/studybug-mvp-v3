# Seed Data - Quick Start Guide

## Running the Seed

```bash
# Seed the database
npm run seed

# Or use alternative commands
npm run seed:reset
npm run db:seed
```

## Test Accounts

### Tutors
- **tutor1@example.com** - Math teacher with 2 groups, 3 games
- **tutor2@example.com** - Science teacher with 1 group, 2 games

### Students
- **student1@example.com** - Emma Wilson (Grade 5, in 2 groups)
- **student2@example.com** - Liam Brown (Grade 5)
- **student3@example.com** - Olivia Martinez (Grade 5, in 2 groups)
- **student4@example.com** - Noah Garcia (Grade 5)
- **student5@example.com** - Ava Davis (Grade 6, in 2 groups)
- **student6@example.com** - Ethan Rodriguez (Grade 6)
- **student7@example.com** - Sophia Lopez (Grade 6, in 2 groups)
- **student8@example.com** - Mason Gonzalez (Grade 7)

### Password
All accounts use password: **demo123**

## Join Codes

- **MATH01** - Grade 5 Math (4 students)
- **ALG101** - Algebra Basics (3 students)
- **SCI999** - Science Explorers (5 students)

## What's Included

### Games (5 total - all types)
1. **Multiplication Tables** (PAIRS) - 12 pairs
2. **States and Capitals** (FLASHCARDS) - 20 cards
3. **Fractions Quiz** (MULTIPLE_CHOICE) - 10 questions
4. **Quick Math** (SPLAT) - 15 questions, 8s timer
5. **True or False Science** (SWIPE) - 20 statements

### Assignments (8 total)
- **2** past due assignments (mixed completion)
- **1** due today (some completed)
- **2** due soon (1-3 days)
- **3** future assignments (5-7 days)

### Game Attempts (18 total)
- Scores ranging from 47% to 100%
- Multiple attempts showing improvement
- Mix of passed and failed attempts
- Realistic completion times

## Quick Test Scenarios

### As Tutor (tutor1@example.com)
1. View dashboard - see 2 groups, 3 games
2. Click "Groups" - see Grade 5 Math (4 members)
3. Click group - see assignments and member list
4. Click "Games" - see all 3 games you created
5. Preview a game - play it in preview mode

### As Student (student1@example.com)
1. View dashboard - see 2 groups, upcoming assignments
2. Click "Play" on an assignment - complete the game
3. Go to "My Scores" - see your attempt history
4. Join new group using code: **ALG101**

### Test Multiple Attempts
- Login as **student3@example.com**
- See Assignment 1 (Multiplication Tables)
- View attempts: 58% (failed) → 75% (passed)
- Shows improvement over time

### Test Perfect Score
- Login as **student1@example.com**
- See Assignment 1 (Multiplication Tables)
- View attempt: 100% (perfect score)

### Test Future Assignment Early Completion
- Login as **student3@example.com**
- See Assignment 5 (True or False Science) - due in 3 days
- Already completed with 100% score (eager student)

## Database Stats

```
✅ Users: 10 (2 tutors, 8 students)
✅ Groups: 3
✅ Group Members: 12 (overlapping membership)
✅ Games: 5 (all types covered)
✅ Assignments: 8 (varied states)
✅ Game Attempts: 18 (realistic data)
```

## Troubleshooting

### Seed fails with "passwordHash" error
- Make sure Prisma client is generated: `npm run db:generate`

### Seed fails with "unique constraint"
- The seed script auto-clears the database first
- If still failing, try: `npm run seed:reset`

### No data showing in app
- Check that seed completed successfully (should see ✅ messages)
- Try running seed again
- Check database with: `npm run db:studio`

## Next Steps

1. ✅ Run seed: `npm run seed`
2. ✅ Start dev server: `npm run dev`
3. ✅ Login with tutor1@example.com or student1@example.com
4. ✅ Explore the app with realistic data!

For detailed documentation, see `SEED_DATA_DOCUMENTATION.md`
