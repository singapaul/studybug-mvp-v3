/**
 * Supabase Group Service (Auth UID Based)
 * All functions use the current authenticated user
 */

import { supabase } from '@/lib/supabase';
import { Group, GroupWithDetails, CreateGroupInput, GroupMember } from '@/types/group';
import { generateJoinCode } from '@/lib/join-code';
import { createErrorResponse, ErrorCode, handleAppError } from '@/lib/error-handling';
import { logError, logWarning } from '@/lib/error-logger';

/**
 * Get Tutor ID for current authenticated user
 */
async function getCurrentTutorId(): Promise<string> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('No authenticated user');
  }

  const { data, error } = await supabase.from('Tutor').select('id').eq('userId', user.id).single();

  if (error || !data) {
    throw new Error('Tutor profile not found');
  }

  return data.id;
}

/**
 * Get Student ID for current authenticated user
 */
async function getCurrentStudentId(): Promise<string> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('No authenticated user');
  }

  const { data, error } = await supabase
    .from('Student')
    .select('id')
    .eq('userId', user.id)
    .single();

  if (error || !data) {
    throw new Error('Student profile not found');
  }

  return data.id;
}

/**
 * Get all groups for current authenticated tutor
 */
export async function getMyGroups(): Promise<Group[]> {
  try {
    const tutorId = await getCurrentTutorId();

    const { data, error } = await supabase
      .from('Group')
      .select(
        `
        *,
        members:GroupMember(count),
        assignments:Assignment(count)
      `
      )
      .eq('tutorId', tutorId)
      .order('createdAt', { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return data.map((group) => ({
      id: group.id,
      tutorId: group.tutorId,
      name: group.name,
      ageRange: group.ageRange,
      subjectArea: group.subjectArea,
      joinCode: group.joinCode,
      createdAt: new Date(group.createdAt),
      updatedAt: new Date(group.updatedAt),
      _count: {
        members: group.members?.[0]?.count || 0,
        assignments: group.assignments?.[0]?.count || 0,
      },
    }));
  } catch (error) {
    const appError = handleAppError(error);
    logError('Failed to get groups', error, {
      action: 'get_my_groups',
    });
    throw appError;
  }
}

/**
 * Get a single group by ID with full details
 */
export async function getGroupById(groupId: string): Promise<GroupWithDetails | null> {
  try {
    if (!groupId) {
      throw createErrorResponse(
        ErrorCode.INVALID_INPUT,
        'Group ID is required',
        'getGroupById called without groupId',
        400
      );
    }

    const { data, error } = await supabase
      .from('Group')
      .select(
        `
        *,
        members:GroupMember(
          id,
          groupId,
          studentId,
          joinedAt,
          student:Student(
            id,
            user:User(
              id,
              email
            )
          )
        ),
        assignments:Assignment(
          id,
          gameId,
          dueDate,
          passPercentage,
          game:Game(
            id,
            name,
            gameType
          )
        )
      `
      )
      .eq('id', groupId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        logWarning('Group not found', null, {
          action: 'get_group_by_id',
          groupId,
        });
        return null;
      }
      throw new Error(error.message);
    }

    return {
      id: data.id,
      tutorId: data.tutorId,
      name: data.name,
      ageRange: data.ageRange,
      subjectArea: data.subjectArea,
      joinCode: data.joinCode,
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt),
      members: data.members.map((m) => ({
        id: m.id,
        groupId: m.groupId,
        studentId: m.studentId,
        joinedAt: new Date(m.joinedAt),
        student: {
          id: m.student.id,
          user: {
            id: m.student.user.id,
            email: m.student.user.email,
          },
        },
      })),
      assignments: data.assignments.map((a) => ({
        id: a.id,
        gameId: a.gameId,
        dueDate: a.dueDate ? new Date(a.dueDate) : null,
        passPercentage: a.passPercentage,
        game: {
          id: a.game.id,
          name: a.game.name,
          gameType: a.game.gameType,
        },
      })),
    };
  } catch (error) {
    const appError = handleAppError(error);
    logError('Failed to get group by ID', error, {
      action: 'get_group_by_id',
      groupId,
    });
    throw appError;
  }
}

/**
 * Get a group by join code
 */
export async function getGroupByJoinCode(joinCode: string): Promise<Group | null> {
  try {
    if (!joinCode) {
      throw createErrorResponse(
        ErrorCode.INVALID_INPUT,
        'Join code is required',
        'getGroupByJoinCode called without joinCode',
        400
      );
    }

    const normalizedCode = joinCode.toUpperCase();

    const { data, error } = await supabase
      .from('Group')
      .select('*')
      .eq('joinCode', normalizedCode)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        logWarning('Group not found for join code', null, {
          action: 'get_group_by_join_code',
          joinCode: normalizedCode,
        });
        return null;
      }
      throw new Error(error.message);
    }

    return {
      id: data.id,
      tutorId: data.tutorId,
      name: data.name,
      ageRange: data.ageRange,
      subjectArea: data.subjectArea,
      joinCode: data.joinCode,
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt),
    };
  } catch (error) {
    const appError = handleAppError(error);
    logError('Failed to get group by join code', error, {
      action: 'get_group_by_join_code',
      joinCode,
    });
    throw appError;
  }
}

/**
 * Generate unique join code
 */
