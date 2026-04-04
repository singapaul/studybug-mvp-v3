import { describe, test, expect } from 'bun:test'
import * as schema from '../schema'
import {
  getGroupsByTutorId,
  getGroupById,
  getGroupByJoinCode,
  createGroup,
  updateGroup,
  deleteGroup,
  addStudentToGroup,
  removeStudentFromGroup,
  getGroupsByStudentId,
} from './groups'
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

async function seedGroup(
  db: TestDB,
  tutorId: string,
  overrides: Partial<{ name: string; joinCode: string; ageRange: string; subjectArea: string }> = {}
) {
  const [group] = await db
    .insert(schema.groups)
    .values({
      tutorId,
      name: overrides.name ?? 'Test Group',
      joinCode: overrides.joinCode ?? 'ABC123',
      ageRange: overrides.ageRange,
      subjectArea: overrides.subjectArea,
    })
    .returning()
  return group
}

async function seedGame(db: TestDB, tutorId: string) {
  const [game] = await db
    .insert(schema.games)
    .values({ tutorId, name: 'Test Game', gameType: 'FLASHCARDS', gameData: { cards: [] } })
    .returning()
  return game
}

describe('getGroupsByTutorId', () => {
  test('returns empty array for tutor with no groups', async () => {
    const db = await createTestDb()
    const { tutor } = await seedTutor(db)
    const result = await getGroupsByTutorId(db, tutor.id)
    expect(result).toEqual([])
  })

  test('returns all groups belonging to the tutor', async () => {
    const db = await createTestDb()
    const { tutor } = await seedTutor(db)
    await seedGroup(db, tutor.id, { name: 'Group A', joinCode: 'AAA111' })
    await seedGroup(db, tutor.id, { name: 'Group B', joinCode: 'BBB222' })
    const result = await getGroupsByTutorId(db, tutor.id)
    expect(result).toHaveLength(2)
    expect(result.every(g => g.tutorId === tutor.id)).toBe(true)
  })

  test('does not return groups belonging to another tutor', async () => {
    const db = await createTestDb()
    const { tutor: tutor1 } = await seedTutor(db, 'clerk_t1', 'tutor1@example.com')
    const { tutor: tutor2 } = await seedTutor(db, 'clerk_t2', 'tutor2@example.com')
    await seedGroup(db, tutor1.id, { joinCode: 'TTT111' })
    const result = await getGroupsByTutorId(db, tutor2.id)
    expect(result).toHaveLength(0)
  })

  test('returns memberCount = 0 when no members', async () => {
    const db = await createTestDb()
    const { tutor } = await seedTutor(db)
    await seedGroup(db, tutor.id, { joinCode: 'MMM111' })
    const result = await getGroupsByTutorId(db, tutor.id)
    expect(result[0].memberCount).toBe(0)
  })

  test('returns correct memberCount and assignmentCount', async () => {
    const db = await createTestDb()
    const { tutor } = await seedTutor(db)
    const { student } = await seedStudent(db)
    const group = await seedGroup(db, tutor.id, { joinCode: 'CNT123' })
    const game = await seedGame(db, tutor.id)
    await db.insert(schema.groupMembers).values({ groupId: group.id, studentId: student.id })
    await db.insert(schema.assignments).values({ groupId: group.id, gameId: game.id })
    const result = await getGroupsByTutorId(db, tutor.id)
    expect(result[0].memberCount).toBe(1)
    expect(result[0].assignmentCount).toBe(1)
  })
})

describe('getGroupById', () => {
  test('returns null for unknown groupId', async () => {
    const db = await createTestDb()
    const { tutor } = await seedTutor(db)
    const result = await getGroupById(db, '00000000-0000-0000-0000-000000000000', tutor.id)
    expect(result).toBeNull()
  })

  test('returns null when tutorId does not match (ownership guard)', async () => {
    const db = await createTestDb()
    const { tutor: tutor1 } = await seedTutor(db, 'clerk_t1', 'tutor1@example.com')
    const { tutor: tutor2 } = await seedTutor(db, 'clerk_t2', 'tutor2@example.com')
    const group = await seedGroup(db, tutor1.id, { joinCode: 'OWN111' })
    const result = await getGroupById(db, group.id, tutor2.id)
    expect(result).toBeNull()
  })

  test('returns group with members and assignments', async () => {
    const db = await createTestDb()
    const { tutor } = await seedTutor(db)
    const { student, user: studentUser } = await seedStudent(db)
    const group = await seedGroup(db, tutor.id, { name: 'Detail Group', joinCode: 'DET111' })
    const game = await seedGame(db, tutor.id)
    await db.insert(schema.groupMembers).values({ groupId: group.id, studentId: student.id })
    await db.insert(schema.assignments).values({ groupId: group.id, gameId: game.id })

    const result = await getGroupById(db, group.id, tutor.id)
    expect(result).not.toBeNull()
    expect(result!.name).toBe('Detail Group')
    expect(result!.members).toHaveLength(1)
    expect(result!.members[0].studentId).toBe(student.id)
    expect(result!.members[0].student.user.email).toBe(studentUser.email)
    expect(result!.assignments).toHaveLength(1)
    expect(result!.assignments[0].game.name).toBe('Test Game')
  })
})

