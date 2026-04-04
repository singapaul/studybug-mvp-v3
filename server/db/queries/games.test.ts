import { describe, test, expect, beforeEach } from 'bun:test'
import * as schema from '../schema'
import {
  getGamesByTutorId,
  getGameById,
  getGamesByType,
  createGame,
  updateGame,
  deleteGame,
  duplicateGame,
} from './games'
import { createTestDb } from '../test-helpers'

type TestDB = Awaited<ReturnType<typeof createTestDb>>

async function seedTutor(db: TestDB, clerkId = 'clerk_t1', email = 'tutor@example.com') {
  const [user] = await db.insert(schema.users).values({ clerkId, email, role: 'TUTOR' }).returning()
  const [tutor] = await db.insert(schema.tutors).values({ userId: user.id }).returning()
  return { user, tutor }
}

async function seedGroup(db: TestDB, tutorId: string, joinCode = 'ABC123') {
  const [group] = await db
    .insert(schema.groups)
    .values({ tutorId, name: 'Test Group', joinCode })
    .returning()
  return group
}

async function seedGame(
  db: TestDB,
  tutorId: string,
  overrides: Partial<{ name: string; gameType: 'PAIRS' | 'FLASHCARDS' | 'MULTIPLE_CHOICE' | 'SPLAT' | 'SWIPE'; gameData: object }> = {}
) {
  const [game] = await db
    .insert(schema.games)
    .values({
      tutorId,
      name: overrides.name ?? 'Test Game',
      gameType: overrides.gameType ?? 'FLASHCARDS',
      gameData: overrides.gameData ?? { cards: [] },
    })
    .returning()
  return game
}

describe('getGamesByTutorId', () => {
  test('returns empty array for tutor with no games', async () => {
    const db = await createTestDb()
    const { tutor } = await seedTutor(db)
    const result = await getGamesByTutorId(db, tutor.id)
    expect(result).toEqual([])
  })

  test('returns all games belonging to the tutor', async () => {
    const db = await createTestDb()
    const { tutor } = await seedTutor(db)
    await seedGame(db, tutor.id, { name: 'Game A' })
    await seedGame(db, tutor.id, { name: 'Game B' })
    const result = await getGamesByTutorId(db, tutor.id)
    expect(result).toHaveLength(2)
    expect(result.every(g => g.tutorId === tutor.id)).toBe(true)
  })

  test('does not return games belonging to a different tutor', async () => {
    const db = await createTestDb()
    const { tutor: tutor1 } = await seedTutor(db, 'clerk_t1', 'tutor1@example.com')
    const { tutor: tutor2 } = await seedTutor(db, 'clerk_t2', 'tutor2@example.com')
    await seedGame(db, tutor1.id, { name: 'Tutor1 Game' })
    const result = await getGamesByTutorId(db, tutor2.id)
    expect(result).toHaveLength(0)
  })

  test('returns assignmentCount = 0 when no assignments exist', async () => {
    const db = await createTestDb()
    const { tutor } = await seedTutor(db)
    await seedGame(db, tutor.id)
    const result = await getGamesByTutorId(db, tutor.id)
    expect(result[0].assignmentCount).toBe(0)
  })

  test('returns correct assignmentCount when assignments exist', async () => {
    const db = await createTestDb()
    const { tutor } = await seedTutor(db)
    const game = await seedGame(db, tutor.id)
    const group = await seedGroup(db, tutor.id)
    await db.insert(schema.assignments).values({ groupId: group.id, gameId: game.id })
    await db.insert(schema.assignments).values({ groupId: group.id, gameId: game.id })
    const result = await getGamesByTutorId(db, tutor.id)
    expect(result[0].assignmentCount).toBe(2)
  })
})

