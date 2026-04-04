import { describe, test, expect } from 'bun:test'
import { checkTrialEndingSoon } from './trial-reminder'
import { createTestDb } from '../db/test-helpers'
import * as schema from '../db/schema'
import { eq } from 'drizzle-orm'

type TestDB = Awaited<ReturnType<typeof createTestDb>>

async function seedTutor(
  db: TestDB,
  clerkId = 'clerk_t1',
  overrides: Partial<typeof schema.tutors.$inferInsert> = {},
  userOverrides: Partial<typeof schema.users.$inferInsert> = {}
) {
  const [user] = await db
    .insert(schema.users)
    .values({ clerkId, email: 'tutor@example.com', role: 'TUTOR', firstName: 'Alex', ...userOverrides })
    .returning()
  const [tutor] = await db
    .insert(schema.tutors)
    .values({ userId: user.id, ...overrides })
    .returning()
  return { user, tutor }
}

async function seedStudent(
  db: TestDB,
  clerkId = 'clerk_s1',
  overrides: Partial<typeof schema.students.$inferInsert> = {},
  userOverrides: Partial<typeof schema.users.$inferInsert> = {}
) {
  const [user] = await db
    .insert(schema.users)
    .values({ clerkId, email: 'student@example.com', role: 'STUDENT', firstName: 'Emma', ...userOverrides })
    .returning()
  const [student] = await db
    .insert(schema.students)
    .values({ userId: user.id, ...overrides })
    .returning()
  return { user, student }
}

const hours = (n: number) => new Date(Date.now() + n * 60 * 60 * 1000)

describe('checkTrialEndingSoon', () => {
  test('sends email to tutor with trial ending in 24h and trialReminderSentAt = null', async () => {
    const db = await createTestDb()
    const { tutor } = await seedTutor(db, 'clerk_t1', {
      subscriptionStatus: 'TRIALING',
      trialEndsAt: hours(24),
      trialReminderSentAt: null,
    })

    const calls: { to: string; firstName: string; trialEndsAt: Date }[] = []
    await checkTrialEndingSoon(db, {
      sendTrialEndingSoon: async (to, firstName, trialEndsAt) => {
        calls.push({ to, firstName, trialEndsAt })
      },
    })

    expect(calls).toHaveLength(1)
    expect(calls[0].to).toBe('tutor@example.com')
    expect(calls[0].firstName).toBe('Alex')

    const [updated] = await db.select().from(schema.tutors).where(eq(schema.tutors.id, tutor.id))
    expect(updated.trialReminderSentAt).not.toBeNull()
  })

  test('does NOT send email to tutor with trial ending in 73h (outside 72h window)', async () => {
    const db = await createTestDb()
    await seedTutor(db, 'clerk_t1', {
      subscriptionStatus: 'TRIALING',
      trialEndsAt: hours(73),
      trialReminderSentAt: null,
    })

    const calls: string[] = []
    await checkTrialEndingSoon(db, {
      sendTrialEndingSoon: async (to) => { calls.push(to) },
    })

    expect(calls).toHaveLength(0)
  })

  test('does NOT send email to tutor with trial ending in 24h when trialReminderSentAt already set', async () => {
    const db = await createTestDb()
    await seedTutor(db, 'clerk_t1', {
      subscriptionStatus: 'TRIALING',
      trialEndsAt: hours(24),
      trialReminderSentAt: new Date(),
    })

    const calls: string[] = []
    await checkTrialEndingSoon(db, {
      sendTrialEndingSoon: async (to) => { calls.push(to) },
    })

    expect(calls).toHaveLength(0)
  })

  test('does NOT send email to tutor with subscriptionStatus = ACTIVE', async () => {
    const db = await createTestDb()
    await seedTutor(db, 'clerk_t1', {
      subscriptionStatus: 'ACTIVE',
      trialEndsAt: hours(24),
      trialReminderSentAt: null,
    })

    const calls: string[] = []
    await checkTrialEndingSoon(db, {
      sendTrialEndingSoon: async (to) => { calls.push(to) },
    })

    expect(calls).toHaveLength(0)
  })

  test('sends email to student with trial ending in 24h', async () => {
    const db = await createTestDb()
    const { student } = await seedStudent(db, 'clerk_s1', {
      subscriptionStatus: 'TRIALING',
      trialEndsAt: hours(24),
      trialReminderSentAt: null,
    })

    const calls: { to: string; firstName: string }[] = []
    await checkTrialEndingSoon(db, {
      sendTrialEndingSoon: async (to, firstName) => { calls.push({ to, firstName }) },
    })

    expect(calls).toHaveLength(1)
    expect(calls[0].to).toBe('student@example.com')
    expect(calls[0].firstName).toBe('Emma')

    const [updated] = await db.select().from(schema.students).where(eq(schema.students.id, student.id))
    expect(updated.trialReminderSentAt).not.toBeNull()
  })

  test('sends emails to all eligible users (tutor + student)', async () => {
    const db = await createTestDb()
    await seedTutor(db, 'clerk_t1', {
      subscriptionStatus: 'TRIALING',
      trialEndsAt: hours(48),
      trialReminderSentAt: null,
    })
    await seedStudent(db, 'clerk_s1', {
      subscriptionStatus: 'TRIALING',
      trialEndsAt: hours(48),
      trialReminderSentAt: null,
    })

    const calls: string[] = []
    await checkTrialEndingSoon(db, {
      sendTrialEndingSoon: async (to) => { calls.push(to) },
    })

    expect(calls).toHaveLength(2)
    expect(calls).toContain('tutor@example.com')
    expect(calls).toContain('student@example.com')
  })

  test('does nothing and does not throw when no eligible users', async () => {
    const db = await createTestDb()

    const calls: string[] = []
    await expect(
      checkTrialEndingSoon(db, {
        sendTrialEndingSoon: async (to) => { calls.push(to) },
      })
    ).resolves.toBeUndefined()

    expect(calls).toHaveLength(0)
  })

  test('does NOT send email to tutor whose trial has already expired', async () => {
    const db = await createTestDb()
    await seedTutor(db, 'clerk_t1', {
      subscriptionStatus: 'TRIALING',
      trialEndsAt: hours(-1),
      trialReminderSentAt: null,
    })

    const calls: string[] = []
    await checkTrialEndingSoon(db, {
      sendTrialEndingSoon: async (to) => { calls.push(to) },
    })

    expect(calls).toHaveLength(0)
  })
})
