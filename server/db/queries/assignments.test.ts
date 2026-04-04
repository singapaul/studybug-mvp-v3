import { describe, test, expect } from 'bun:test'
import * as schema from '../schema'
import {
  createAssignment,
  deleteAssignment,
  updateAssignment,
  getGroupAssignments,
  isGameAssignedToGroup,
  getStudentAssignments,
  getStudentAssignmentById,
  getStudentStats,
} from './assignments'
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

async function seedGame(db: TestDB, tutorId: string, name = 'Test Game') {
  const [game] = await db
    .insert(schema.games)
    .values({ tutorId, name, gameType: 'FLASHCARDS', gameData: { cards: [] } })
    .returning()
  return game
}

async function seedGroup(db: TestDB, tutorId: string, joinCode = 'ABC123') {
  const [group] = await db
    .insert(schema.groups)
    .values({ tutorId, name: 'Test Group', joinCode })
    .returning()
  return group
}

describe('createAssignment', () => {
  test('creates assignment and returns it with nested game and group', async () => {
    const db = await createTestDb()
    const { tutor } = await seedTutor(db)
    const game = await seedGame(db, tutor.id)
    const group = await seedGroup(db, tutor.id)
    const result = await createAssignment(db, { gameId: game.id, groupId: group.id })
    expect(result.id).toBeTruthy()
    expect(result.gameId).toBe(game.id)
    expect(result.groupId).toBe(group.id)
    expect(result.game.name).toBe('Test Game')
    expect(result.group.name).toBe('Test Group')
  })

  test('sets dueDate and passPercentage when provided', async () => {
    const db = await createTestDb()
    const { tutor } = await seedTutor(db)
    const game = await seedGame(db, tutor.id)
    const group = await seedGroup(db, tutor.id)
    const dueDate = new Date('2026-06-01')
    const result = await createAssignment(db, { gameId: game.id, groupId: group.id, dueDate, passPercentage: 80 })
    expect(result.dueDate).toEqual(dueDate)
    expect(result.passPercentage).toBe(80)
  })
})

describe('deleteAssignment', () => {
  test('returns true and removes assignment when tutor owns the group', async () => {
    const db = await createTestDb()
    const { tutor } = await seedTutor(db)
    const game = await seedGame(db, tutor.id)
    const group = await seedGroup(db, tutor.id)
    const assignment = await createAssignment(db, { gameId: game.id, groupId: group.id })
    const deleted = await deleteAssignment(db, assignment.id, tutor.id)
    expect(deleted).toBe(true)
  })

  test('returns false for unknown assignment', async () => {
    const db = await createTestDb()
    const { tutor } = await seedTutor(db)
    const result = await deleteAssignment(db, '00000000-0000-0000-0000-000000000000', tutor.id)
    expect(result).toBe(false)
  })

  test('returns false when assignment belongs to another tutor', async () => {
    const db = await createTestDb()
    const { tutor: tutor1 } = await seedTutor(db, 'clerk_t1', 'tutor1@example.com')
    const { tutor: tutor2 } = await seedTutor(db, 'clerk_t2', 'tutor2@example.com')
    const game = await seedGame(db, tutor1.id)
    const group = await seedGroup(db, tutor1.id, 'GRP111')
    const assignment = await createAssignment(db, { gameId: game.id, groupId: group.id })
    const result = await deleteAssignment(db, assignment.id, tutor2.id)
    expect(result).toBe(false)
  })
})

describe('updateAssignment', () => {
  test('updates dueDate', async () => {
    const db = await createTestDb()
    const { tutor } = await seedTutor(db)
    const game = await seedGame(db, tutor.id)
    const group = await seedGroup(db, tutor.id)
    const assignment = await createAssignment(db, { gameId: game.id, groupId: group.id })
    const newDate = new Date('2026-12-31')
    const result = await updateAssignment(db, assignment.id, tutor.id, { dueDate: newDate })
    expect(result).not.toBeNull()
    expect(result!.dueDate).toEqual(newDate)
  })

  test('returns null for unknown assignment', async () => {
    const db = await createTestDb()
    const { tutor } = await seedTutor(db)
    const result = await updateAssignment(db, '00000000-0000-0000-0000-000000000000', tutor.id, { passPercentage: 70 })
    expect(result).toBeNull()
  })
})