describe('getGroupByJoinCode', () => {
  test('returns null for unknown join code', async () => {
    const db = await createTestDb()
    const result = await getGroupByJoinCode(db, 'XXXXXX')
    expect(result).toBeNull()
  })

  test('returns group for matching join code', async () => {
    const db = await createTestDb()
    const { tutor } = await seedTutor(db)
    await seedGroup(db, tutor.id, { joinCode: 'FIND99' })
    const result = await getGroupByJoinCode(db, 'FIND99')
    expect(result).not.toBeNull()
    expect(result!.joinCode).toBe('FIND99')
  })

  test('is case-insensitive', async () => {
    const db = await createTestDb()
    const { tutor } = await seedTutor(db)
    await seedGroup(db, tutor.id, { joinCode: 'CASE99' })
    const result = await getGroupByJoinCode(db, 'case99')
    expect(result).not.toBeNull()
  })
})

describe('createGroup', () => {
  test('creates group with generated join code', async () => {
    const db = await createTestDb()
    const { tutor } = await seedTutor(db)
    const result = await createGroup(db, { tutorId: tutor.id, name: 'New Group' })
    expect(result.id).toBeTruthy()
    expect(result.name).toBe('New Group')
    expect(result.joinCode).toBeTruthy()
    expect(result.joinCode).toHaveLength(6)
    expect(result.tutorId).toBe(tutor.id)
  })

  test('creates group with optional fields', async () => {
    const db = await createTestDb()
    const { tutor } = await seedTutor(db)
    const result = await createGroup(db, {
      tutorId: tutor.id,
      name: 'Maths Group',
      ageRange: '10-12',
      subjectArea: 'Mathematics',
    })
    expect(result.ageRange).toBe('10-12')
    expect(result.subjectArea).toBe('Mathematics')
  })

  test('persists group to database', async () => {
    const db = await createTestDb()
    const { tutor } = await seedTutor(db)
    const created = await createGroup(db, { tutorId: tutor.id, name: 'Persisted' })
    const found = await getGroupsByTutorId(db, tutor.id)
    expect(found.some(g => g.id === created.id)).toBe(true)
  })

  test('memberCount and assignmentCount are 0 for new group', async () => {
    const db = await createTestDb()
    const { tutor } = await seedTutor(db)
    const result = await createGroup(db, { tutorId: tutor.id, name: 'Empty' })
    expect(result.memberCount).toBe(0)
    expect(result.assignmentCount).toBe(0)
  })
})

describe('updateGroup', () => {
  test('updates group name', async () => {
    const db = await createTestDb()
    const { tutor } = await seedTutor(db)
    const group = await seedGroup(db, tutor.id, { joinCode: 'UPD111' })
    const result = await updateGroup(db, group.id, tutor.id, { name: 'Renamed' })
    expect(result).not.toBeNull()
    expect(result!.name).toBe('Renamed')
  })

  test('partial update preserves other fields', async () => {
    const db = await createTestDb()
    const { tutor } = await seedTutor(db)
    const group = await seedGroup(db, tutor.id, { joinCode: 'PAR111', ageRange: '8-10' })
    const result = await updateGroup(db, group.id, tutor.id, { name: 'New Name' })
    expect(result!.ageRange).toBe('8-10')
  })

  test('returns null for unknown groupId', async () => {
    const db = await createTestDb()
    const { tutor } = await seedTutor(db)
    const result = await updateGroup(db, '00000000-0000-0000-0000-000000000000', tutor.id, { name: 'X' })
    expect(result).toBeNull()
  })

  test('returns null when tutorId does not match', async () => {
    const db = await createTestDb()
    const { tutor: tutor1 } = await seedTutor(db, 'clerk_t1', 'tutor1@example.com')
    const { tutor: tutor2 } = await seedTutor(db, 'clerk_t2', 'tutor2@example.com')
    const group = await seedGroup(db, tutor1.id, { joinCode: 'SEC111' })
    const result = await updateGroup(db, group.id, tutor2.id, { name: 'Hijacked' })
    expect(result).toBeNull()
  })
})