describe('getGameById', () => {
  test('returns null for unknown gameId', async () => {
    const db = await createTestDb()
    const { tutor } = await seedTutor(db)
    const result = await getGameById(db, '00000000-0000-0000-0000-000000000000', tutor.id)
    expect(result).toBeNull()
  })

  test('returns the game when found and tutorId matches', async () => {
    const db = await createTestDb()
    const { tutor } = await seedTutor(db)
    const game = await seedGame(db, tutor.id, { name: 'My Game', gameType: 'PAIRS', gameData: { items: [] } })
    const result = await getGameById(db, game.id, tutor.id)
    expect(result).not.toBeNull()
    expect(result!.id).toBe(game.id)
    expect(result!.name).toBe('My Game')
    expect(result!.gameType).toBe('PAIRS')
  })

  test('returns null when tutorId does not match (ownership guard)', async () => {
    const db = await createTestDb()
    const { tutor: tutor1 } = await seedTutor(db, 'clerk_t1', 'tutor1@example.com')
    const { tutor: tutor2 } = await seedTutor(db, 'clerk_t2', 'tutor2@example.com')
    const game = await seedGame(db, tutor1.id)
    const result = await getGameById(db, game.id, tutor2.id)
    expect(result).toBeNull()
  })

  test('includes assignmentCount', async () => {
    const db = await createTestDb()
    const { tutor } = await seedTutor(db)
    const game = await seedGame(db, tutor.id)
    const group = await seedGroup(db, tutor.id)
    await db.insert(schema.assignments).values({ groupId: group.id, gameId: game.id })
    const result = await getGameById(db, game.id, tutor.id)
    expect(result!.assignmentCount).toBe(1)
  })
})

describe('getGamesByType', () => {
  test('returns only games matching the specified type', async () => {
    const db = await createTestDb()
    const { tutor } = await seedTutor(db)
    await seedGame(db, tutor.id, { gameType: 'FLASHCARDS' })
    await seedGame(db, tutor.id, { gameType: 'PAIRS' })
    const result = await getGamesByType(db, tutor.id, 'FLASHCARDS')
    expect(result).toHaveLength(1)
    expect(result[0].gameType).toBe('FLASHCARDS')
  })

  test('returns empty array when no games of that type exist', async () => {
    const db = await createTestDb()
    const { tutor } = await seedTutor(db)
    await seedGame(db, tutor.id, { gameType: 'PAIRS' })
    const result = await getGamesByType(db, tutor.id, 'SPLAT')
    expect(result).toHaveLength(0)
  })

  test('excludes games from other tutors', async () => {
    const db = await createTestDb()
    const { tutor: tutor1 } = await seedTutor(db, 'clerk_t1', 'tutor1@example.com')
    const { tutor: tutor2 } = await seedTutor(db, 'clerk_t2', 'tutor2@example.com')
    await seedGame(db, tutor1.id, { gameType: 'FLASHCARDS' })
    const result = await getGamesByType(db, tutor2.id, 'FLASHCARDS')
    expect(result).toHaveLength(0)
  })
})

describe('createGame', () => {
  test('returns a new game with a generated UUID', async () => {
    const db = await createTestDb()
    const { tutor } = await seedTutor(db)
    const result = await createGame(db, {
      tutorId: tutor.id,
      name: 'New Game',
      gameType: 'PAIRS',
      gameData: { items: [{ id: '1', leftText: 'A', rightText: 'B' }] },
    })
    expect(result.id).toBeTruthy()
    expect(result.name).toBe('New Game')
    expect(result.gameType).toBe('PAIRS')
    expect(result.tutorId).toBe(tutor.id)
  })

  test('persists the game to the database', async () => {
    const db = await createTestDb()
    const { tutor } = await seedTutor(db)
    const created = await createGame(db, {
      tutorId: tutor.id,
      name: 'Persisted Game',
      gameType: 'FLASHCARDS',
      gameData: { cards: [] },
    })
    const found = await getGameById(db, created.id, tutor.id)
    expect(found).not.toBeNull()
    expect(found!.name).toBe('Persisted Game')
  })

  test('returns assignmentCount = 0 for new game', async () => {
    const db = await createTestDb()
    const { tutor } = await seedTutor(db)
    const result = await createGame(db, {
      tutorId: tutor.id,
      name: 'Fresh Game',
      gameType: 'SPLAT',
      gameData: { items: [] },
    })
    expect(result.assignmentCount).toBe(0)
  })
})

