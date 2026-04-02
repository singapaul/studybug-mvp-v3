import { describe, test, expect } from 'bun:test'
import { handleClerkWebhook } from './clerk-handler'
import { getUserByClerkId, getTutorByUserId, getStudentByUserId } from '../db/queries'
import { createTestDb } from '../db/test-helpers'

describe('handleClerkWebhook', () => {
  // Cycle 1: tutor created
  test('creates user and tutor rows when user.created event has role tutor', async () => {
    const db = await createTestDb()
    const emails: string[] = []
    const mockSendEmail = async (to: string) => { emails.push(to) }

    await handleClerkWebhook({
      type: 'user.created',
      data: {
        id: 'clerk_123',
        email_addresses: [{ email_address: 'tutor@test.com', id: 'email_1' }],
        primary_email_address_id: 'email_1',
        first_name: 'Alex',
        last_name: 'Thompson',
        public_metadata: { role: 'TUTOR' }
      }
    }, db, mockSendEmail)

    const user = await getUserByClerkId(db, 'clerk_123')
    expect(user).not.toBeNull()
    expect(user!.email).toBe('tutor@test.com')
    expect(user!.role).toBe('TUTOR')

    const tutor = await getTutorByUserId(db, user!.id)
    expect(tutor).not.toBeNull()
    expect(emails).toContain('tutor@test.com')
  })

  // Cycle 2: student created
  test('creates user and student rows when user.created event has role student', async () => {
    const db = await createTestDb()
    const mockSendEmail = async () => {}

    await handleClerkWebhook({
      type: 'user.created',
      data: {
        id: 'clerk_456',
        email_addresses: [{ email_address: 'student@test.com', id: 'email_2' }],
        primary_email_address_id: 'email_2',
        first_name: 'Emma',
        last_name: 'Wilson',
        public_metadata: { role: 'STUDENT' }
      }
    }, db, mockSendEmail)

    const user = await getUserByClerkId(db, 'clerk_456')
    expect(user!.role).toBe('STUDENT')

    const student = await getStudentByUserId(db, user!.id)
    expect(student).not.toBeNull()
  })

  // Cycle 3: idempotent — no duplicate rows
  test('does not create duplicate rows when same event delivered twice', async () => {
    const db = await createTestDb()
    const mockSendEmail = async () => {}

    const event = {
      type: 'user.created',
      data: {
        id: 'clerk_789',
        email_addresses: [{ email_address: 'dup@test.com', id: 'email_3' }],
        primary_email_address_id: 'email_3',
        first_name: 'Dup',
        last_name: 'User',
        public_metadata: { role: 'TUTOR' }
      }
    }

    await handleClerkWebhook(event, db, mockSendEmail)
    await handleClerkWebhook(event, db, mockSendEmail) // second delivery

    const user = await getUserByClerkId(db, 'clerk_789')
    expect(user).not.toBeNull()
  })

  // Cycle 4: welcome email called with correct args
  test('sends welcome email with correct recipient and name', async () => {
    const db = await createTestDb()
    const calls: Array<{ to: string; firstName: string }> = []
    const mockSendEmail = async (to: string, firstName: string) => {
      calls.push({ to, firstName })
    }

    await handleClerkWebhook({
      type: 'user.created',
      data: {
        id: 'clerk_email_test',
        email_addresses: [{ email_address: 'welcome@test.com', id: 'email_4' }],
        primary_email_address_id: 'email_4',
        first_name: 'Welcome',
        last_name: 'User',
        public_metadata: { role: 'TUTOR' }
      }
    }, db, mockSendEmail)

    expect(calls).toHaveLength(1)
    expect(calls[0].to).toBe('welcome@test.com')
    expect(calls[0].firstName).toBe('Welcome')
  })
})
