import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { supabase } from '@/lib/supabase';
import { saveGameAttempt, getMyAssignmentAttempts } from '@/services/supabase/game-attempt.service';

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

// ─── saveGameAttempt ──────────────────────────────────────────────────────────

describe('saveGameAttempt', () => {
  it('saves an attempt and returns the parsed result', async () => {
    const completedAt = new Date().toISOString();
    const rawAttempt = {
      id: 'attempt-1',
      assignmentId: 'assignment-1',
      studentId: 'student-1',
      scorePercentage: 85,
      timeTaken: 120,
      completedAt,
      attemptData: JSON.stringify({ answers: [true, false, true] }),
    };

    (supabase.from as Mock)
      // getCurrentStudentId → Student lookup
      .mockReturnValueOnce(createBuilder({ data: { id: 'student-1' }, error: null }))
      // insert GameAttempt
      .mockReturnValueOnce(createBuilder({ data: rawAttempt, error: null }));

    const result = await saveGameAttempt('assignment-1', 85, 120, {
      answers: [true, false, true],
    });

    expect(result).toMatchObject({
      id: 'attempt-1',
      assignmentId: 'assignment-1',
      scorePercentage: 85,
      timeTaken: 120,
    });
    expect(result.attemptData).toEqual({ answers: [true, false, true] });
    expect(result.completedAt).toBeInstanceOf(Date);
  });

  it('throws when the DB insert fails', async () => {
    (supabase.from as Mock)
      .mockReturnValueOnce(createBuilder({ data: { id: 'student-1' }, error: null }))
      .mockReturnValueOnce(
        createBuilder({ data: null, error: { message: 'constraint violation' } }),
      );

    await expect(saveGameAttempt('assignment-1', 85, 120, {})).rejects.toThrow(
      'Failed to save game attempt: constraint violation',
    );
  });
});

// ─── getMyAssignmentAttempts ──────────────────────────────────────────────────

describe('getMyAssignmentAttempts', () => {
  it('returns attempts for the assignment sorted by completedAt', async () => {
    const completedAt = new Date().toISOString();
    const rawAttempts = [
      {
        id: 'attempt-1',
        assignmentId: 'assignment-1',
        studentId: 'student-1',
        scorePercentage: 90,
        timeTaken: 100,
        completedAt,
        attemptData: JSON.stringify({}),
      },
    ];

    (supabase.from as Mock)
      .mockReturnValueOnce(createBuilder({ data: { id: 'student-1' }, error: null }))
      .mockReturnValueOnce(createBuilder({ data: rawAttempts, error: null }));

    const attempts = await getMyAssignmentAttempts('assignment-1');

    expect(attempts).toHaveLength(1);
    expect(attempts[0]).toMatchObject({
      id: 'attempt-1',
      scorePercentage: 90,
    });
    expect(attempts[0].completedAt).toBeInstanceOf(Date);
  });

  it('throws when the DB query fails', async () => {
    (supabase.from as Mock)
      .mockReturnValueOnce(createBuilder({ data: { id: 'student-1' }, error: null }))
      .mockReturnValueOnce(
        createBuilder({ data: null, error: { message: 'db error' } }),
      );

    await expect(getMyAssignmentAttempts('assignment-1')).rejects.toThrow(
      'Failed to fetch assignment attempts: db error',
    );
  });
});