describe('getGroupAssignments', () => {
  test('returns all assignments for a group', async () => {
    const db = await createTestDb()
    const { tutor } = await seedTutor(db)
    const game = await seedGame(db, tutor.id)
    const group = await seedGroup(db, tutor.id)
    await createAssignment(db, { gameId: game.id, groupId: group.id })
    await createAssignment(db, { gameId: game.id, groupId: group.id })
    const result = await getGroupAssignments(db, group.id, tutor.id)
    expect(result).toHaveLength(2)
  })

  test('returns empty array for group with no assignments', async () => {
    const db = await createTestDb()
    const { tutor } = await seedTutor(db)
    const group = await seedGroup(db, tutor.id)
    const result = await getGroupAssignments(db, group.id, tutor.id)
    expect(result).toHaveLength(0)
  })
})

describe('isGameAssignedToGroup', () => {
  test('returns true when assignment exists', async () => {
    const db = await createTestDb()
    const { tutor } = await seedTutor(db)
    const game = await seedGame(db, tutor.id)
    const group = await seedGroup(db, tutor.id)
    await createAssignment(db, { gameId: game.id, groupId: group.id })
    const result = await isGameAssignedToGroup(db, game.id, group.id)
    expect(result).toBe(true)
  })

  test('returns false when no assignment exists', async () => {
    const db = await createTestDb()
    const { tutor } = await seedTutor(db)
    const game = await seedGame(db, tutor.id)
    const group = await seedGroup(db, tutor.id)
    const result = await isGameAssignedToGroup(db, game.id, group.id)
    expect(result).toBe(false)
  })
})

describe('getStudentAssignments', () => {
  test('returns empty array when student has no group memberships', async () => {
    const db = await createTestDb()
    const { student } = await seedStudent(db)
    const result = await getStudentAssignments(db, student.id)
    expect(result).toHaveLength(0)
  })

  test('returns assignments for groups the student belongs to', async () => {
    const db = await createTestDb()
    const { tutor } = await seedTutor(db)
    const { student } = await seedStudent(db)
    const game = await seedGame(db, tutor.id)
    const group = await seedGroup(db, tutor.id)
    await db.insert(schema.groupMembers).values({ groupId: group.id, studentId: student.id })
    await createAssignment(db, { gameId: game.id, groupId: group.id })
    const result = await getStudentAssignments(db, student.id)
    expect(result).toHaveLength(1)
    expect(result[0].attemptCount).toBe(0)
    expect(result[0].isCompleted).toBe(false)
  })
})

describe('getStudentAssignmentById', () => {
  test('returns null for unknown assignment', async () => {
    const db = await createTestDb()
    const { student } = await seedStudent(db)
    const result = await getStudentAssignmentById(db, student.id, '00000000-0000-0000-0000-000000000000')
    expect(result).toBeNull()
  })

  test('returns assignment with game data and attempt info', async () => {
    const db = await createTestDb()
    const { tutor } = await seedTutor(db)
    const { student } = await seedStudent(db)
    const game = await seedGame(db, tutor.id)
    const group = await seedGroup(db, tutor.id)
    await db.insert(schema.groupMembers).values({ groupId: group.id, studentId: student.id })
    const assignment = await createAssignment(db, { gameId: game.id, groupId: group.id })
    const result = await getStudentAssignmentById(db, student.id, assignment.id)
    expect(result).not.toBeNull()
    expect(result!.game.id).toBe(game.id)
    expect(result!.attemptCount).toBe(0)
  })
})

describe('getStudentStats', () => {
  test('returns zero stats for student with no activity', async () => {
    const db = await createTestDb()
    const { student } = await seedStudent(db)
    const result = await getStudentStats(db, student.id)
    expect(result.totalGroups).toBe(0)
    expect(result.totalAssignments).toBe(0)
    expect(result.completedAssignments).toBe(0)
    expect(result.averageScore).toBe(0)
  })

  test('counts groups and assignments correctly', async () => {
    const db = await createTestDb()
    const { tutor } = await seedTutor(db)
    const { student } = await seedStudent(db)
    const game = await seedGame(db, tutor.id)
    const group = await seedGroup(db, tutor.id)
    await db.insert(schema.groupMembers).values({ groupId: group.id, studentId: student.id })
    await createAssignment(db, { gameId: game.id, groupId: group.id })
    const result = await getStudentStats(db, student.id)
    expect(result.totalGroups).toBe(1)
    expect(result.totalAssignments).toBe(1)
  })
})
