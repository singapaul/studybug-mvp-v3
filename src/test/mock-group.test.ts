import { describe, it, expect, beforeEach } from 'vitest';
import { mockGroupService, resetGroupMockData } from '@/services/mock/group.mock';

const TUTOR_ID = 'tutor-dev-1';
const STUDENT_1_ID = 'student-profile-1';
const STUDENT_3_ID = 'student-profile-3';

beforeEach(() => {
  resetGroupMockData();
});

describe('mockGroupService', () => {
  describe('getMyGroups', () => {
    it('returns groups owned by the tutor', async () => {
      const groups = await mockGroupService.getMyGroups(TUTOR_ID);
      expect(groups.length).toBeGreaterThan(0);
      groups.forEach((g) => expect(g.tutorId).toBe(TUTOR_ID));
    });

    it('returns empty array for unknown tutor', async () => {
      const groups = await mockGroupService.getMyGroups('unknown');
      expect(groups).toEqual([]);
    });
  });

  describe('getGroupById', () => {
    it('returns group with details for known id', async () => {
      const group = await mockGroupService.getGroupById('group-1');
      expect(group).not.toBeNull();
      expect(group!.id).toBe('group-1');
      expect(Array.isArray(group!.members)).toBe(true);
      expect(Array.isArray(group!.assignments)).toBe(true);
    });

    it('returns null for unknown id', async () => {
      const group = await mockGroupService.getGroupById('nonexistent');
      expect(group).toBeNull();
    });
  });

  describe('getGroupByJoinCode', () => {
    it('finds group by exact join code', async () => {
      const group = await mockGroupService.getGroupByJoinCode('Y8M001');
      expect(group).not.toBeNull();
      expect(group!.name).toBe('Year 8 Maths');
    });

    it('is case insensitive', async () => {
      const group = await mockGroupService.getGroupByJoinCode('y8m001');
      expect(group).not.toBeNull();
    });

    it('returns null for invalid code', async () => {
      const group = await mockGroupService.getGroupByJoinCode('INVALID');
      expect(group).toBeNull();
    });
  });

  describe('createGroup', () => {
    it('creates a group with auto-generated join code', async () => {
      const group = await mockGroupService.createGroup(TUTOR_ID, {
        name: 'New Group',
        ageRange: '10-11',
        subjectArea: 'Science',
      });
      expect(group.id).toBeTruthy();
      expect(group.name).toBe('New Group');
      expect(group.tutorId).toBe(TUTOR_ID);
      expect(group.joinCode).toBeTruthy();
      expect(group._count?.members).toBe(0);
    });

    it('adds the group to the store', async () => {
      const before = await mockGroupService.getMyGroups(TUTOR_ID);
      await mockGroupService.createGroup(TUTOR_ID, { name: 'Extra Group' });
      const after = await mockGroupService.getMyGroups(TUTOR_ID);
      expect(after.length).toBe(before.length + 1);
    });
  });

  describe('updateGroup', () => {
    it('updates group name', async () => {
      const updated = await mockGroupService.updateGroup('group-1', { name: 'Renamed Group' });
      expect(updated.name).toBe('Renamed Group');
    });

    it('throws for unknown group', async () => {
      await expect(mockGroupService.updateGroup('nonexistent', { name: 'X' })).rejects.toThrow(
        'Group not found'
      );
    });
  });

  describe('deleteGroup', () => {
    it('removes the group', async () => {
      await mockGroupService.deleteGroup('group-1');
      const group = await mockGroupService.getGroupById('group-1');
      expect(group).toBeNull();
    });
  });

  describe('removeStudentFromGroup', () => {
    it('removes a student from group members', async () => {
      await mockGroupService.removeStudentFromGroup('group-1', STUDENT_1_ID);
      const group = await mockGroupService.getGroupById('group-1');
      const isMember = group!.members.some((m) => m.studentId === STUDENT_1_ID);
      expect(isMember).toBe(false);
    });
  });

  describe('getMyGroupsAsStudent', () => {
    it('returns groups where student is a member', async () => {
      const groups = await mockGroupService.getMyGroupsAsStudent(STUDENT_1_ID);
      expect(groups.length).toBeGreaterThan(0);
      groups.forEach((g) =>
        expect(g.members.some((m) => m.studentId === STUDENT_1_ID)).toBe(true)
      );
    });

    it('returns empty array if student has no groups', async () => {
      const groups = await mockGroupService.getMyGroupsAsStudent('no-groups-student');
      expect(groups).toEqual([]);
    });
  });

  describe('joinGroup', () => {
    it('allows a student to join with a valid join code', async () => {
      const result = await mockGroupService.joinGroup(STUDENT_3_ID, 'Y8M001');
      expect(result.success).toBe(true);
      expect(result.groupName).toBe('Year 8 Maths');

      const groups = await mockGroupService.getMyGroupsAsStudent(STUDENT_3_ID);
      const joined = groups.find((g) => g.joinCode === 'Y8M001');
      expect(joined).toBeTruthy();
    });

    it('returns error for invalid join code', async () => {
      const result = await mockGroupService.joinGroup(STUDENT_3_ID, 'INVALID');
      expect(result.success).toBe(false);
      expect(result.error).toBeTruthy();
    });

    it('returns error if already a member', async () => {
      const result = await mockGroupService.joinGroup(STUDENT_1_ID, 'Y8M001');
      expect(result.success).toBe(false);
      expect(result.error).toContain('already a member');
    });
  });
});
