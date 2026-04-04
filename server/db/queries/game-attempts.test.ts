import { describe, test, expect } from 'bun:test'
import * as schema from '../schema'
import {
  createAttempt,
  getAttemptsByStudent,
  getAttemptById,
  getAssignmentAttempts,
  getBestAttempt,
} from './game-attempts'
import { createAssignment } from './assignments'
import { createTestDb } from '../test-helpers'

type TestDB = Awaited<ReturnType<typeof createTestDb>>

async function seedTutor(db: TestDB, clerkId = 'clerk_t1', email = 'tutor@example.com') {
  const [user] = await db.insert(schema.users).values({ clerkId, email, role: 'TUTOR' }).returning()
  const [tutor] = await db.insert(schema.tutors).values({ userId: user.id }).returning()
  return { user, tutor }
}

async function seedStudent(db: TestDB, clerkId = 'clerk_s1', email = 'student@example.com') {
  const [user] = await db.insert(schema.users).values({ clerkId, email, role: 'STUDENT' }).returning()
  const [student] = await db.insert(schema.students).values({ userId: user.id }).returning()
  return { user, student }
}

async function seedAssignment(db: TestDB, tutorId: string) {
  const [game] = await db
    .insert(schema.games)
    .values({ tutorId, name: 'Test Game', gameType: 'PAIRS', gameData: { items: [] } })
    .returning()
  const [group] = await db
    .insert(schema.groups)
    .values({ tutorId, name: 'Test Group', joinCode: 'TST123' })
    .returning()
  return createAssignment(db, { gameId: game.id, groupId: group.id })
}

describe('createAttempt', () => {
  test('creates attempt and returns it', async () => {
    const db = await createTestDb()
    const { tutor } = await seedTutor(db)
    const { student } = await seedStudent(db)
    const assignment = await seedAssignment(db, tutor.id)
    const result = await createAttempt(db, {
      studentId: student.id,
      assignmentId: assignment.id,
      scorePercentage: 85,
      timeTaken: 120,
      attemptData: { answers: [] },
    })
    expect(result.id).toBeTruthy()
    expect(result.studentId).toBe(student.id)
    expect(result.scorePercentage).toBe(85)
    expect(result.timeTaken).toBe(120)
    expect(result.completedAt).toBeInstanceOf(Date)
  })

  test('persists attempt to database', async () => {
    const db = await createTestDb()
    const { tutor } = await seedTutor(db)
    const { student } = await seedStudent(db)
    const assignment = await seedAssignment(db, tutor.id)
    const created = await createAttempt(db, {
      studentId: student.id,
      assignmentId: assignment.id,
      scorePercentage: 70,
      timeTaken: 90,
      attemptData: {},
    })
    const found = await getAttemptById(db, created.id, student.id)
    expect(found).not.toBeNull()
    expect(found!.scorePercentage).toBe(70)
  })
})

describe('getAttemptsByStudent', () => {
  test('returns empty array when student has no attempts', async () => {
    const db = await createTestDb()
    const { student } = await seedStudent(db)
    const result = await getAttemptsByStudent(db, student.id)
    expect(result).toHaveLength(0)
  })

  test('returns all attempts for a student', async () => {
    const db = await createTestDb()
    const { tutor } = await seedTutor(db)
    const { student } = await seedStudent(db)
    const assignment = await seedAssignment(db, tutor.id)
    await createAttempt(db, { studentId: student.id, assignmentId: assignment.id, scorePercentage: 60, timeTaken: 100, attemptData: {} })
    await createAttempt(db, { studentId: student.id, assignmentId: assignment.id, scorePercentage: 80, timeTaken: 90, attemptData: {} })
    const result = await getAttemptsByStudent(db, student.id)
    expect(result).toHaveLength(2)
  })

  test('does not return attempts from other students', async () => {
    const db = await createTestDb()
    const { tutor } = await seedTutor(db)
    const { student: s1 } = await seedStudent(db, 'clerk_s1', 's1@example.com')
    const { student: s2 } = await seedStudent(db, 'clerk_s2', 's2@example.com')
    const assignment = await seedAssignment(db, tutor.id)
    await createAttempt(db, { studentId: s1.id, assignmentId: assignment.id, scorePercentage: 75, timeTaken: 60, attemptData: {} })
    const result = await getAttemptsByStudent(db, s2.id)
    expect(result).toHaveLength(0)
  })
})

describe('getAttemptById', () => {
  test('returns null for unknown attempt', async () => {
    const db = await createTestDb()
    const { student } = await seedStudent(db)
    const result = await getAttemptById(db, '00000000-0000-0000-0000-000000000000', student.id)
    expect(result).toBeNull()
  })

  test('returns null when attempt belongs to another student', async () => {
    const db = await createTestDb()
    const { tutor } = await seedTutor(db)
    const { student: s1 } = await seedStudent(db, 'clerk_s1', 's1@example.com')
    const { student: s2 } = await seedStudent(db, 'clerk_s2', 's2@example.com')
    const assignment = await seedAssignment(db, tutor.id)
    const attempt = await createAttempt(db, { studentId: s1.id, assignmentId: assignment.id, scorePercentage: 90, timeTaken: 80, attemptData: {} })
    const result = await getAttemptById(db, attempt.id, s2.id)
    expect(result).toBeNull()
  })
})

describe('getAssignmentAttempts', () => {
  test('returns attempts for a specific assignment and student', async () => {
    const db = await createTestDb()
    const { tutor } = await seedTutor(db)
    const { student } = await seedStudent(db)
    const assignment = await seedAssignment(db, tutor.id)
    await createAttempt(db, { studentId: student.id, assignmentId: assignment.id, scorePercentage: 50, timeTaken: 100, attemptData: {} })
    const result = await getAssignmentAttempts(db, student.id, assignment.id)
    expect(result).toHaveLength(1)
    expect(result[0].assignmentId).toBe(assignment.id)
  })
})

describe('getBestAttempt', () => {
  test('returns null when no attempts exist', async () => {
    const db = await createTestDb()
    const { tutor } = await seedTutor(db)
    const { student } = await seedStudent(db)
    const assignment = await seedAssignment(db, tutor.id)
    const result = await getBestAttempt(db, student.id, assignment.id)
    expect(result).toBeNull()
  })

  test('returns the attempt with the highest score', async () => {
    const db = await createTestDb()
    const { tutor } = await seedTutor(db)
    const { student } = await seedStudent(db)
    const assignment = await seedAssignment(db, tutor.id)
    await createAttempt(db, { studentId: student.id, assignmentId: assignment.id, scorePercentage: 60, timeTaken: 100, attemptData: {} })
    await createAttempt(db, { studentId: student.id, assignmentId: assignment.id, scorePercentage: 95, timeTaken: 80, attemptData: {} })
    await createAttempt(db, { studentId: student.id, assignmentId: assignment.id, scorePercentage: 70, timeTaken: 90, attemptData: {} })
    const result = await getBestAttempt(db, student.id, assignment.id)
    expect(result!.scorePercentage).toBe(95)
  })
})
