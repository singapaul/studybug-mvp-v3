import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { supabase } from '@/lib/supabase';
import {
  getMyGroups,
  createGroup,
  getGroupByJoinCode,
  removeStudentFromGroup,
} from '@/services/supabase/group.service';

vi.mock('@/lib/supabase', () => ({
  supabase: {
    auth: { getUser: vi.fn() },
    from: vi.fn(),
  },
}));

vi.mock('@/lib/error-logger', () => ({
  logError: vi.fn(),
  logWarning: vi.fn(),
}));

vi.mock('@/lib/join-code', () => ({
  generateJoinCode: vi.fn().mockReturnValue('XYZ789'),
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

// ─── getMyGroups ──────────────────────────────────────────────────────────────

describe('getMyGroups', () => {
  it('returns groups for the current tutor', async () => {
    const now = new Date().toISOString();
    const rawGroup = {
      id: 'group-1',
      tutorId: 'tutor-123',
      name: 'Year 7 Maths',
      ageRange: '11-12',
      subjectArea: 'Maths',
      joinCode: 'ABC123',
      createdAt: now,
      updatedAt: now,
      members: [{ count: 5 }],
      assignments: [{ count: 3 }],
    };

    (supabase.from as Mock)
      // getCurrentTutorId → Tutor lookup
      .mockReturnValueOnce(createBuilder({ data: { id: 'tutor-123' }, error: null }))
      // Group query
      .mockReturnValueOnce(createBuilder({ data: [rawGroup], error: null }));

    const groups = await getMyGroups();

    expect(groups).toHaveLength(1);
    expect(groups[0]).toMatchObject({
      id: 'group-1',
      name: 'Year 7 Maths',
      _count: { members: 5, assignments: 3 },
    });
    expect(groups[0].createdAt).toBeInstanceOf(Date);
  });

  it('throws when tutor profile is not found', async () => {
    (supabase.from as Mock).mockReturnValueOnce(
      createBuilder({ data: null, error: { message: 'not found', code: 'PGRST116' } }),
    );

    await expect(getMyGroups()).rejects.toMatchObject({ code: 'UNKNOWN_ERROR' });
  });

  it('throws when the Group query fails', async () => {
    (supabase.from as Mock)
      .mockReturnValueOnce(createBuilder({ data: { id: 'tutor-123' }, error: null }))
      .mockReturnValueOnce(
        createBuilder({ data: null, error: { message: 'connection failed' } }),
      );

    await expect(getMyGroups()).rejects.toMatchObject({ code: 'UNKNOWN_ERROR' });
  });
});

// ─── createGroup ──────────────────────────────────────────────────────────────

describe('createGroup', () => {
  it('creates a group and returns it with zero counts', async () => {
    const now = new Date().toISOString();
    const rawGroup = {
      id: 'group-new',
      tutorId: 'tutor-123',
      name: 'Year 8 Science',
      ageRange: null,
      subjectArea: null,
      joinCode: 'XYZ789',
      createdAt: now,
      updatedAt: now,
    };

    (supabase.from as Mock)
      // getCurrentTutorId → Tutor lookup
      .mockReturnValueOnce(createBuilder({ data: { id: 'tutor-123' }, error: null }))
      // generateUniqueJoinCode → check joinCode uniqueness (empty = no conflict)
      .mockReturnValueOnce(createBuilder({ data: [], error: null }))
      // insert new group
      .mockReturnValueOnce(createBuilder({ data: rawGroup, error: null }));

    const group = await createGroup({ name: 'Year 8 Science' });

    expect(group).toMatchObject({
      id: 'group-new',
      name: 'Year 8 Science',
      joinCode: 'XYZ789',
      _count: { members: 0, assignments: 0 },
    });
  });

  it('rejects with VALIDATION_ERROR when name is empty', async () => {
    (supabase.from as Mock).mockReturnValueOnce(
      createBuilder({ data: { id: 'tutor-123' }, error: null }),
    );

    await expect(createGroup({ name: '   ' })).rejects.toMatchObject({
      code: 'VALIDATION_ERROR',
      field: 'name',
    });
  });
});

// ─── getGroupByJoinCode ───────────────────────────────────────────────────────

describe('getGroupByJoinCode', () => {
  it('returns the group when a matching join code exists', async () => {
    const now = new Date().toISOString();
    const rawGroup = {
      id: 'group-1',
      tutorId: 'tutor-123',
      name: 'Year 7 Maths',
      ageRange: null,
      subjectArea: null,
      joinCode: 'ABC123',
      createdAt: now,
      updatedAt: now,
    };

    (supabase.from as Mock).mockReturnValueOnce(
      createBuilder({ data: rawGroup, error: null }),
    );

    const group = await getGroupByJoinCode('abc123'); // normalises to uppercase

    expect(group).toMatchObject({ id: 'group-1', joinCode: 'ABC123' });
  });

  it('returns null when the join code does not exist', async () => {
    (supabase.from as Mock).mockReturnValueOnce(
      createBuilder({ data: null, error: { code: 'PGRST116', message: 'not found' } }),
    );

    const group = await getGroupByJoinCode('XXXXXX');

    expect(group).toBeNull();
  });

  it('rejects with INVALID_INPUT when called with an empty code', async () => {
    await expect(getGroupByJoinCode('')).rejects.toMatchObject({
      code: 'INVALID_INPUT',
    });
  });
});

// ─── removeStudentFromGroup ───────────────────────────────────────────────────

describe('removeStudentFromGroup', () => {
  it('resolves without error on success', async () => {
    (supabase.from as Mock).mockReturnValueOnce(
      createBuilder({ data: null, error: null }),
    );

    await expect(
      removeStudentFromGroup('group-1', 'student-1'),
    ).resolves.toBeUndefined();
  });

  it('throws when the delete fails', async () => {
    (supabase.from as Mock).mockReturnValueOnce(
      createBuilder({ data: null, error: { message: 'permission denied' } }),
    );

    await expect(removeStudentFromGroup('group-1', 'student-1')).rejects.toThrow(
      'Failed to remove student from group: permission denied',
    );
  });
});
