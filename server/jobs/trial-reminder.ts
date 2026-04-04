import { and, isNull, lte, gt, eq, sql } from 'drizzle-orm'
import type { DB } from '../db/index'
import { tutors, students, users } from '../db/schema'

export type TrialEmailSender = {
  sendTrialEndingSoon: (to: string, firstName: string, trialEndsAt: Date) => Promise<void>
}

export async function checkTrialEndingSoon(db: DB, emailSender: TrialEmailSender): Promise<void> {
  const now = new Date()
  const windowEnd = new Date(now.getTime() + 72 * 60 * 60 * 1000)

  // Query eligible tutors
  const eligibleTutors = await db
    .select({
      id: tutors.id,
      trialEndsAt: tutors.trialEndsAt,
      email: users.email,
      firstName: users.firstName,
    })
    .from(tutors)
    .innerJoin(users, eq(tutors.userId, users.id))
    .where(
      and(
        eq(tutors.subscriptionStatus, 'TRIALING'),
        isNull(tutors.trialReminderSentAt),
        lte(tutors.trialEndsAt, windowEnd),
        gt(tutors.trialEndsAt, now)
      )
    )

  for (const tutor of eligibleTutors) {
    await emailSender.sendTrialEndingSoon(
      tutor.email,
      tutor.firstName ?? tutor.email,
      tutor.trialEndsAt!
    )
    await db
      .update(tutors)
      .set({ trialReminderSentAt: new Date() })
      .where(eq(tutors.id, tutor.id))
  }

  // Query eligible students
  const eligibleStudents = await db
    .select({
      id: students.id,
      trialEndsAt: students.trialEndsAt,
      email: users.email,
      firstName: users.firstName,
    })
    .from(students)
    .innerJoin(users, eq(students.userId, users.id))
    .where(
      and(
        eq(students.subscriptionStatus, 'TRIALING'),
        isNull(students.trialReminderSentAt),
        lte(students.trialEndsAt, windowEnd),
        gt(students.trialEndsAt, now)
      )
    )

  for (const student of eligibleStudents) {
    await emailSender.sendTrialEndingSoon(
      student.email,
      student.firstName ?? student.email,
      student.trialEndsAt!
    )
    await db
      .update(students)
      .set({ trialReminderSentAt: new Date() })
      .where(eq(students.id, student.id))
  }
}
