import { SEED_GROUPS, SEED_GROUPS_WITH_DETAILS } from './seed';
import type { GroupService } from '../interface';
import { Group, GroupWithDetails, CreateGroupInput } from '@/types/group';
import { generateJoinCode } from '@/lib/join-code';

let groups: Group[] = SEED_GROUPS.map((g) => ({ ...g }));
let groupsWithDetails: GroupWithDetails[] = SEED_GROUPS_WITH_DETAILS.map((g) => ({
  ...g,
  members: [...g.members],
  assignments: [...g.assignments],
}));

export const mockGroupService: GroupService = {
  async getMyGroups(tutorId: string): Promise<Group[]> {
    return groups
      .filter((g) => g.tutorId === tutorId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  async getGroupById(groupId: string): Promise<GroupWithDetails | null> {
    return groupsWithDetails.find((g) => g.id === groupId) ?? null;
  },

  async getGroupByJoinCode(joinCode: string): Promise<Group | null> {
    const normalized = joinCode.toUpperCase();
    return groups.find((g) => g.joinCode === normalized) ?? null;
  },

  async createGroup(tutorId: string, input: CreateGroupInput): Promise<Group> {
    const now = new Date();
    const joinCode = generateJoinCode();
    const group: Group = {
      id: crypto.randomUUID(),
      tutorId,
      name: input.name.trim(),
      ageRange: input.ageRange ?? null,
      subjectArea: input.subjectArea ?? null,
      joinCode,
      createdAt: now,
      updatedAt: now,
      _count: { members: 0, assignments: 0 },
    };
    groups = [group, ...groups];
    const withDetails: GroupWithDetails = { ...group, members: [], assignments: [] };
    groupsWithDetails = [withDetails, ...groupsWithDetails];
    return group;
  },

  async updateGroup(groupId: string, input: Partial<CreateGroupInput>): Promise<Group> {
    const idx = groups.findIndex((g) => g.id === groupId);
    if (idx === -1) throw new Error('Group not found');
    const updated: Group = {
      ...groups[idx],
      ...(input.name !== undefined && { name: input.name.trim() }),
      ...(input.ageRange !== undefined && { ageRange: input.ageRange ?? null }),
      ...(input.subjectArea !== undefined && { subjectArea: input.subjectArea ?? null }),
      updatedAt: new Date(),
    };
    groups = groups.map((g) => (g.id === groupId ? updated : g));
    groupsWithDetails = groupsWithDetails.map((g) => (g.id === groupId ? { ...g, ...updated } : g));
    return updated;
  },

  async deleteGroup(groupId: string): Promise<void> {
    groups = groups.filter((g) => g.id !== groupId);
    groupsWithDetails = groupsWithDetails.filter((g) => g.id !== groupId);
  },

  async removeStudentFromGroup(groupId: string, studentId: string): Promise<void> {
    groupsWithDetails = groupsWithDetails.map((g) => {
      if (g.id !== groupId) return g;
      return { ...g, members: g.members.filter((m) => m.studentId !== studentId) };
    });
    groups = groups.map((g) => {
      if (g.id !== groupId) return g;
      return { ...g, _count: { ...(g._count ?? { members: 0, assignments: 0 }), members: Math.max(0, (g._count?.members ?? 1) - 1) } };
    });
  },

  async getMyGroupsAsStudent(studentId: string): Promise<GroupWithDetails[]> {
    return groupsWithDetails.filter((g) =>
      g.members.some((m) => m.studentId === studentId)
    );
  },

  async joinGroup(studentId: string, joinCode: string): Promise<{ success: boolean; error?: string; groupName?: string }> {
    const normalized = joinCode.trim().toUpperCase();
    const group = groupsWithDetails.find((g) => g.joinCode === normalized);

    if (!group) {
      return { success: false, error: 'Invalid join code. Please check and try again.' };
    }

    const alreadyMember = group.members.some((m) => m.studentId === studentId);
    if (alreadyMember) {
      return { success: false, error: "You're already a member of this group." };
    }

    const newMember = {
      id: crypto.randomUUID(),
      groupId: group.id,
      studentId,
      joinedAt: new Date(),
      student: { id: studentId, user: { id: studentId, email: `${studentId}@dev.local` } },
    };

    groupsWithDetails = groupsWithDetails.map((g) => {
      if (g.id !== group.id) return g;
      return { ...g, members: [...g.members, newMember] };
    });
    groups = groups.map((g) => {
      if (g.id !== group.id) return g;
      return { ...g, _count: { ...(g._count ?? { members: 0, assignments: 0 }), members: (g._count?.members ?? 0) + 1 } };
    });

    return { success: true, groupName: group.name };
  },
};

export function resetGroupMockData(): void {
  groups = SEED_GROUPS.map((g) => ({ ...g }));
  groupsWithDetails = SEED_GROUPS_WITH_DETAILS.map((g) => ({
    ...g,
    members: [...g.members],
    assignments: [...g.assignments],
  }));
}
