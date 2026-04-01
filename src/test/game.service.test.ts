import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { supabase } from '@/lib/supabase';
import {
  getMyGames,
  createGame,
  deleteGame,
  isGameAssigned,
} from '@/services/supabase/game.service';

vi.mock('@/lib/supabase', () => ({
  supabase: {
    auth: { getUser: vi.fn() },
    from: vi.fn(),
  },
}));

function createBuilder(result: { data: unknown; error: unknown }) {
  const builder = {
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    neq: vi.fn().mockReturnThis(),
    in: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    limit: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue(result),
    then: (
      resolve: (v: unknown) => unknown,
      reject?: (e: unknown) => unknown,
    ) => Promise.resolve(result).then(resolve, reject),
  };
  return builder;
}

const mockUser = { id: 'user-123' };

beforeEach(() => {
  vi.clearAllMocks();
  (supabase.auth.getUser as Mock).mockResolvedValue({
    data: { user: mockUser },
    error: null,
  });
});

// ─── getMyGames ───────────────────────────────────────────────────────────────

describe('getMyGames', () => {
  it('returns mapped games for the current user', async () => {
    const now = new Date().toISOString();
    const rawGame = {
      id: 'game-1',
      userId: 'user-123',
      name: 'Vocab Quiz',
      gameType: 'FLASHCARD',
      gameData: null,
      createdAt: now,
      updatedAt: now,
      assignments: [{ count: 2 }],
    };

    (supabase.from as Mock).mockReturnValueOnce(
      createBuilder({ data: [rawGame], error: null }),
    );

    const games = await getMyGames();

    expect(games).toHaveLength(1);
    expect(games[0]).toMatchObject({
      id: 'game-1',
      userId: 'user-123',
      name: 'Vocab Quiz',
      gameType: 'FLASHCARD',
      _count: { assignments: 2 },
    });
    expect(games[0].createdAt).toBeInstanceOf(Date);
  });

  it('throws when the DB returns an error', async () => {
    (supabase.from as Mock).mockReturnValueOnce(
      createBuilder({ data: null, error: { message: 'connection refused' } }),
    );

    await expect(getMyGames()).rejects.toThrow('Failed to fetch games: connection refused');
  });

  it('throws when there is no authenticated user', async () => {
    (supabase.auth.getUser as Mock).mockResolvedValue({
      data: { user: null },
      error: null,
    });

    await expect(getMyGames()).rejects.toThrow('No authenticated user');
  });
});

// ─── createGame ──────────────────────────────────────────────────────────────

describe('createGame', () => {
  it('inserts a game and returns the parsed result', async () => {
    const now = new Date().toISOString();
    const rawGame = {
      id: 'game-new',
      userId: 'user-123',
      name: 'Spelling Test',
      gameType: 'WORD_SCRAMBLE',
      gameData: JSON.stringify({ words: ['cat', 'dog'] }),
      createdAt: now,
      updatedAt: now,
    };

    (supabase.from as Mock).mockReturnValueOnce(
      createBuilder({ data: rawGame, error: null }),
    );

    const result = await createGame({
      name: 'Spelling Test',
      gameType: 'WORD_SCRAMBLE' as import('@/types/game').GameType,
      gameData: { words: ['cat', 'dog'] } as import('@/types/game').GameData,
    });

    expect(result).toMatchObject({
      id: 'game-new',
      name: 'Spelling Test',
      gameType: 'WORD_SCRAMBLE',
    });
    expect(result.gameData).toEqual({ words: ['cat', 'dog'] });
  });

  it('throws when the DB insert fails', async () => {
    (supabase.from as Mock).mockReturnValueOnce(
      createBuilder({ data: null, error: { message: 'unique constraint' } }),
    );

    await expect(
      createGame({
        name: 'Test',
        gameType: 'FLASHCARD' as import('@/types/game').GameType,
        gameData: {} as import('@/types/game').GameData,
      }),
    ).rejects.toThrow('Failed to create game: unique constraint');
  });
});

// ─── deleteGame ───────────────────────────────────────────────────────────────

describe('deleteGame', () => {
  it('resolves without error on success', async () => {
    (supabase.from as Mock).mockReturnValueOnce(
      createBuilder({ data: null, error: null }),
    );

    await expect(deleteGame('game-1')).resolves.toBeUndefined();
  });

  it('throws when the DB delete fails', async () => {
    (supabase.from as Mock).mockReturnValueOnce(
      createBuilder({ data: null, error: { message: 'foreign key violation' } }),
    );

    await expect(deleteGame('game-1')).rejects.toThrow(
      'Failed to delete game: foreign key violation',
    );
  });
});

// ─── isGameAssigned ───────────────────────────────────────────────────────────

describe('isGameAssigned', () => {
  it('returns true when there are existing assignments', async () => {
    (supabase.from as Mock).mockReturnValueOnce(
      createBuilder({ data: [{ id: 'assignment-1' }], error: null }),
    );

    const result = await isGameAssigned('game-1');

    expect(result).toBe(true);
  });

  it('returns false when there are no assignments', async () => {
    (supabase.from as Mock).mockReturnValueOnce(
      createBuilder({ data: [], error: null }),
    );

    const result = await isGameAssigned('game-1');

    expect(result).toBe(false);
  });
});
