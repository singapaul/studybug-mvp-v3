import { describe, test, expect } from 'bun:test'
import * as schema from './schema'
import { getUserByClerkId, getTutorByUserId, getStudentByUserId } from './queries'
import { createTestDb } from './test-helpers'

describe('getUserByClerkId', () => {
  test('returns user when clerkId matches', async () => {
    const db = await createTestDb()

    await db.insert(schema.users).values({
      clerkId: 'clerk_test_123',
      email: 'test@example.com',
      role: 'TUTOR',
      firstName: 'Alice',
      lastName: 'Smith',
    })

    const result = await getUserByClerkId(db, 'clerk_test_123')

    expect(result).not.toBeNull()
    expect(result?.clerkId).toBe('clerk_test_123')
    expect(result?.email).toBe('test@example.com')
    expect(result?.role).toBe('TUTOR')
    expect(result?.firstName).toBe('Alice')
    expect(result?.lastName).toBe('Smith')
  })

  test('returns null when clerkId does not exist', async () => {
    const db = await createTestDb()

    const result = await getUserByClerkId(db, 'clerk_nonexistent')

    expect(result).toBeNull()
  })

  test('returns correct user when multiple users exist', async () => {
    const db = await createTestDb()

    await db.insert(schema.users).values([
      {
        clerkId: 'clerk_alice',
        email: 'alice@example.com',
        role: 'TUTOR',
      },
      {
        clerkId: 'clerk_bob',
        email: 'bob@example.com',
        role: 'STUDENT',
      },
    ])

    const result = await getUserByClerkId(db, 'clerk_bob')

    expect(result).not.toBeNull()
    expect(result?.clerkId).toBe('clerk_bob')
    expect(result?.email).toBe('bob@example.com')
    expect(result?.role).toBe('STUDENT')
  })
})

describe('getTutorByUserId', () => {
  test('returns tutor when userId matches', async () => {
    const db = await createTestDb()

    const [user] = await db.insert(schema.users).values({
      clerkId: 'clerk_tutor_1',
      email: 'tutor@example.com',
      role: 'TUTOR',
    }).returning()

    await db.insert(schema.tutors).values({
      userId: user.id,
      subscriptionStatus: 'ACTIVE',
    })

    const result = await getTutorByUserId(db, user.id)

    expect(result).not.toBeNull()
    expect(result?.userId).toBe(user.id)
    expect(result?.subscriptionStatus).toBe('ACTIVE')
  })

  test('returns null when userId has no tutor record', async () => {
    const db = await createTestDb()

    const [user] = await db.insert(schema.users).values({
      clerkId: 'clerk_no_tutor',
      email: 'notutor@example.com',
      role: 'STUDENT',
    }).returning()

    const result = await getTutorByUserId(db, user.id)

    expect(result).toBeNull()
  })

  test('returns tutor with default FREE subscription status', async () => {
    const db = await createTestDb()

    const [user] = await db.insert(schema.users).values({
      clerkId: 'clerk_free_tutor',
      email: 'freetutor@example.com',
      role: 'TUTOR',
    }).returning()

    await db.insert(schema.tutors).values({ userId: user.id })

    const result = await getTutorByUserId(db, user.id)

    expect(result).not.toBeNull()
    expect(result?.subscriptionStatus).toBe('FREE')
    expect(result?.stripeCustomerId).toBeNull()
    expect(result?.subscriptionPeriodEnd).toBeNull()
  })
})

describe('getStudentByUserId', () => {
  test('returns student when userId matches', async () => {
    const db = await createTestDb()

    const [user] = await db.insert(schema.users).values({
      clerkId: 'clerk_student_1',
      email: 'student@example.com',
      role: 'STUDENT',
    }).returning()

    await db.insert(schema.students).values({
      userId: user.id,
      subscriptionStatus: 'TRIALING',
    })

    const result = await getStudentByUserId(db, user.id)

    expect(result).not.toBeNull()
    expect(result?.userId).toBe(user.id)
    expect(result?.subscriptionStatus).toBe('TRIALING')
  })

  test('returns null when userId has no student record', async () => {
    const db = await createTestDb()

    const [user] = await db.insert(schema.users).values({
      clerkId: 'clerk_no_student',
      email: 'nostudent@example.com',
      role: 'TUTOR',
    }).returning()

    const result = await getStudentByUserId(db, user.id)

    expect(result).toBeNull()
  })

  test('returns student with subscriptionPeriodEnd when set', async () => {
    const db = await createTestDb()

    const periodEnd = new Date('2025-12-31T00:00:00.000Z')

    const [user] = await db.insert(schema.users).values({
      clerkId: 'clerk_paid_student',
      email: 'paidstudent@example.com',
      role: 'STUDENT',
    }).returning()

    await db.insert(schema.students).values({
      userId: user.id,
      subscriptionStatus: 'ACTIVE',
      subscriptionPeriodEnd: periodEnd,
    })

    const result = await getStudentByUserId(db, user.id)

    expect(result).not.toBeNull()
    expect(result?.subscriptionStatus).toBe('ACTIVE')
    expect(result?.subscriptionPeriodEnd).toEqual(periodEnd)
  })
})
