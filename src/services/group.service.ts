/**
 * Mock Group Service
 * In production, this would call real API endpoints
 */

import { Group, GroupWithDetails, CreateGroupInput, GroupMember } from '@/types/group';
import { generateJoinCode } from '@/lib/join-code';

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
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300));

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
}

/**
 * Get a single group by ID with full details
 */
export async function getGroupById(groupId: string): Promise<GroupWithDetails | null> {
  await new Promise((resolve) => setTimeout(resolve, 200));

  const groups = getGroups();
  const group = groups.find((g) => g.id === groupId);
  if (!group) return null;

  const members = getMembers().filter((m) => m.groupId === groupId);

  return {
    ...group,
    members,
    assignments: [], // TODO: Implement assignments
  };
}

/**
 * Get a group by join code
 */
export async function getGroupByJoinCode(joinCode: string): Promise<Group | null> {
  await new Promise((resolve) => setTimeout(resolve, 200));

  const groups = getGroups();
  return groups.find((g) => g.joinCode === joinCode) || null;
}

/**
 * Create a new group
 */
export async function createGroup(
  tutorId: string,
  input: CreateGroupInput
): Promise<Group> {
  await new Promise((resolve) => setTimeout(resolve, 400));

  const groups = getGroups();
  const joinCode = generateUniqueJoinCode();

  const newGroup: Group = {
    id: `group_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    tutorId,
    name: input.name,
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
}

/**
 * Update a group
 */
export async function updateGroup(
  groupId: string,
  input: Partial<CreateGroupInput>
): Promise<Group> {
  await new Promise((resolve) => setTimeout(resolve, 300));

  const groups = getGroups();
  const index = groups.findIndex((g) => g.id === groupId);

  if (index === -1) {
    throw new Error('Group not found');
  }

  const updatedGroup: Group = {
    ...groups[index],
    ...input,
    updatedAt: new Date(),
  };

  groups[index] = updatedGroup;
  saveGroups(groups);

  return updatedGroup;
}

/**
 * Delete a group
 */
export async function deleteGroup(groupId: string): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 300));

  const groups = getGroups();
  const filtered = groups.filter((g) => g.id !== groupId);
  saveGroups(filtered);

  // Also remove all members
  const members = getMembers();
  const filteredMembers = members.filter((m) => m.groupId !== groupId);
  saveMembers(filteredMembers);
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
  await new Promise((resolve) => setTimeout(resolve, 200));

  const members = getMembers();

  // Check if already a member
  const existing = members.find(
    (m) => m.groupId === groupId && m.studentId === studentId
  );
  if (existing) {
    throw new Error('Student is already a member of this group');
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

  members.push(newMember);
  saveMembers(members);

  return newMember;
}
