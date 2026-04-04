import { eq, and, sql, desc, inArray } from 'drizzle-orm'
import type { DB } from '../index'
import { assignments, games, groups, groupMembers, gameAttempts, tutors, users } from '../schema'

export type AssignmentGameRow = {
  id: string
  name: string
  gameType: string
  gameData: unknown
  userId: string
  createdAt: Date
  updatedAt: Date
  gameData_raw: string
}

export type AssignmentGroupRow = {
  id: string
  tutorId: string
  name: string
  joinCode: string
  ageRange: string | null
  subjectArea: string | null
  createdAt: Date
  updatedAt: Date
}

export type AssignmentRow = {
  id: string
  gameId: string
  groupId: string
  dueDate: Date | null
  passPercentage: number | null
  createdAt: Date
  updatedAt: Date
  game: {
    id: string
    name: string
    gameType: string
    gameData: unknown
    userId: string
    createdAt: Date
    updatedAt: Date
  }
  group: {
    id: string
    tutorId: string
    name: string
    joinCode: string
    ageRange: string | null
    subjectArea: string | null
    createdAt: Date
    updatedAt: Date
  }
}

export type StudentAssignmentRow = AssignmentRow & {
  bestScore: number | undefined
  attemptCount: number
  isCompleted: boolean
  isOverdue: boolean
  isPassing: boolean | undefined
}

export type CreateAssignmentParams = {
  gameId: string
  groupId: string
  dueDate?: Date | null
  passPercentage?: number | null
}

async function fetchAssignmentById(db: DB, assignmentId: string): Promise<AssignmentRow | null> {
  const rows = await db
    .select({
      id: assignments.id,
      gameId: assignments.gameId,
      groupId: assignments.groupId,
      dueDate: assignments.dueDate,
      passPercentage: assignments.passPercentage,
      createdAt: assignments.createdAt,
      gameId2: games.id,
      gameName: games.name,
      gameType: games.gameType,
      gameData: games.gameData,
      gameCreatedAt: games.createdAt,
      gameUpdatedAt: games.updatedAt,
      tutorClerkId: users.clerkId,
      groupId2: groups.id,
      groupTutorId: groups.tutorId,
      groupName: groups.name,
      joinCode: groups.joinCode,
      ageRange: groups.ageRange,
      subjectArea: groups.subjectArea,
      groupCreatedAt: groups.createdAt,
    })
    .from(assignments)
    .innerJoin(games, eq(assignments.gameId, games.id))
    .innerJoin(groups, eq(assignments.groupId, groups.id))
    .innerJoin(tutors, eq(games.tutorId, tutors.id))
    .innerJoin(users, eq(tutors.userId, users.id))
    .where(eq(assignments.id, assignmentId))
    .limit(1)

  if (!rows[0]) return null
  const r = rows[0]
  return {
    id: r.id,
    gameId: r.gameId,
    groupId: r.groupId,
    dueDate: r.dueDate,
    passPercentage: r.passPercentage,
    createdAt: r.createdAt,
    updatedAt: r.createdAt,
    game: {
      id: r.gameId2,
      name: r.gameName,
      gameType: r.gameType,
      gameData: r.gameData,
      userId: r.tutorClerkId,
      createdAt: r.gameCreatedAt,
      updatedAt: r.gameUpdatedAt,
    },
    group: {
      id: r.groupId2,
      tutorId: r.groupTutorId,
      name: r.groupName,
      joinCode: r.joinCode,
      ageRange: r.ageRange,
      subjectArea: r.subjectArea,
      createdAt: r.groupCreatedAt,
      updatedAt: r.groupCreatedAt,
    },
  }
}

export async function createAssignment(db: DB, params: CreateAssignmentParams): Promise<AssignmentRow> {
  const [inserted] = await db
    .insert(assignments)
    .values({
      gameId: params.gameId,
      groupId: params.groupId,
      dueDate: params.dueDate ?? null,
      passPercentage: params.passPercentage ?? null,
    })
    .returning({ id: assignments.id })

  return (await fetchAssignmentById(db, inserted.id))!
}

export async function deleteAssignment(db: DB, assignmentId: string, tutorId: string): Promise<boolean> {
  // Security: only delete if the assignment's group belongs to the tutor
  const row = await db
    .select({ id: assignments.id })
    .from(assignments)
    .innerJoin(groups, eq(assignments.groupId, groups.id))
    .where(and(eq(assignments.id, assignmentId), eq(groups.tutorId, tutorId)))
    .limit(1)

  if (!row[0]) return false

  await db.delete(assignments).where(eq(assignments.id, assignmentId))
  return true
}

