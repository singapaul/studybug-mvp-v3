/**
 * Mock Group Service
 * In production, this would call real API endpoints
 */

import { Group, GroupWithDetails, CreateGroupInput, GroupMember } from '@/types/group';
import { generateJoinCode } from '@/lib/join-code';
import {
  createErrorResponse,
  ErrorCode,
  handleAppError,
  hasStudentJoinedGroup,
} from '@/lib/error-handling';
import { logError, logWarning } from '@/lib/error-logger';

const STORAGE_KEY = 'dev_groups';
const MEMBERS_KEY = 'dev_group_members';

// Helper to get all groups from localStorage
function getGroups(): Group[] {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return [];
  return JSON.parse(stored).map((g: any) => ({
    ...g,
    createdAt: new Date(g.createdAt),
    updatedAt: new Date(g.updatedAt),
  }));
}

// Helper to save groups to localStorage
function saveGroups(groups: Group[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(groups));
}

// Helper to get all group members
function getMembers(): GroupMember[] {
  const stored = localStorage.getItem(MEMBERS_KEY);
  if (!stored) return [];
  return JSON.parse(stored).map((m: any) => ({
    ...m,
    joinedAt: new Date(m.joinedAt),
  }));
}

// Helper to save members
function saveMembers(members: GroupMember[]): void {
  localStorage.setItem(MEMBERS_KEY, JSON.stringify(members));
}

// Check if join code is unique
function isJoinCodeUnique(code: string, excludeId?: string): boolean {
  const groups = getGroups();
  return !groups.some((g) => g.joinCode === code && g.id !== excludeId);
}

// Generate unique join code
function generateUniqueJoinCode(excludeId?: string): string {
  let code = generateJoinCode();
  let attempts = 0;
  const maxAttempts = 100;

  while (!isJoinCodeUnique(code, excludeId) && attempts < maxAttempts) {
    code = generateJoinCode();
    attempts++;
  }

  if (attempts >= maxAttempts) {
    throw new Error('Failed to generate unique join code');
  }

  return code;
}

/**
 * Get all groups for a tutor
 */
export async function getTutorGroups(tutorId: string): Promise<Group[]> {
  try {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    if (!tutorId) {
      throw createErrorResponse(
        ErrorCode.INVALID_INPUT,
        'Tutor ID is required',
        'getTutorGroups called without tutorId',
        400
      );
    }

    const groups = getGroups().filter((g) => g.tutorId === tutorId);
    const members = getMembers();

    // Add member counts
    return groups.map((group) => ({
      ...group,
      _count: {
        members: members.filter((m) => m.groupId === group.id).length,
        assignments: 0, // TODO: Implement assignments
      },
    }));
  } catch (error) {
    const appError = handleAppError(error);
    logError('Failed to get tutor groups', error, {
      action: 'get_tutor_groups',
      tutorId,
    });
    throw appError;
  }
}

/**
 * Get a single group by ID with full details
 */
