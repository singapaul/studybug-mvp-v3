import { eq, and, desc } from 'drizzle-orm'
import { sql } from 'drizzle-orm'
import type { DB } from '../index'
import { games, assignments } from '../schema'
import type { SelectGame } from '../schema'

export type GameRow = SelectGame & { assignmentCount: number }

export type CreateGameParams = {
  tutorId: string
  name: string
  gameType: 'PAIRS' | 'FLASHCARDS' | 'MULTIPLE_CHOICE' | 'SPLAT' | 'SWIPE'
  gameData: Record<string, unknown>
}

export type UpdateGameParams = {
  name?: string
  gameData?: Record<string, unknown>
}

const gameSelect = {
  id: games.id,
  tutorId: games.tutorId,
  name: games.name,
  gameType: games.gameType,
  gameData: games.gameData,
  createdAt: games.createdAt,
  updatedAt: games.updatedAt,
  assignmentCount: sql<number>`(SELECT COUNT(*) FROM assignments WHERE assignments.game_id = games.id)`.mapWith(Number),
}

export async function getGamesByTutorId(db: DB, tutorId: string): Promise<GameRow[]> {
  return db
    .select(gameSelect)
    .from(games)
    .where(eq(games.tutorId, tutorId))
    .orderBy(desc(games.createdAt)) as Promise<GameRow[]>
}

export async function getGameById(db: DB, gameId: string, tutorId: string): Promise<GameRow | null> {
  const rows = await db
    .select(gameSelect)
    .from(games)
    .where(and(eq(games.id, gameId), eq(games.tutorId, tutorId)))
    .limit(1) as GameRow[]
  return rows[0] ?? null
}

export async function getGamesByType(
  db: DB,
  tutorId: string,
  gameType: 'PAIRS' | 'FLASHCARDS' | 'MULTIPLE_CHOICE' | 'SPLAT' | 'SWIPE'
): Promise<GameRow[]> {
  return db
    .select(gameSelect)
    .from(games)
    .where(and(eq(games.tutorId, tutorId), eq(games.gameType, gameType)))
    .orderBy(desc(games.createdAt)) as Promise<GameRow[]>
}

export async function createGame(db: DB, params: CreateGameParams): Promise<GameRow> {
  const [inserted] = await db
    .insert(games)
    .values({
      tutorId: params.tutorId,
      name: params.name,
      gameType: params.gameType,
      gameData: params.gameData,
    })
    .returning({ id: games.id })

  const row = await getGameById(db, inserted.id, params.tutorId)
  return row!
}

export async function updateGame(
  db: DB,
  gameId: string,
  tutorId: string,
  params: UpdateGameParams
): Promise<GameRow | null> {
  const setValues: Record<string, unknown> = { updatedAt: new Date() }
  if (params.name !== undefined) setValues.name = params.name
  if (params.gameData !== undefined) setValues.gameData = params.gameData

  const updated = await db
    .update(games)
    .set(setValues)
    .where(and(eq(games.id, gameId), eq(games.tutorId, tutorId)))
    .returning({ id: games.id })

  if (updated.length === 0) return null
  return getGameById(db, gameId, tutorId)
}

export async function deleteGame(db: DB, gameId: string, tutorId: string): Promise<boolean> {
  const deleted = await db
    .delete(games)
    .where(and(eq(games.id, gameId), eq(games.tutorId, tutorId)))
    .returning({ id: games.id })
  return deleted.length > 0
}

export async function duplicateGame(db: DB, gameId: string, tutorId: string): Promise<GameRow | null> {
  const source = await getGameById(db, gameId, tutorId)
  if (!source) return null

  return createGame(db, {
    tutorId,
    name: `${source.name} (Copy)`,
    gameType: source.gameType,
    gameData: source.gameData as Record<string, unknown>,
  })
}