export async function updateAssignment(
  db: DB,
  assignmentId: string,
  tutorId: string,
  updates: { dueDate?: Date | null; passPercentage?: number | null }
): Promise<AssignmentRow | null> {
  const ownership = await db
    .select({ id: assignments.id })
    .from(assignments)
    .innerJoin(groups, eq(assignments.groupId, groups.id))
    .where(and(eq(assignments.id, assignmentId), eq(groups.tutorId, tutorId)))
    .limit(1)

  if (!ownership[0]) return null

  const setValues: Record<string, unknown> = {}
  if (updates.dueDate !== undefined) setValues.dueDate = updates.dueDate
  if (updates.passPercentage !== undefined) setValues.passPercentage = updates.passPercentage

  if (Object.keys(setValues).length > 0) {
    await db.update(assignments).set(setValues).where(eq(assignments.id, assignmentId))
  }

  return fetchAssignmentById(db, assignmentId)
}

export async function getGroupAssignments(db: DB, groupId: string, tutorId: string): Promise<AssignmentRow[]> {
  // Verify ownership
  const group = await db
    .select({ id: groups.id })
    .from(groups)
    .where(and(eq(groups.id, groupId), eq(groups.tutorId, tutorId)))
    .limit(1)
  if (!group[0]) return []

  const rows = await db
    .select({ id: assignments.id })
    .from(assignments)
    .where(eq(assignments.groupId, groupId))
    .orderBy(desc(assignments.createdAt))

  const results = await Promise.all(rows.map(r => fetchAssignmentById(db, r.id)))
  return results.filter(Boolean) as AssignmentRow[]
}

export async function isGameAssignedToGroup(db: DB, gameId: string, groupId: string): Promise<boolean> {
  const rows = await db
    .select({ id: assignments.id })
    .from(assignments)
    .where(and(eq(assignments.gameId, gameId), eq(assignments.groupId, groupId)))
    .limit(1)
  return rows.length > 0
}

async function enrichWithAttempts(
  db: DB,
  studentId: string,
  assignmentRows: AssignmentRow[]
): Promise<StudentAssignmentRow[]> {
  if (assignmentRows.length === 0) return []

  const assignmentIds = assignmentRows.map(a => a.id)
  const attempts = await db
    .select({
      id: gameAttempts.id,
      assignmentId: gameAttempts.assignmentId,
      scorePercentage: gameAttempts.scorePercentage,
    })
    .from(gameAttempts)
    .where(
      and(
        eq(gameAttempts.studentId, studentId),
        inArray(gameAttempts.assignmentId, assignmentIds)
      )
    )

  const now = new Date()
  return assignmentRows.map(assignment => {
    const myAttempts = attempts.filter(a => a.assignmentId === assignment.id)
    const bestScore = myAttempts.length > 0
      ? Math.max(...myAttempts.map(a => a.scorePercentage))
      : undefined
    const isCompleted = myAttempts.length > 0
    const isOverdue = !!(assignment.dueDate && assignment.dueDate < now)
    const isPassing = bestScore !== undefined && assignment.passPercentage != null
      ? bestScore >= assignment.passPercentage
      : undefined

    return {
      ...assignment,
      bestScore,
      attemptCount: myAttempts.length,
      isCompleted,
      isOverdue,
      isPassing,
    }
  })
}

export async function getStudentAssignments(
  db: DB,
  studentId: string
): Promise<StudentAssignmentRow[]> {
  const memberRows = await db
    .select({ groupId: groupMembers.groupId })
    .from(groupMembers)
    .where(eq(groupMembers.studentId, studentId))

  if (memberRows.length === 0) return []

  const groupIds = memberRows.map(r => r.groupId)
  const assignmentRows = await db
    .select({ id: assignments.id })
    .from(assignments)
    .where(inArray(assignments.groupId, groupIds))
    .orderBy(desc(assignments.createdAt))

  const full = await Promise.all(assignmentRows.map(r => fetchAssignmentById(db, r.id)))
  const valid = full.filter(Boolean) as AssignmentRow[]
  return enrichWithAttempts(db, studentId, valid)
}

export async function getStudentAssignmentById(
  db: DB,
  studentId: string,
  assignmentId: string
): Promise<StudentAssignmentRow | null> {
  // Check student has access (is in the assignment's group)
  const memberRows = await db
    .select({ groupId: groupMembers.groupId })
    .from(groupMembers)
    .where(eq(groupMembers.studentId, studentId))

  const groupIds = memberRows.map(r => r.groupId)
  if (groupIds.length === 0) return null

  const row = await db
    .select({ id: assignments.id })
    .from(assignments)
    .where(and(eq(assignments.id, assignmentId), inArray(assignments.groupId, groupIds)))
    .limit(1)

  if (!row[0]) return null

  const full = await fetchAssignmentById(db, assignmentId)
  if (!full) return null
  const [enriched] = await enrichWithAttempts(db, studentId, [full])
  return enriched
}