export async function getGroupById(groupId: string): Promise<GroupWithDetails | null> {
  try {
    await new Promise((resolve) => setTimeout(resolve, 200));

    if (!groupId) {
      throw createErrorResponse(
        ErrorCode.INVALID_INPUT,
        'Group ID is required',
        'getGroupById called without groupId',
        400
      );
    }

    const groups = getGroups();
    const group = groups.find((g) => g.id === groupId);

    if (!group) {
      logWarning('Group not found', null, {
        action: 'get_group_by_id',
        groupId,
      });
      return null;
    }

    const members = getMembers().filter((m) => m.groupId === groupId);

    return {
      ...group,
      members,
      assignments: [], // TODO: Implement assignments
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
    await new Promise((resolve) => setTimeout(resolve, 200));

    if (!joinCode) {
      throw createErrorResponse(
        ErrorCode.INVALID_INPUT,
        'Join code is required',
        'getGroupByJoinCode called without joinCode',
        400
      );
    }

    // Normalize join code to uppercase
    const normalizedCode = joinCode.toUpperCase();

    const groups = getGroups();
    const group = groups.find((g) => g.joinCode === normalizedCode);

    if (!group) {
      logWarning('Group not found for join code', null, {
        action: 'get_group_by_join_code',
        joinCode: normalizedCode,
      });
      return null;
    }

    return group;
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
 * Create a new group
 */
export async function createGroup(
  tutorId: string,
  input: CreateGroupInput
): Promise<Group> {
  try {
    await new Promise((resolve) => setTimeout(resolve, 400));

    if (!tutorId) {
      throw createErrorResponse(
        ErrorCode.INVALID_INPUT,
        'Tutor ID is required',
        'createGroup called without tutorId',
        400
      );
    }

    if (!input.name || input.name.trim().length === 0) {
      throw createErrorResponse(
        ErrorCode.VALIDATION_ERROR,
        'Group name is required',
        'createGroup called with empty name',
        400,
        'name'
      );
    }

    const groups = getGroups();
    const joinCode = generateUniqueJoinCode();

    const newGroup: Group = {
      id: `group_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      tutorId,
      name: input.name.trim(),
      ageRange: input.ageRange || null,
      subjectArea: input.subjectArea || null,
      joinCode,
      createdAt: new Date(),
      updatedAt: new Date(),
      _count: {
        members: 0,
        assignments: 0,
      },
    };

    groups.push(newGroup);
    saveGroups(groups);

    return newGroup;
  } catch (error) {
    const appError = handleAppError(error);
    logError('Failed to create group', error, {
      action: 'create_group',
      tutorId,
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
    await new Promise((resolve) => setTimeout(resolve, 300));

    if (!groupId) {
      throw createErrorResponse(
        ErrorCode.INVALID_INPUT,
        'Group ID is required',
        'updateGroup called without groupId',
        400
      );
    }

    const groups = getGroups();
    const index = groups.findIndex((g) => g.id === groupId);

    if (index === -1) {
      throw createErrorResponse(
        ErrorCode.GROUP_NOT_FOUND,
        'Group not found',
        `Group with ID ${groupId} does not exist`,
        404
      );
    }

    const updatedGroup: Group = {
      ...groups[index],
      ...input,
      name: input.name ? input.name.trim() : groups[index].name,
      updatedAt: new Date(),
    };

    groups[index] = updatedGroup;
    saveGroups(groups);

    return updatedGroup;
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
    await new Promise((resolve) => setTimeout(resolve, 300));

    if (!groupId) {
      throw createErrorResponse(
        ErrorCode.INVALID_INPUT,
        'Group ID is required',
        'deleteGroup called without groupId',
        400
      );
    }

    // Check if group exists
    const groups = getGroups();
    const group = groups.find((g) => g.id === groupId);

    if (!group) {
      throw createErrorResponse(
        ErrorCode.GROUP_NOT_FOUND,
        'Group not found',
        `Group with ID ${groupId} does not exist`,
        404
      );
    }

    // Check if group has members (optional protection)
    const members = getMembers();
    const groupMembers = members.filter((m) => m.groupId === groupId);

    if (groupMembers.length > 0) {
      logWarning('Deleting group with members', null, {
        action: 'delete_group',
        groupId,
        memberCount: groupMembers.length,
      });
      // Note: Still allow deletion, but log warning
      // To prevent deletion, uncomment:
      // throw createErrorResponse(
      //   ErrorCode.CANNOT_DELETE_GROUP_WITH_MEMBERS,
      //   'Cannot delete group with members',
      //   `Group has ${groupMembers.length} members`,
      //   400
      // );
    }

    // Delete group
    const filtered = groups.filter((g) => g.id !== groupId);
    saveGroups(filtered);

    // Remove all members
    const filteredMembers = members.filter((m) => m.groupId !== groupId);
    saveMembers(filteredMembers);
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
export async function removeStudentFromGroup(
  groupId: string,
  studentId: string
): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 200));

  const members = getMembers();
  const filtered = members.filter(
    (m) => !(m.groupId === groupId && m.studentId === studentId)
  );
  saveMembers(filtered);
}

/**
 * Add a student to a group (for testing)
 */
export async function addStudentToGroup(
  groupId: string,
  studentId: string,
  studentEmail: string
): Promise<GroupMember> {
  try {
    await new Promise((resolve) => setTimeout(resolve, 200));

    if (!groupId || !studentId || !studentEmail) {
      throw createErrorResponse(
        ErrorCode.INVALID_INPUT,
        'Group ID, student ID, and email are required',
        'addStudentToGroup called with missing parameters',
        400
      );
    }

    // Check if group exists
    const groups = getGroups();
    const group = groups.find((g) => g.id === groupId);

    if (!group) {
      throw createErrorResponse(
        ErrorCode.GROUP_NOT_FOUND,
        'Group not found',
        `Group with ID ${groupId} does not exist`,
        404
      );
    }

    // Check if already a member using our helper function
    const alreadyJoined = await hasStudentJoinedGroup(studentId, groupId);
    if (alreadyJoined) {
      throw createErrorResponse(
        ErrorCode.ALREADY_JOINED,
        'You have already joined this group',
        `Student ${studentId} is already a member of group ${groupId}`,
        400
      );
    }

    const newMember: GroupMember = {
      id: `member_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      groupId,
      studentId,
      joinedAt: new Date(),
      student: {
        id: studentId,
        user: {
          id: `user_${studentId}`,
          email: studentEmail,
        },
      },
    };

    const members = getMembers();
    members.push(newMember);
    saveMembers(members);

    return newMember;
  } catch (error) {
    const appError = handleAppError(error);
    logError('Failed to add student to group', error, {
      action: 'add_student_to_group',
      groupId,
      studentId,
    });
    throw appError;
  }
}
