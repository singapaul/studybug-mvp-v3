import { eq } from 'drizzle-orm'
import type { DB } from '../index'
import { tutors, students, users } from '../schema'
import type { SelectTutor, SelectStudent } from '../schema'

export type ProfileWithEmail = {
  id: string
  role: 'TUTOR' | 'STUDENT'
  email: string
  firstName: string | null
}

export type SubscriptionStatus = 'FREE' | 'TRIALING' | 'ACTIVE' | 'CANCELLED' | 'EXPIRED'

export type SubscriptionStatusResult = {
  status: SubscriptionStatus
  trialEndsAt: Date | null
  periodEnd: Date | null
  role: 'TUTOR' | 'STUDENT'
}

export async function getTutorByStripeCustomerId(
  db: DB,
  customerId: string
): Promise<SelectTutor | null> {
  const rows = await db
    .select()
    .from(tutors)
    .where(eq(tutors.stripeCustomerId, customerId))
    .limit(1)
  return rows[0] ?? null
}

export async function getStudentByStripeCustomerId(
  db: DB,
  customerId: string
): Promise<SelectStudent | null> {
  const rows = await db
    .select()
    .from(students)
    .where(eq(students.stripeCustomerId, customerId))
    .limit(1)
  return rows[0] ?? null
}

export async function getProfileByStripeCustomerId(
  db: DB,
  customerId: string
): Promise<ProfileWithEmail | null> {
  const tutorRows = await db
    .select({ id: tutors.id, email: users.email, firstName: users.firstName })
    .from(tutors)
    .innerJoin(users, eq(tutors.userId, users.id))
    .where(eq(tutors.stripeCustomerId, customerId))
    .limit(1)

  if (tutorRows[0]) {
    return { id: tutorRows[0].id, role: 'TUTOR', email: tutorRows[0].email, firstName: tutorRows[0].firstName }
  }

  const studentRows = await db
    .select({ id: students.id, email: users.email, firstName: users.firstName })
    .from(students)
    .innerJoin(users, eq(students.userId, users.id))
    .where(eq(students.stripeCustomerId, customerId))
    .limit(1)

  if (studentRows[0]) {
    return { id: studentRows[0].id, role: 'STUDENT', email: studentRows[0].email, firstName: studentRows[0].firstName }
  }

  return null
}

export type SubscriptionUpdate = {
  stripeCustomerId?: string
  stripeSubscriptionId?: string
  subscriptionStatus?: SubscriptionStatus
  trialEndsAt?: Date | null
  subscriptionPeriodEnd?: Date | null
}

export async function updateTutorSubscription(
  db: DB,
  tutorId: string,
  update: SubscriptionUpdate
): Promise<void> {
  await db.update(tutors).set(update).where(eq(tutors.id, tutorId))
}

export async function updateStudentSubscription(
  db: DB,
  studentId: string,
  update: SubscriptionUpdate
): Promise<void> {
  await db.update(students).set(update).where(eq(students.id, studentId))
}

export async function linkStripeCustomer(
  db: DB,
  clerkUserId: string,
  stripeCustomerId: string,
  stripeSubscriptionId: string,
  role: 'TUTOR' | 'STUDENT',
  trialEndsAt: Date | null
): Promise<void> {
  // First find the user record by clerkId
  const userRows = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.clerkId, clerkUserId))
    .limit(1)

  if (!userRows[0]) return

  const update: SubscriptionUpdate = {
    stripeCustomerId,
    stripeSubscriptionId,
    subscriptionStatus: 'TRIALING',
    trialEndsAt,
  }

  if (role === 'TUTOR') {
    const tutorRows = await db
      .select({ id: tutors.id })
      .from(tutors)
      .where(eq(tutors.userId, userRows[0].id))
      .limit(1)
    if (tutorRows[0]) await updateTutorSubscription(db, tutorRows[0].id, update)
  } else {
    const studentRows = await db
      .select({ id: students.id })
      .from(students)
      .where(eq(students.userId, userRows[0].id))
      .limit(1)
    if (studentRows[0]) await updateStudentSubscription(db, studentRows[0].id, update)
  }
}

export async function getSubscriptionStatus(
  db: DB,
  userId: string
): Promise<SubscriptionStatusResult | null> {
  const tutorRows = await db
    .select()
    .from(tutors)
    .where(eq(tutors.userId, userId))
    .limit(1)

  if (tutorRows[0]) {
    const tutor = tutorRows[0]
    return {
      status: tutor.subscriptionStatus,
      trialEndsAt: tutor.trialEndsAt,
      periodEnd: tutor.subscriptionPeriodEnd,
      role: 'TUTOR',
    }
  }

  const studentRows = await db
    .select()
    .from(students)
    .where(eq(students.userId, userId))
    .limit(1)

  if (studentRows[0]) {
    const student = studentRows[0]
    return {
      status: student.subscriptionStatus,
      trialEndsAt: student.trialEndsAt,
      periodEnd: student.subscriptionPeriodEnd,
      role: 'STUDENT',
    }
  }

  return null
}
