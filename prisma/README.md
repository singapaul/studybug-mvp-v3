# StudyBug Database Schema

This document describes the Prisma database schema for the StudyBug educational platform.

## Database Provider

SQLite (for development and MVP)

## Schema Overview

### User Management

#### User
Core user table with authentication information.
- **id**: Unique identifier (CUID)
- **email**: Unique email address (indexed)
- **passwordHash**: Bcrypt password hash
- **role**: TUTOR or STUDENT enum
- **emailVerified**: Boolean flag for email verification
- **timestamps**: createdAt, updatedAt

#### Tutor
Extended profile for tutor users.
- **id**: Unique identifier
- **userId**: One-to-one relation with User (CASCADE delete)
- **subscriptionStatus**: FREE, ACTIVE, CANCELLED, or EXPIRED
- **timestamps**: createdAt, updatedAt

#### Student
Extended profile for student users.
- **id**: Unique identifier
- **userId**: One-to-one relation with User (CASCADE delete)
- **timestamps**: createdAt, updatedAt

### Group Management

#### Group
Classes or student groups created by tutors.
- **id**: Unique identifier
- **tutorId**: Foreign key to Tutor (CASCADE delete)
- **name**: Group name (e.g., "Year 5 Mathematics")
- **ageRange**: Optional age range string
- **subjectArea**: Optional subject classification
- **joinCode**: Unique 6-character code for students to join (indexed)
- **timestamps**: createdAt, updatedAt

#### GroupMember
Junction table for student membership in groups (many-to-many).
- **id**: Unique identifier
- **groupId**: Foreign key to Group (CASCADE delete)
- **studentId**: Foreign key to Student (CASCADE delete)
- **joinedAt**: Timestamp of when student joined
- **Unique constraint**: (groupId, studentId) to prevent duplicate memberships

### Game & Assignment System

#### Game
Educational games/activities created by tutors.
- **id**: Unique identifier
- **tutorId**: Foreign key to Tutor (CASCADE delete)
- **name**: Game name
- **gameType**: PAIRS, FLASHCARDS, MULTIPLE_CHOICE, SPLAT, or SWIPE enum (indexed)
- **gameData**: JSON string containing game configuration and content
- **timestamps**: createdAt, updatedAt

#### Assignment
Games assigned to specific groups with optional due dates.
- **id**: Unique identifier
- **gameId**: Foreign key to Game (CASCADE delete)
- **groupId**: Foreign key to Group (CASCADE delete)
- **dueDate**: Optional deadline (indexed)
- **passPercentage**: Optional minimum pass score
- **timestamps**: createdAt, updatedAt

#### GameAttempt
Student attempts at completing assignments.
- **id**: Unique identifier
- **assignmentId**: Foreign key to Assignment (CASCADE delete)
- **studentId**: Foreign key to Student (CASCADE delete)
- **scorePercentage**: Score as percentage (Float)
- **timeTaken**: Time taken in seconds
- **completedAt**: Timestamp (indexed)
- **attemptData**: JSON string with detailed attempt results

## Key Features

### Indexes
Strategic indexes on frequently queried fields:
- User email
- Group tutorId and joinCode
- Game tutorId and gameType
- Assignment gameId, groupId, and dueDate
- GameAttempt assignmentId, studentId, and completedAt
- GroupMember groupId and studentId

### Cascade Deletes
All foreign keys use `onDelete: Cascade` to maintain referential integrity:
- Deleting a User cascades to Tutor/Student
- Deleting a Tutor cascades to Groups and Games
- Deleting a Group cascades to Assignments and GroupMembers
- Deleting a Game cascades to Assignments
- Deleting an Assignment cascades to GameAttempts

### JSON Fields
- **Game.gameData**: Stores game configuration (questions, answers, settings)
- **GameAttempt.attemptData**: Stores detailed results (answer history, timestamps)

## Usage

### Common Scripts

```bash
# Generate Prisma Client
npm run db:generate

# Create a new migration
npm run db:migrate

# Push schema changes without migration (dev only)
npm run db:push

# Open Prisma Studio (GUI database browser)
npm run db:studio

# Run seed script
npm run db:seed
```

### Example Queries

#### Create a new tutor with user
```typescript
import { prisma } from '@/lib/prisma';

const tutor = await prisma.user.create({
  data: {
    email: 'tutor@example.com',
    passwordHash: hashedPassword,
    role: 'TUTOR',
    tutor: {
      create: {
        subscriptionStatus: 'FREE',
      },
    },
  },
  include: {
    tutor: true,
  },
});
```

#### Create a group with join code
```typescript
const group = await prisma.group.create({
  data: {
    tutorId: tutorId,
    name: 'Year 5 Mathematics',
    ageRange: '9-10 years',
    subjectArea: 'Mathematics',
    joinCode: generateJoinCode(), // 6-char unique code
  },
});
```

#### Student joins group
```typescript
const membership = await prisma.groupMember.create({
  data: {
    groupId: groupId,
    studentId: studentId,
  },
});
```

#### Create game and assign to group
```typescript
const game = await prisma.game.create({
  data: {
    tutorId: tutorId,
    name: 'Times Tables Quiz',
    gameType: 'MULTIPLE_CHOICE',
    gameData: JSON.stringify({
      questions: [
        {
          question: 'What is 5 × 6?',
          options: ['25', '30', '35', '40'],
          correctIndex: 1,
        },
      ],
    }),
  },
});

const assignment = await prisma.assignment.create({
  data: {
    gameId: game.id,
    groupId: groupId,
    passPercentage: 70,
    dueDate: new Date('2024-12-31'),
  },
});
```

#### Record student attempt
```typescript
const attempt = await prisma.gameAttempt.create({
  data: {
    assignmentId: assignmentId,
    studentId: studentId,
    scorePercentage: 85.5,
    timeTaken: 240, // 4 minutes in seconds
    attemptData: JSON.stringify({
      answers: [
        { questionId: 1, selectedIndex: 1, correct: true, timeSpent: 15 },
      ],
    }),
  },
});
```

#### Get group leaderboard
```typescript
const leaderboard = await prisma.gameAttempt.findMany({
  where: {
    assignment: {
      groupId: groupId,
    },
  },
  include: {
    student: {
      include: {
        user: {
          select: {
            email: true,
          },
        },
      },
    },
  },
  orderBy: {
    scorePercentage: 'desc',
  },
  take: 10,
});
```

## Development

### Initial Setup
1. Ensure `.env` file exists with `DATABASE_URL="file:./dev.db"`
2. Run `npm run db:migrate` to create the database
3. Run `npm run db:seed` to populate with test data (optional)
4. Run `npm run db:studio` to browse the database

### Making Schema Changes
1. Edit `prisma/schema.prisma`
2. Run `npm run db:migrate` to create a migration
3. The Prisma Client will be regenerated automatically

## Production Considerations

When moving to production, consider:
- Migrating to PostgreSQL or MySQL for better concurrency
- Adding database connection pooling
- Implementing soft deletes for audit trails
- Adding more comprehensive indexes based on query patterns
- Implementing database backups
- Adding field-level validation constraints
- Consider splitting large JSON fields into separate tables