export async function getStudentStats(db: DB, studentId: string): Promise<{
  totalGroups: number
  totalAssignments: number
  completedAssignments: number
  averageScore: number
}> {
  const memberRows = await db
    .select({ groupId: groupMembers.groupId })
    .from(groupMembers)
    .where(eq(groupMembers.studentId, studentId))

  const totalGroups = memberRows.length
  if (totalGroups === 0) {
    return { totalGroups: 0, totalAssignments: 0, completedAssignments: 0, averageScore: 0 }
  }

  const groupIds = memberRows.map(r => r.groupId)
  const assignmentRows = await db
    .select({ id: assignments.id })
    .from(assignments)
    .where(inArray(assignments.groupId, groupIds))

  const totalAssignments = assignmentRows.length
  if (totalAssignments === 0) {
    return { totalGroups, totalAssignments: 0, completedAssignments: 0, averageScore: 0 }
  }

  const assignmentIds = assignmentRows.map(a => a.id)
  const attemptRows = await db
    .select({ assignmentId: gameAttempts.assignmentId, scorePercentage: gameAttempts.scorePercentage })
    .from(gameAttempts)
    .where(and(eq(gameAttempts.studentId, studentId), inArray(gameAttempts.assignmentId, assignmentIds)))

  const completedIds = new Set(attemptRows.map(a => a.assignmentId))
  const completedAssignments = completedIds.size

  let averageScore = 0
  if (attemptRows.length > 0) {
    const bestByAssignment = new Map<string, number>()
    for (const a of attemptRows) {
      const current = bestByAssignment.get(a.assignmentId) ?? 0
      if (a.scorePercentage > current) bestByAssignment.set(a.assignmentId, a.scorePercentage)
    }
    const scores = Array.from(bestByAssignment.values())
    averageScore = Math.round(scores.reduce((sum, s) => sum + s, 0) / scores.length)
  }

  return { totalGroups, totalAssignments, completedAssignments, averageScore }
}

export async function getStudentPersonalBests(db: DB, studentId: string): Promise<any[]> {
  const attempts = await db
    .select({
      scorePercentage: gameAttempts.scorePercentage,
      timeTaken: gameAttempts.timeTaken,
      completedAt: gameAttempts.createdAt,
      assignmentId: gameAttempts.assignmentId,
      gameId: assignments.gameId,
      gameName: games.name,
      gameType: games.gameType,
    })
    .from(gameAttempts)
    .innerJoin(assignments, eq(gameAttempts.assignmentId, assignments.id))
    .innerJoin(games, eq(assignments.gameId, games.id))
    .where(eq(gameAttempts.studentId, studentId))

  const byGame = new Map<string, typeof attempts>()
  for (const a of attempts) {
    if (!byGame.has(a.gameId)) byGame.set(a.gameId, [])
    byGame.get(a.gameId)!.push(a)
  }

  return Array.from(byGame.entries()).map(([gameId, list]) => {
    const bestScore = Math.max(...list.map(a => a.scorePercentage))
    const bestTime = Math.min(...list.map(a => a.timeTaken))
    const totalAttempts = list.length
    const avgScore = Math.round(list.reduce((s, a) => s + a.scorePercentage, 0) / totalAttempts)
    const lastPlayedAt = new Date(Math.max(...list.map(a => new Date(a.completedAt).getTime())))
    return {
      game: { id: gameId, name: list[0].gameName, gameType: list[0].gameType },
      bestScore,
      bestTime,
      totalAttempts,
      averageScore: avgScore,
      lastPlayedAt,
    }
  }).sort((a, b) => b.bestScore - a.bestScore)
}

export async function getStudentProgressTrends(db: DB, studentId: string, days = 30): Promise<any> {
  const cutoff = new Date()
  cutoff.setDate(cutoff.getDate() - days)

  const attempts = await db
    .select({
      scorePercentage: gameAttempts.scorePercentage,
      completedAt: gameAttempts.createdAt,
      gameType: games.gameType,
    })
    .from(gameAttempts)
    .innerJoin(assignments, eq(gameAttempts.assignmentId, assignments.id))
    .innerJoin(games, eq(assignments.gameId, games.id))
    .where(and(eq(gameAttempts.studentId, studentId), sql`${gameAttempts.createdAt} >= ${cutoff}`))
    .orderBy(gameAttempts.createdAt)

  const scoreOverTime = attempts.map((a, i) => ({
    date: new Date(a.completedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    score: a.scorePercentage,
    attemptNumber: i + 1,
  }))

  const byType = new Map<string, number[]>()
  for (const a of attempts) {
    if (!byType.has(a.gameType)) byType.set(a.gameType, [])
    byType.get(a.gameType)!.push(a.scorePercentage)
  }
  const performanceByGameType = Array.from(byType.entries()).map(([gameType, scores]) => ({
    gameType,
    averageScore: Math.round(scores.reduce((s, n) => s + n, 0) / scores.length),
    attempts: scores.length,
  }))

  const totalAttempts = attempts.length
  const averageScore = totalAttempts > 0
    ? Math.round(attempts.reduce((s, a) => s + a.scorePercentage, 0) / totalAttempts)
    : 0

  return { scoreOverTime, performanceByGameType, totalAttempts, averageScore, currentStreak: totalAttempts > 0 ? 1 : 0 }
}
