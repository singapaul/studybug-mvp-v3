import { eq, and, sql } from 'drizzle-orm'
import type { DB } from '../index'
import { groups, groupMembers, assignments, games, students, users } from '../schema'
import type { SelectGroup } from '../schema'

export type GroupRow = SelectGroup & { memberCount: number; assignmentCount: number }

export type MemberRow = {
  groupId: string
  studentId: string
  joinedAt: Date
  student: {
    id: string
    user: { id: string; email: string }
  }
}

export type GroupAssignmentRow = {
  id: string
  gameId: string
  dueDate: Date | null
  passPercentage: number | null
  game: { id: string; name: string; gameType: string }
}

export type GroupWithDetailsRow = GroupRow & {
  members: MemberRow[]
  assignments: GroupAssignmentRow[]
}

export type CreateGroupParams = {
  tutorId: string
  name: string
  ageRange?: string
  subjectArea?: string
}

export type UpdateGroupParams = {
  name?: string
  ageRange?: string | null
  subjectArea?: string | null
}

const groupSelect = {
  id: groups.id,
  tutorId: groups.tutorId,
  name: groups.name,
  joinCode: groups.joinCode,
  ageRange: groups.ageRange,
  subjectArea: groups.subjectArea,
  createdAt: groups.createdAt,
  memberCount: sql<number>`(SELECT COUNT(*) FROM group_members WHERE group_members.group_id = groups.id)`.mapWith(Number),
  assignmentCount: sql<number>`(SELECT COUNT(*) FROM assignments WHERE assignments.group_id = groups.id)`.mapWith(Number),
}

function generateJoinCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let code = ''
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)]
  }
  return code
}

export async function getGroupsByTutorId(db: DB, tutorId: string): Promise<GroupRow[]> {
  return db
    .select(groupSelect)
    .from(groups)
    .where(eq(groups.tutorId, tutorId)) as Promise<GroupRow[]>
}

async function getGroupWithDetails(db: DB, groupId: string): Promise<GroupWithDetailsRow | null> {
  const rows = await db
    .select(groupSelect)
    .from(groups)
    .where(eq(groups.id, groupId))
    .limit(1) as GroupRow[]

  if (!rows[0]) return null
  const group = rows[0]

  const memberRows = await db
    .select({
      groupId: groupMembers.groupId,
      studentId: groupMembers.studentId,
      joinedAt: groupMembers.joinedAt,
      studentUserId: users.id,
      studentUserEmail: users.email,
    })
    .from(groupMembers)
    .innerJoin(students, eq(groupMembers.studentId, students.id))
    .innerJoin(users, eq(students.userId, users.id))
    .where(eq(groupMembers.groupId, groupId))

  const assignmentRows = await db
    .select({
      id: assignments.id,
      gameId: assignments.gameId,
      dueDate: assignments.dueDate,
      passPercentage: assignments.passPercentage,
      gameName: games.name,
      gameType: games.gameType,
    })
    .from(assignments)
    .innerJoin(games, eq(assignments.gameId, games.id))
    .where(eq(assignments.groupId, groupId))

  return {
    ...group,
    members: memberRows.map(r => ({
      groupId: r.groupId,
      studentId: r.studentId,
      joinedAt: r.joinedAt,
      student: {
        id: r.studentId,
        user: { id: r.studentUserId, email: r.studentUserEmail },
      },
    })),
    assignments: assignmentRows.map(r => ({
      id: r.id,
      gameId: r.gameId,
      dueDate: r.dueDate,
      passPercentage: r.passPercentage,
      game: { id: r.gameId, name: r.gameName, gameType: r.gameType },
    })),
  }
}

export async function getGroupById(
  db: DB,
  groupId: string,
  tutorId: string
): Promise<GroupWithDetailsRow | null> {
  const rows = await db
    .select({ id: groups.id })
    .from(groups)
    .where(and(eq(groups.id, groupId), eq(groups.tutorId, tutorId)))
    .limit(1)

  if (!rows[0]) return null
  return getGroupWithDetails(db, groupId)
}