async function generateUniqueJoinCode(excludeId?: string): Promise<string> {
  let code = generateJoinCode();
  let attempts = 0;
  const maxAttempts = 100;

  while (attempts < maxAttempts) {
    const { data, error } = await supabase
      .from('Group')
      .select('id')
      .eq('joinCode', code)
      .neq('id', excludeId || '')
      .limit(1);

    if (error) {
      throw new Error(error.message);
    }

    if (data.length === 0) {
      return code;
    }

    code = generateJoinCode();
    attempts++;
  }

  throw new Error('Failed to generate unique join code');
}

/**
 * Create a new group for current authenticated tutor
 */
export async function createGroup(input: CreateGroupInput): Promise<Group> {
  try {
    const tutorId = await getCurrentTutorId();

    if (!input.name || input.name.trim().length === 0) {
      throw createErrorResponse(
        ErrorCode.VALIDATION_ERROR,
        'Group name is required',
        'createGroup called with empty name',
        400,
        'name'
      );
    }

    const joinCode = await generateUniqueJoinCode();

    const { data, error } = await supabase
      .from('Group')
      .insert({
        tutorId: tutorId,
        name: input.name.trim(),
        ageRange: input.ageRange || null,
        subjectArea: input.subjectArea || null,
        joinCode: joinCode,
      })
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return {
      id: data.id,
      tutorId: data.tutorId,
      name: data.name,
      ageRange: data.ageRange,
      subjectArea: data.subjectArea,
      joinCode: data.joinCode,
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt),
      _count: {
        members: 0,
        assignments: 0,
      },
    };
  } catch (error) {
    const appError = handleAppError(error);
    logError('Failed to create group', error, {
      action: 'create_group',
      groupName: input.name,
    });
    throw appError;
  }
}

/**
 * Update a group
 */
export async function updateGroup(
  groupId: string,
  input: Partial<CreateGroupInput>
): Promise<Group> {
  try {
    if (!groupId) {
      throw createErrorResponse(
        ErrorCode.INVALID_INPUT,
        'Group ID is required',
        'updateGroup called without groupId',
        400
      );
    }

    const updateData: Record<string, unknown> = {};

    if (input.name !== undefined) {
      updateData.name = input.name.trim();
    }
    if (input.ageRange !== undefined) {
      updateData.ageRange = input.ageRange;
    }
    if (input.subjectArea !== undefined) {
      updateData.subjectArea = input.subjectArea;
    }

    const { data, error } = await supabase
      .from('Group')
      .update(updateData)
      .eq('id', groupId)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        throw createErrorResponse(
          ErrorCode.GROUP_NOT_FOUND,
          'Group not found',
          `Group with ID ${groupId} does not exist`,
          404
        );
      }
      throw new Error(error.message);
    }

    return {
      id: data.id,
      tutorId: data.tutorId,
      name: data.name,
      ageRange: data.ageRange,
      subjectArea: data.subjectArea,
      joinCode: data.joinCode,
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt),
    };
  } catch (error) {
    const appError = handleAppError(error);
    logError('Failed to update group', error, {
      action: 'update_group',
      groupId,
    });
    throw appError;
  }
}

/**
 * Delete a group
 */
export async function deleteGroup(groupId: string): Promise<void> {
  try {
    if (!groupId) {
      throw createErrorResponse(
        ErrorCode.INVALID_INPUT,
        'Group ID is required',
        'deleteGroup called without groupId',
        400
      );
    }

    const { data: existingGroup, error: checkError } = await supabase
      .from('Group')
      .select('id')
      .eq('id', groupId)
      .single();

    if (checkError) {
      if (checkError.code === 'PGRST116') {
        throw createErrorResponse(
          ErrorCode.GROUP_NOT_FOUND,
          'Group not found',
          `Group with ID ${groupId} does not exist`,
          404
        );
      }
      throw new Error(checkError.message);
    }

    const { error } = await supabase.from('Group').delete().eq('id', groupId);

    if (error) {
      throw new Error(error.message);
    }
  } catch (error) {
    const appError = handleAppError(error);
    logError('Failed to delete group', error, {
      action: 'delete_group',
      groupId,
    });
    throw appError;
  }
}

/**
 * Remove a student from a group
 */
export async function removeStudentFromGroup(groupId: string, studentId: string): Promise<void> {
  const { error } = await supabase
    .from('GroupMember')
    .delete()
    .eq('groupId', groupId)
    .eq('studentId', studentId);

  if (error) {
    throw new Error(`Failed to remove student from group: ${error.message}`);
  }
}

/**
 * Get all groups for current authenticated student
 */
export async function getMyGroupsAsStudent(): Promise<GroupWithDetails[]> {
  try {
    const studentId = await getCurrentStudentId();

    const { data, error } = await supabase
      .from('GroupMember')
      .select(
        `
        group:Group(
          *,
          members:GroupMember(count)
        )
      `
      )
      .eq('studentId', studentId);

    if (error) {
      throw new Error(error.message);
    }

    return data.map((item) => {
      const group = item.group;
      return {
        id: group.id,
        tutorId: group.tutorId,
        name: group.name,
        ageRange: group.ageRange,
        subjectArea: group.subjectArea,
        joinCode: group.joinCode,
        createdAt: new Date(group.createdAt),
        updatedAt: new Date(group.updatedAt),
        members: [],
        memberCount: group.members?.[0]?.count || 0,
      };
    });
  } catch (error) {
    const appError = handleAppError(error);
    logError('Failed to get student groups', error, {
      action: 'get_my_groups_as_student',
    });
    throw appError;
  }
}