describe('updateGame', () => {
  test('updates the game name', async () => {
    const db = await createTestDb()
    const { tutor } = await seedTutor(db)
    const game = await seedGame(db, tutor.id, { name: 'Original Name' })
    const result = await updateGame(db, game.id, tutor.id, { name: 'Renamed' })
    expect(result).not.toBeNull()
    expect(result!.name).toBe('Renamed')
  })

  test('updates only the fields provided (partial update)', async () => {
    const db = await createTestDb()
    const { tutor } = await seedTutor(db)
    const game = await seedGame(db, tutor.id, { name: 'Keep Me', gameType: 'PAIRS' })
    const result = await updateGame(db, game.id, tutor.id, { name: 'Changed' })
    expect(result!.gameType).toBe('PAIRS')
  })

  test('returns null when gameId does not exist', async () => {
    const db = await createTestDb()
    const { tutor } = await seedTutor(db)
    const result = await updateGame(db, '00000000-0000-0000-0000-000000000000', tutor.id, { name: 'X' })
    expect(result).toBeNull()
  })

  test('returns null when tutorId does not match', async () => {
    const db = await createTestDb()
    const { tutor: tutor1 } = await seedTutor(db, 'clerk_t1', 'tutor1@example.com')
    const { tutor: tutor2 } = await seedTutor(db, 'clerk_t2', 'tutor2@example.com')
    const game = await seedGame(db, tutor1.id)
    const result = await updateGame(db, game.id, tutor2.id, { name: 'Hijacked' })
    expect(result).toBeNull()
  })
})

describe('deleteGame', () => {
  test('returns true and removes the game when found', async () => {
    const db = await createTestDb()
    const { tutor } = await seedTutor(db)
    const game = await seedGame(db, tutor.id)
    const deleted = await deleteGame(db, game.id, tutor.id)
    expect(deleted).toBe(true)
    const found = await getGameById(db, game.id, tutor.id)
    expect(found).toBeNull()
  })

  test('returns false when gameId does not exist', async () => {
    const db = await createTestDb()
    const { tutor } = await seedTutor(db)
    const result = await deleteGame(db, '00000000-0000-0000-0000-000000000000', tutor.id)
    expect(result).toBe(false)
  })

  test('returns false when tutorId does not match', async () => {
    const db = await createTestDb()
    const { tutor: tutor1 } = await seedTutor(db, 'clerk_t1', 'tutor1@example.com')
    const { tutor: tutor2 } = await seedTutor(db, 'clerk_t2', 'tutor2@example.com')
    const game = await seedGame(db, tutor1.id)
    const result = await deleteGame(db, game.id, tutor2.id)
    expect(result).toBe(false)
  })
})

describe('duplicateGame', () => {
  test('creates a copy with "(Copy)" appended to the name', async () => {
    const db = await createTestDb()
    const { tutor } = await seedTutor(db)
    const original = await seedGame(db, tutor.id, { name: 'Original' })
    const copy = await duplicateGame(db, original.id, tutor.id)
    expect(copy).not.toBeNull()
    expect(copy!.name).toBe('Original (Copy)')
  })

  test('copy gets a new UUID', async () => {
    const db = await createTestDb()
    const { tutor } = await seedTutor(db)
    const original = await seedGame(db, tutor.id)
    const copy = await duplicateGame(db, original.id, tutor.id)
    expect(copy!.id).not.toBe(original.id)
  })

  test('copy has assignmentCount = 0', async () => {
    const db = await createTestDb()
    const { tutor } = await seedTutor(db)
    const original = await seedGame(db, tutor.id)
    const group = await seedGroup(db, tutor.id)
    await db.insert(schema.assignments).values({ groupId: group.id, gameId: original.id })
    const copy = await duplicateGame(db, original.id, tutor.id)
    expect(copy!.assignmentCount).toBe(0)
  })

  test('returns null when source game does not exist', async () => {
    const db = await createTestDb()
    const { tutor } = await seedTutor(db)
    const result = await duplicateGame(db, '00000000-0000-0000-0000-000000000000', tutor.id)
    expect(result).toBeNull()
  })

  test('returns null when source game belongs to different tutor', async () => {
    const db = await createTestDb()
    const { tutor: tutor1 } = await seedTutor(db, 'clerk_t1', 'tutor1@example.com')
    const { tutor: tutor2 } = await seedTutor(db, 'clerk_t2', 'tutor2@example.com')
    const original = await seedGame(db, tutor1.id)
    const result = await duplicateGame(db, original.id, tutor2.id)
    expect(result).toBeNull()
  })
})
