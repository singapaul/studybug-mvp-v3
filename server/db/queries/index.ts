import { eq } from 'drizzle-orm'
import type { DB } from '../index'
import { users, tutors, students } from '../schema'
import type { SelectUser, SelectTutor, SelectStudent } from '../schema'

export async function getUserByClerkId(db: DB, clerkId: string): Promise<SelectUser | null> {
  const result = await db.select().from(users).where(eq(users.clerkId, clerkId)).limit(1)
  return result[0] ?? null
}

export async function getTutorByUserId(db: DB, userId: string): Promise<SelectTutor | null> {
  const result = await db.select().from(tutors).where(eq(tutors.userId, userId)).limit(1)
  return result[0] ?? null
}

export async function getStudentByUserId(db: DB, userId: string): Promise<SelectStudent | null> {
  const result = await db.select().from(students).where(eq(students.userId, userId)).limit(1)
  return result[0] ?? null
}
