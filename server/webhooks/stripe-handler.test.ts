import { describe, test, expect } from 'bun:test'
import { handleStripeWebhook } from './stripe-handler'
import { createTestDb } from '../db/test-helpers'
import * as schema from '../db/schema'
import { getTutorByUserId, getStudentByUserId } from '../db/queries'
import { getTutorByStripeCustomerId, getStudentByStripeCustomerId } from '../db/queries/subscriptions'

type TestDB = Awaited<ReturnType<typeof createTestDb>>

async function seedTutor(db: TestDB, clerkId = 'clerk_t1') {
  const [user] = await db.insert(schema.users).values({ clerkId, email: 'tutor@example.com', role: 'TUTOR', firstName: 'Alex' }).returning()
  const [tutor] = await db.insert(schema.tutors).values({ userId: user.id }).returning()
  return { user, tutor }
}

async function seedStudent(db: TestDB, clerkId = 'clerk_s1') {
  const [user] = await db.insert(schema.users).values({ clerkId, email: 'student@example.com', role: 'STUDENT', firstName: 'Emma' }).returning()
  const [student] = await db.insert(schema.students).values({ userId: user.id }).returning()
  return { user, student }
}

const noopEmails = {
  sendPaymentFailed: async () => {},
  sendSubscriptionCancelled: async () => {},
  sendPaymentSuccessful: async () => {},
}

