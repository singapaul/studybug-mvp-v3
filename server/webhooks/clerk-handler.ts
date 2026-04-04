import { users, tutors, students } from '../db/schema'
import { getUserByClerkId } from '../db/queries/index'
import type { DB } from '../db/index'

export type EmailSender = (to: string, firstName: string) => Promise<void>

export async function handleClerkWebhook(
  event: Record<string, unknown>,
  db: DB,
  sendEmail: EmailSender
): Promise<void> {
  if (event.type !== 'user.created') return

  const data = event.data as {
    id: string
    email_addresses: Array<{ email_address: string; id: string }>
    primary_email_address_id: string
    first_name: string | null
    last_name: string | null
    public_metadata: { role?: string }
    unsafe_metadata: { role?: string }
  }

  const primaryEmail = data.email_addresses.find(
    e => e.id === data.primary_email_address_id
  )?.email_address ?? ''

  // Prefer public_metadata.role (set server-side); fall back to unsafe_metadata.role
  // (set client-side via signUp.create({ unsafeMetadata: { role } }))
  const role = (
    data.public_metadata?.role ?? data.unsafe_metadata?.role ?? 'STUDENT'
  ) as 'TUTOR' | 'STUDENT'

  // Idempotency: check if user already exists
  const existing = await getUserByClerkId(db, data.id)
  if (existing) return

  // Insert user
  const [user] = await db.insert(users).values({
    clerkId: data.id,
    email: primaryEmail,
    role,
    firstName: data.first_name,
    lastName: data.last_name,
  }).returning()

  // Insert tutor or student profile
  if (role === 'TUTOR') {
    await db.insert(tutors).values({ userId: user.id }).onConflictDoNothing()
  } else {
    await db.insert(students).values({ userId: user.id }).onConflictDoNothing()
  }

  // Send welcome email
  await sendEmail(primaryEmail, data.first_name ?? 'there')
}
