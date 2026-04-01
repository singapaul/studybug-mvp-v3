import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { supabase } from '@/lib/supabase';
import { joinGroup, getMyGroups } from '@/services/supabase/student.service';

vi.mock('@/lib/supabase', () => ({
  supabase: {
    auth: { getUser: vi.fn() },
    from: vi.fn(),
  },
}));

// group.service imports error-logger; mock it to suppress console output
vi.mock('@/lib/error-logger', () => ({
  logError: vi.fn(),
  logWarning: vi.fn(),
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

// ─── joinGroup ────────────────────────────────────────────────────────────────

describe('joinGroup', () => {
  it('successfully joins a group with a valid code', async () => {
    const now = new Date().toISOString();
    const rawGroup = {
      id: 'group-1',
      tutorId: 'tutor-1',
      name: 'Year 7 Maths',
      ageRange: null,
      subjectArea: null,
      joinCode: 'ABC123',
      createdAt: now,
      updatedAt: now,
    };

    (supabase.from as Mock)
      // getCurrentStudentId → Student lookup
      .mockReturnValueOnce(createBuilder({ data: { id: 'student-1' }, error: null }))
      // getGroupByJoinCode → Group lookup
      .mockReturnValueOnce(createBuilder({ data: rawGroup, error: null }))
      // existing membership check → not a member
      .mockReturnValueOnce(
        createBuilder({ data: null, error: { code: 'PGRST116', message: 'not found' } }),
      )
      // insert GroupMember
      .mockReturnValueOnce(createBuilder({ data: null, error: null }));

    const result = await joinGroup('abc123');

    expect(result).toEqual({ success: true, groupName: 'Year 7 Maths' });
  });

  it('returns failure when the join code does not exist', async () => {
    (supabase.from as Mock)
      // getCurrentStudentId
      .mockReturnValueOnce(createBuilder({ data: { id: 'student-1' }, error: null }))
      // getGroupByJoinCode → not found (PGRST116)
      .mockReturnValueOnce(
        createBuilder({ data: null, error: { code: 'PGRST116', message: 'not found' } }),
      );

    const result = await joinGroup('XXXXXX');

    expect(result).toEqual({
      success: false,
      error: 'Invalid join code. Please check and try again.',
    });
  });

  it('returns failure when the student is already a member', async () => {
    const now = new Date().toISOString();
    const rawGroup = {
      id: 'group-1',
      tutorId: 'tutor-1',
      name: 'Year 7 Maths',
      ageRange: null,
      subjectArea: null,
      joinCode: 'ABC123',
      createdAt: now,
      updatedAt: now,
    };

    (supabase.from as Mock)
      // getCurrentStudentId
      .mockReturnValueOnce(createBuilder({ data: { id: 'student-1' }, error: null }))
      // getGroupByJoinCode → found
      .mockReturnValueOnce(createBuilder({ data: rawGroup, error: null }))
      // existing membership check → already a member
      .mockReturnValueOnce(createBuilder({ data: { id: 'member-1' }, error: null }));

    const result = await joinGroup('ABC123');

    expect(result).toEqual({
      success: false,
      error: "You're already a member of this group.",
    });
  });

  it('returns failure when not authenticated', async () => {
    (supabase.auth.getUser as Mock).mockResolvedValue({
      data: { user: null },
      error: { message: 'not authenticated' },
    });

    const result = await joinGroup('ABC123');

    expect(result).toEqual({ success: false, error: 'Not authenticated' });
  });
});

// ─── getMyGroups (student) ────────────────────────────────────────────────────

describe('getMyGroups', () => {
  it('returns all groups the student belongs to', async () => {
    const now = new Date().toISOString();
    const rawMembership = {
      group: {
        id: 'group-1',
        tutorId: 'tutor-1',
        name: 'Year 7 Maths',
        ageRange: null,
        subjectArea: null,
        joinCode: 'ABC123',
        createdAt: now,
        updatedAt: now,
      },
    };

    (supabase.from as Mock)
      // getCurrentStudentId
      .mockReturnValueOnce(createBuilder({ data: { id: 'student-1' }, error: null }))
      // GroupMember query with nested Group
      .mockReturnValueOnce(createBuilder({ data: [rawMembership], error: null }));

    const groups = await getMyGroups();

    expect(groups).toHaveLength(1);
    expect(groups[0]).toMatchObject({ id: 'group-1', name: 'Year 7 Maths' });
    expect(groups[0].createdAt).toBeInstanceOf(Date);
  });

  it('throws when the DB query fails', async () => {
    (supabase.from as Mock)
      .mockReturnValueOnce(createBuilder({ data: { id: 'student-1' }, error: null }))
      .mockReturnValueOnce(
        createBuilder({ data: null, error: { message: 'query failed' } }),
      );

    await expect(getMyGroups()).rejects.toThrow('Failed to fetch student groups: query failed');
  });
});
