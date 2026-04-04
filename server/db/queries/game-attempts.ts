import { eq, and, desc } from 'drizzle-orm'
import type { DB } from '../index'
import { gameAttempts } from '../schema'
import type { SelectGameAttempt } from '../schema'

export type AttemptRow = Omit<SelectGameAttempt, 'createdAt'> & {
  completedAt: Date
  attemptData: string // JSON string for frontend compatibility
}

export type CreateAttemptParams = {
  studentId: string
  assignmentId: string
  scorePercentage: number
  timeTaken: number
  attemptData: Record<string, unknown>
}

function mapAttempt(row: SelectGameAttempt): AttemptRow {
  return {
    id: row.id,
    studentId: row.studentId,
    assignmentId: row.assignmentId,
    scorePercentage: row.scorePercentage,
    timeTaken: row.timeTaken,
    attemptData: typeof row.attemptData === 'string' ? row.attemptData : JSON.stringify(row.attemptData),
    completedAt: row.createdAt,
  }
}

export async function createAttempt(db: DB, params: CreateAttemptParams): Promise<AttemptRow> {
  const [inserted] = await db
    .insert(gameAttempts)
    .values({
      studentId: params.studentId,
      assignmentId: params.assignmentId,
      scorePercentage: params.scorePercentage,
      timeTaken: params.timeTaken,
      attemptData: params.attemptData,
    })
    .returning()
  return mapAttempt(inserted)
}

export async function getAttemptsByStudent(db: DB, studentId: string): Promise<AttemptRow[]> {
  const rows = await db
    .select()
    .from(gameAttempts)
    .where(eq(gameAttempts.studentId, studentId))
    .orderBy(desc(gameAttempts.createdAt))
  return rows.map(mapAttempt)
}

export async function getAttemptById(db: DB, attemptId: string, studentId: string): Promise<AttemptRow | null> {
  const rows = await db
    .select()
    .from(gameAttempts)
    .where(and(eq(gameAttempts.id, attemptId), eq(gameAttempts.studentId, studentId)))
    .limit(1)
  return rows[0] ? mapAttempt(rows[0]) : null
}

export async function getAssignmentAttempts(db: DB, studentId: string, assignmentId: string): Promise<AttemptRow[]> {
  const rows = await db
    .select()
    .from(gameAttempts)
    .where(and(eq(gameAttempts.studentId, studentId), eq(gameAttempts.assignmentId, assignmentId)))
    .orderBy(desc(gameAttempts.createdAt))
  return rows.map(mapAttempt)
}

export async function getBestAttempt(db: DB, studentId: string, assignmentId: string): Promise<AttemptRow | null> {
  const rows = await getAssignmentAttempts(db, studentId, assignmentId)
  if (rows.length === 0) return null
  return rows.reduce((best, cur) => cur.scorePercentage > best.scorePercentage ? cur : best)
}
