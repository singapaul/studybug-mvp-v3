import { Group, GroupWithDetails, CreateGroupInput } from '@/types/group';

export interface GroupService {
  getMyGroups(tutorId: string): Promise<Group[]>;
  getGroupById(groupId: string): Promise<GroupWithDetails | null>;
  getGroupByJoinCode(joinCode: string): Promise<Group | null>;
  createGroup(tutorId: string, input: CreateGroupInput): Promise<Group>;
  updateGroup(groupId: string, input: Partial<CreateGroupInput>): Promise<Group>;
  deleteGroup(groupId: string): Promise<void>;
  removeStudentFromGroup(groupId: string, studentId: string): Promise<void>;
  getMyGroupsAsStudent(studentId: string): Promise<GroupWithDetails[]>;
  joinGroup(studentId: string, joinCode: string): Promise<{ success: boolean; error?: string; groupName?: string }>;
}