export async function getGroupByJoinCode(db: DB, joinCode: string): Promise<GroupRow | null> {
  const normalized = joinCode.toUpperCase().trim()
  const rows = await db
    .select(groupSelect)
    .from(groups)
    .where(sql`UPPER(${groups.joinCode}) = ${normalized}`)
    .limit(1) as GroupRow[]
  return rows[0] ?? null
}

export async function createGroup(db: DB, params: CreateGroupParams): Promise<GroupRow> {
  let joinCode = generateJoinCode()
  let attempts = 0

  while (attempts < 10) {
    const existing = await db
      .select({ id: groups.id })
      .from(groups)
      .where(eq(groups.joinCode, joinCode))
      .limit(1)
    if (!existing[0]) break
    joinCode = generateJoinCode()
    attempts++
  }

  const [inserted] = await db
    .insert(groups)
    .values({
      tutorId: params.tutorId,
      name: params.name.trim(),
      joinCode,
      ageRange: params.ageRange ?? null,
      subjectArea: params.subjectArea ?? null,
    })
    .returning({ id: groups.id })

  const rows = await db.select(groupSelect).from(groups).where(eq(groups.id, inserted.id)) as GroupRow[]
  return rows[0]
}

export async function updateGroup(
  db: DB,
  groupId: string,
  tutorId: string,
  params: UpdateGroupParams
): Promise<GroupRow | null> {
  const setValues: Record<string, unknown> = {}
  if (params.name !== undefined) setValues.name = params.name.trim()
  if (params.ageRange !== undefined) setValues.ageRange = params.ageRange
  if (params.subjectArea !== undefined) setValues.subjectArea = params.subjectArea

  if (Object.keys(setValues).length === 0) {
    const rows = await db
      .select(groupSelect)
      .from(groups)
      .where(and(eq(groups.id, groupId), eq(groups.tutorId, tutorId)))
      .limit(1) as GroupRow[]
    return rows[0] ?? null
  }

  const updated = await db
    .update(groups)
    .set(setValues)
    .where(and(eq(groups.id, groupId), eq(groups.tutorId, tutorId)))
    .returning({ id: groups.id })

  if (updated.length === 0) return null

  const rows = await db.select(groupSelect).from(groups).where(eq(groups.id, groupId)) as GroupRow[]
  return rows[0] ?? null
}

export async function deleteGroup(db: DB, groupId: string, tutorId: string): Promise<boolean> {
  const deleted = await db
    .delete(groups)
    .where(and(eq(groups.id, groupId), eq(groups.tutorId, tutorId)))
    .returning({ id: groups.id })
  return deleted.length > 0
}

export async function addStudentToGroup(db: DB, groupId: string, studentId: string): Promise<boolean> {
  const existing = await db
    .select({ groupId: groupMembers.groupId })
    .from(groupMembers)
    .where(and(eq(groupMembers.groupId, groupId), eq(groupMembers.studentId, studentId)))
    .limit(1)

  if (existing[0]) return false

  await db.insert(groupMembers).values({ groupId, studentId })
  return true
}

export async function removeStudentFromGroup(db: DB, groupId: string, studentId: string): Promise<boolean> {
  const deleted = await db
    .delete(groupMembers)
    .where(and(eq(groupMembers.groupId, groupId), eq(groupMembers.studentId, studentId)))
    .returning({ groupId: groupMembers.groupId })
  return deleted.length > 0
}

export async function getGroupMemberEmails(db: DB, groupId: string): Promise<Array<{ email: string }>> {
  return db
    .select({ email: users.email })
    .from(groupMembers)
    .innerJoin(students, eq(groupMembers.studentId, students.id))
    .innerJoin(users, eq(students.userId, users.id))
    .where(eq(groupMembers.groupId, groupId))
}

export async function getGroupsByStudentId(db: DB, studentId: string): Promise<GroupWithDetailsRow[]> {
  const memberRows = await db
    .select({ groupId: groupMembers.groupId })
    .from(groupMembers)
    .where(eq(groupMembers.studentId, studentId))

  const results = await Promise.all(
    memberRows.map(r => getGroupWithDetails(db, r.groupId))
  )
  return results.filter(Boolean) as GroupWithDetailsRow[]
}
