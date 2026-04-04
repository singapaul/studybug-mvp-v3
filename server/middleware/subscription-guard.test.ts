import { describe, test, expect } from 'bun:test'
import { subscriptionGuard } from './subscription-guard'
import { createTestDb } from '../db/test-helpers'
import * as schema from '../db/schema'

type TestDB = Awaited<ReturnType<typeof createTestDb>>

async function seedTutorWithStatus(
  db: TestDB,
  status: 'FREE' | 'TRIALING' | 'ACTIVE' | 'CANCELLED' | 'EXPIRED',
  clerkId = 'clerk_tutor_guard'
) {
  const [user] = await db
    .insert(schema.users)
    .values({ clerkId, email: 'tutor@example.com', role: 'TUTOR', firstName: 'Alex' })
    .returning()
  const [tutor] = await db
    .insert(schema.tutors)
    .values({ userId: user.id, subscriptionStatus: status })
    .returning()
  return { user, tutor }
}

async function seedStudentWithStatus(
  db: TestDB,
  status: 'FREE' | 'TRIALING' | 'ACTIVE' | 'CANCELLED' | 'EXPIRED',
  clerkId = 'clerk_student_guard'
) {
  const [user] = await db
    .insert(schema.users)
    .values({ clerkId, email: 'student@example.com', role: 'STUDENT', firstName: 'Emma' })
    .returning()
  const [student] = await db
    .insert(schema.students)
    .values({ userId: user.id, subscriptionStatus: status })
    .returning()
  return { user, student }
}

describe('subscriptionGuard', () => {
  describe('tutor subscription checks', () => {
    test('ACTIVE tutor is allowed', async () => {
      const db = await createTestDb()
      const { user } = await seedTutorWithStatus(db, 'ACTIVE')
      const result = await subscriptionGuard(db, user.id)
      expect(result.allowed).toBe(true)
      expect(result.reason).toBeUndefined()
    })

    test('TRIALING tutor is allowed', async () => {
      const db = await createTestDb()
      const { user } = await seedTutorWithStatus(db, 'TRIALING')
      const result = await subscriptionGuard(db, user.id)
      expect(result.allowed).toBe(true)
      expect(result.reason).toBeUndefined()
    })

    test('FREE tutor is not allowed with subscription_required reason', async () => {
      const db = await createTestDb()
      const { user } = await seedTutorWithStatus(db, 'FREE')
      const result = await subscriptionGuard(db, user.id)
      expect(result.allowed).toBe(false)
      expect(result.reason).toBe('subscription_required')
    })

    test('CANCELLED tutor is not allowed with subscription_inactive reason', async () => {
      const db = await createTestDb()
      const { user } = await seedTutorWithStatus(db, 'CANCELLED')
      const result = await subscriptionGuard(db, user.id)
      expect(result.allowed).toBe(false)
      expect(result.reason).toBe('subscription_inactive')
    })

    test('EXPIRED tutor is not allowed with subscription_inactive reason', async () => {
      const db = await createTestDb()
      const { user } = await seedTutorWithStatus(db, 'EXPIRED')
      const result = await subscriptionGuard(db, user.id)
      expect(result.allowed).toBe(false)
      expect(result.reason).toBe('subscription_inactive')
    })
  })

  describe('student subscription checks', () => {
    test('ACTIVE student is allowed', async () => {
      const db = await createTestDb()
      const { user } = await seedStudentWithStatus(db, 'ACTIVE')
      const result = await subscriptionGuard(db, user.id)
      expect(result.allowed).toBe(true)
      expect(result.reason).toBeUndefined()
    })

    test('TRIALING student is allowed', async () => {
      const db = await createTestDb()
      const { user } = await seedStudentWithStatus(db, 'TRIALING')
      const result = await subscriptionGuard(db, user.id)
      expect(result.allowed).toBe(true)
      expect(result.reason).toBeUndefined()
    })
  })

  describe('user not found', () => {
    test('unknown user ID returns not allowed with user_not_found reason', async () => {
      const db = await createTestDb()
      const result = await subscriptionGuard(db, '00000000-0000-0000-0000-000000000000')
      expect(result.allowed).toBe(false)
      expect(result.reason).toBe('user_not_found')
    })
  })
})
