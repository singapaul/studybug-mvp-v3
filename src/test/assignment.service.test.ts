import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { supabase } from '@/lib/supabase';
import {
  createAssignment,
  getGroupAssignments,
} from '@/services/supabase/assignment.service';

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

beforeEach(() => {
  vi.clearAllMocks();
});

// ─── createAssignment ─────────────────────────────────────────────────────────

describe('createAssignment', () => {
  it('inserts an assignment and returns it with related data', async () => {
    const now = new Date().toISOString();
    const rawAssignment = {
      id: 'assignment-1',
      gameId: 'game-1',
      groupId: 'group-1',
      dueDate: null,
      passPercentage: 80,
      createdAt: now,
      updatedAt: now,
      game: { id: 'game-1', name: 'Vocab Quiz', gameType: 'FLASHCARD' },
      group: { id: 'group-1', name: 'Year 7 Maths' },
    };

    (supabase.from as Mock).mockReturnValueOnce(
      createBuilder({ data: rawAssignment, error: null }),
    );

    const result = await createAssignment({
      gameId: 'game-1',
      groupId: 'group-1',
      passPercentage: 80,
    });

    expect(result).toMatchObject({
      id: 'assignment-1',
      gameId: 'game-1',
      groupId: 'group-1',
      passPercentage: 80,
    });
  });

  it('throws when the DB insert fails', async () => {
    (supabase.from as Mock).mockReturnValueOnce(
      createBuilder({ data: null, error: { message: 'foreign key violation' } }),
    );

    await expect(
      createAssignment({ gameId: 'game-1', groupId: 'group-1' }),
    ).rejects.toThrow('Failed to create assignment: foreign key violation');
  });
});

// ─── getGroupAssignments ──────────────────────────────────────────────────────

describe('getGroupAssignments', () => {
  it('returns all assignments for a group', async () => {
    const now = new Date().toISOString();
    const rawAssignments = [
      {
        id: 'assignment-1',
        gameId: 'game-1',
        groupId: 'group-1',
        dueDate: null,
        passPercentage: null,
        createdAt: now,
        updatedAt: now,
        game: { id: 'game-1', name: 'Vocab Quiz', gameType: 'FLASHCARD' },
        gameAttempts: [],
      },
    ];

    (supabase.from as Mock).mockReturnValueOnce(
      createBuilder({ data: rawAssignments, error: null }),
    );

    const assignments = await getGroupAssignments('group-1');

    expect(assignments).toHaveLength(1);
    expect(assignments[0]).toMatchObject({ id: 'assignment-1', groupId: 'group-1' });
  });

  it('throws when the DB query fails', async () => {
    (supabase.from as Mock).mockReturnValueOnce(
      createBuilder({ data: null, error: { message: 'query error' } }),
    );

    await expect(getGroupAssignments('group-1')).rejects.toThrow(
      'Failed to fetch group assignments: query error',
    );
  });
});