describe('handleStripeWebhook', () => {
  describe('checkout.session.completed', () => {
    test('links Stripe customer and sets tutor to TRIALING', async () => {
      const db = await createTestDb()
      const { tutor } = await seedTutor(db)

      await handleStripeWebhook({
        type: 'checkout.session.completed',
        data: {
          object: {
            customer: 'cus_test_123',
            subscription: 'sub_test_123',
            metadata: { clerkUserId: 'clerk_t1', role: 'TUTOR' },
            subscription_details: { trial_end: Math.floor(Date.now() / 1000) + 14 * 86400 },
          },
        },
      }, db, noopEmails)

      const updated = await getTutorByStripeCustomerId(db, 'cus_test_123')
      expect(updated).not.toBeNull()
      expect(updated!.stripeCustomerId).toBe('cus_test_123')
      expect(updated!.stripeSubscriptionId).toBe('sub_test_123')
      expect(updated!.subscriptionStatus).toBe('TRIALING')
      expect(updated!.trialEndsAt).not.toBeNull()
    })

    test('links Stripe customer and sets student to TRIALING', async () => {
      const db = await createTestDb()
      await seedStudent(db)

      await handleStripeWebhook({
        type: 'checkout.session.completed',
        data: {
          object: {
            customer: 'cus_student_123',
            subscription: 'sub_student_123',
            metadata: { clerkUserId: 'clerk_s1', role: 'STUDENT' },
            subscription_details: null,
          },
        },
      }, db, noopEmails)

      const updated = await getStudentByStripeCustomerId(db, 'cus_student_123')
      expect(updated).not.toBeNull()
      expect(updated!.subscriptionStatus).toBe('TRIALING')
    })

    test('does nothing when clerkUserId is missing from metadata', async () => {
      const db = await createTestDb()
      const { tutor } = await seedTutor(db)

      await handleStripeWebhook({
        type: 'checkout.session.completed',
        data: {
          object: {
            customer: 'cus_no_meta',
            subscription: 'sub_no_meta',
            metadata: {},
          },
        },
      }, db, noopEmails)

      const unchanged = await getTutorByStripeCustomerId(db, 'cus_no_meta')
      expect(unchanged).toBeNull()
    })
  })

  describe('invoice.payment_succeeded', () => {
    test('sets subscription to ACTIVE and updates period end', async () => {
      const db = await createTestDb()
      const { tutor } = await seedTutor(db)
      // Pre-link the customer
      await db.update(schema.tutors).set({ stripeCustomerId: 'cus_pay_123', subscriptionStatus: 'TRIALING' })
        .where((await import('drizzle-orm')).eq(schema.tutors.id, tutor.id))

      const periodEnd = Math.floor(Date.now() / 1000) + 30 * 86400
      await handleStripeWebhook({
        type: 'invoice.payment_succeeded',
        data: {
          object: {
            customer: 'cus_pay_123',
            amount_paid: 999,
            lines: { data: [{ period: { end: periodEnd } }] },
          },
        },
      }, db, noopEmails)

      const updated = await getTutorByStripeCustomerId(db, 'cus_pay_123')
      expect(updated!.subscriptionStatus).toBe('ACTIVE')
      expect(updated!.subscriptionPeriodEnd).not.toBeNull()
    })

    test('sends payment successful email', async () => {
      const db = await createTestDb()
      const { tutor } = await seedTutor(db)
      await db.update(schema.tutors).set({ stripeCustomerId: 'cus_email_test' })
        .where((await import('drizzle-orm')).eq(schema.tutors.id, tutor.id))

      const calls: string[] = []
      await handleStripeWebhook({
        type: 'invoice.payment_succeeded',
        data: {
          object: {
            customer: 'cus_email_test',
            amount_paid: 1999,
            lines: { data: [{ period: { end: Math.floor(Date.now() / 1000) + 30 * 86400 } }] },
          },
        },
      }, db, {
        ...noopEmails,
        sendPaymentSuccessful: async (to) => { calls.push(to) },
      })

      expect(calls).toContain('tutor@example.com')
    })
  })

  describe('invoice.payment_failed', () => {
    test('sends payment failed email', async () => {
      const db = await createTestDb()
      const { tutor } = await seedTutor(db)
      await db.update(schema.tutors).set({ stripeCustomerId: 'cus_fail_123' })
        .where((await import('drizzle-orm')).eq(schema.tutors.id, tutor.id))

      const calls: string[] = []
      await handleStripeWebhook({
        type: 'invoice.payment_failed',
        data: { object: { customer: 'cus_fail_123' } },
      }, db, {
        ...noopEmails,
        sendPaymentFailed: async (to) => { calls.push(to) },
      })

      expect(calls).toContain('tutor@example.com')
    })

    test('does nothing when customer not found', async () => {
      const db = await createTestDb()
      const calls: string[] = []
      await handleStripeWebhook({
        type: 'invoice.payment_failed',
        data: { object: { customer: 'cus_unknown' } },
      }, db, {
        ...noopEmails,
        sendPaymentFailed: async (to) => { calls.push(to) },
      })
      expect(calls).toHaveLength(0)
    })
  })

  describe('customer.subscription.deleted', () => {
    test('sets status to CANCELLED and sends cancellation email', async () => {
      const db = await createTestDb()
      const { tutor } = await seedTutor(db)
      await db.update(schema.tutors).set({ stripeCustomerId: 'cus_del_123', subscriptionStatus: 'ACTIVE' })
        .where((await import('drizzle-orm')).eq(schema.tutors.id, tutor.id))

      const calls: string[] = []
      const expiry = Math.floor(Date.now() / 1000) + 7 * 86400
      await handleStripeWebhook({
        type: 'customer.subscription.deleted',
        data: { object: { customer: 'cus_del_123', current_period_end: expiry } },
      }, db, {
        ...noopEmails,
        sendSubscriptionCancelled: async (to) => { calls.push(to) },
      })

      const updated = await getTutorByStripeCustomerId(db, 'cus_del_123')
      expect(updated!.subscriptionStatus).toBe('CANCELLED')
      expect(calls).toContain('tutor@example.com')
    })
  })

  describe('customer.subscription.updated', () => {
    test('syncs ACTIVE status', async () => {
      const db = await createTestDb()
      const { tutor } = await seedTutor(db)
      await db.update(schema.tutors).set({ stripeCustomerId: 'cus_upd_123', subscriptionStatus: 'TRIALING' })
        .where((await import('drizzle-orm')).eq(schema.tutors.id, tutor.id))

      await handleStripeWebhook({
        type: 'customer.subscription.updated',
        data: { object: { customer: 'cus_upd_123', status: 'active' } },
      }, db, noopEmails)

      const updated = await getTutorByStripeCustomerId(db, 'cus_upd_123')
      expect(updated!.subscriptionStatus).toBe('ACTIVE')
    })

    test('syncs cancelled status', async () => {
      const db = await createTestDb()
      const { tutor } = await seedTutor(db)
      await db.update(schema.tutors).set({ stripeCustomerId: 'cus_cxl_123', subscriptionStatus: 'ACTIVE' })
        .where((await import('drizzle-orm')).eq(schema.tutors.id, tutor.id))

      await handleStripeWebhook({
        type: 'customer.subscription.updated',
        data: { object: { customer: 'cus_cxl_123', status: 'canceled' } },
      }, db, noopEmails)

      const updated = await getTutorByStripeCustomerId(db, 'cus_cxl_123')
      expect(updated!.subscriptionStatus).toBe('CANCELLED')
    })
  })
})