describe('deleteGroup', () => {
  test('returns true and removes group when found', async () => {
    const db = await createTestDb()
    const { tutor } = await seedTutor(db)
    const group = await seedGroup(db, tutor.id, { joinCode: 'DEL111' })
    const deleted = await deleteGroup(db, group.id, tutor.id)
    expect(deleted).toBe(true)
    const found = await getGroupsByTutorId(db, tutor.id)
    expect(found).toHaveLength(0)
  })

  test('returns false for unknown groupId', async () => {
    const db = await createTestDb()
    const { tutor } = await seedTutor(db)
    const result = await deleteGroup(db, '00000000-0000-0000-0000-000000000000', tutor.id)
    expect(result).toBe(false)
  })

  test('returns false when tutorId does not match', async () => {
    const db = await createTestDb()
    const { tutor: tutor1 } = await seedTutor(db, 'clerk_t1', 'tutor1@example.com')
    const { tutor: tutor2 } = await seedTutor(db, 'clerk_t2', 'tutor2@example.com')
    const group = await seedGroup(db, tutor1.id, { joinCode: 'SEC222' })
    const result = await deleteGroup(db, group.id, tutor2.id)
    expect(result).toBe(false)
  })
})

describe('addStudentToGroup', () => {
  test('adds student to group and returns true', async () => {
    const db = await createTestDb()
    const { tutor } = await seedTutor(db)
    const { student } = await seedStudent(db)
    const group = await seedGroup(db, tutor.id, { joinCode: 'ADD111' })
    const result = await addStudentToGroup(db, group.id, student.id)
    expect(result).toBe(true)
  })

  test('returns false if student is already a member', async () => {
    const db = await createTestDb()
    const { tutor } = await seedTutor(db)
    const { student } = await seedStudent(db)
    const group = await seedGroup(db, tutor.id, { joinCode: 'DUP111' })
    await addStudentToGroup(db, group.id, student.id)
    const result = await addStudentToGroup(db, group.id, student.id)
    expect(result).toBe(false)
  })
})

describe('removeStudentFromGroup', () => {
  test('removes student and returns true', async () => {
    const db = await createTestDb()
    const { tutor } = await seedTutor(db)
    const { student } = await seedStudent(db)
    const group = await seedGroup(db, tutor.id, { joinCode: 'REM111' })
    await db.insert(schema.groupMembers).values({ groupId: group.id, studentId: student.id })
    const result = await removeStudentFromGroup(db, group.id, student.id)
    expect(result).toBe(true)
  })

  test('returns false when student is not a member', async () => {
    const db = await createTestDb()
    const { tutor } = await seedTutor(db)
    const { student } = await seedStudent(db)
    const group = await seedGroup(db, tutor.id, { joinCode: 'REM222' })
    const result = await removeStudentFromGroup(db, group.id, student.id)
    expect(result).toBe(false)
  })
})

describe('getGroupsByStudentId', () => {
  test('returns empty array when student has no groups', async () => {
    const db = await createTestDb()
    const { student } = await seedStudent(db)
    const result = await getGroupsByStudentId(db, student.id)
    expect(result).toEqual([])
  })

  test('returns groups the student is a member of', async () => {
    const db = await createTestDb()
    const { tutor } = await seedTutor(db)
    const { student } = await seedStudent(db)
    const group = await seedGroup(db, tutor.id, { name: 'My Group', joinCode: 'STU111' })
    await db.insert(schema.groupMembers).values({ groupId: group.id, studentId: student.id })
    const result = await getGroupsByStudentId(db, student.id)
    expect(result).toHaveLength(1)
    expect(result[0].name).toBe('My Group')
  })

  test('does not return groups the student has not joined', async () => {
    const db = await createTestDb()
    const { tutor } = await seedTutor(db)
    const { student } = await seedStudent(db)
    await seedGroup(db, tutor.id, { joinCode: 'NOT111' })
    const result = await getGroupsByStudentId(db, student.id)
    expect(result).toHaveLength(0)
  })
})
