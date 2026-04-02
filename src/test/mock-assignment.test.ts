import { describe, it, expect, beforeEach } from 'vitest';
import { mockAssignmentService, resetAssignmentMockData } from '@/services/mock/assignment.mock';
import { resetGroupMockData } from '@/services/mock/group.mock';
import { resetGameAttemptMockData } from '@/services/mock/game-attempt.mock';
import { resetGameMockData } from '@/services/mock/game.mock';

const STUDENT_ID = 'student-profile-1';
const TUTOR_GROUP_1 = 'group-1';

beforeEach(() => {
  resetAssignmentMockData();
  resetGroupMockData();
  resetGameAttemptMockData();
  resetGameMockData();
});

describe('mockAssignmentService', () => {
  describe('createAssignment', () => {
    it('creates an assignment for a valid game and group', async () => {
      const assignment = await mockAssignmentService.createAssignment({
        gameId: 'game-4',
        groupId: TUTOR_GROUP_1,
        dueDate: new Date('2026-06-01'),
        passPercentage: 80,
      });
      expect(assignment.id).toBeTruthy();
      expect(assignment.gameId).toBe('game-4');
      expect(assignment.groupId).toBe(TUTOR_GROUP_1);
      expect(assignment.passPercentage).toBe(80);
    });

    it('throws when game does not exist', async () => {
      await expect(
        mockAssignmentService.createAssignment({
          gameId: 'nonexistent-game',
          groupId: TUTOR_GROUP_1,
        })
      ).rejects.toThrow('Game or group not found');
    });
  });

  describe('deleteAssignment', () => {
    it('removes the assignment from the store', async () => {
      await mockAssignmentService.deleteAssignment('assignment-1');
      const assignments = await mockAssignmentService.getGroupAssignments(TUTOR_GROUP_1);
      const found = assignments.find((a) => a.id === 'assignment-1');
      expect(found).toBeUndefined();
    });
  });

  describe('getGroupAssignments', () => {
    it('returns assignments for the given group', async () => {
      const assignments = await mockAssignmentService.getGroupAssignments(TUTOR_GROUP_1);
      expect(assignments.length).toBeGreaterThan(0);
      assignments.forEach((a) => expect(a.groupId).toBe(TUTOR_GROUP_1));
    });

    it('returns empty array for group with no assignments', async () => {
      const assignments = await mockAssignmentService.getGroupAssignments('nonexistent-group');
      expect(assignments).toEqual([]);
    });
  });

  describe('isGameAssignedToGroup', () => {
    it('returns true when assignment exists', async () => {
      const result = await mockAssignmentService.isGameAssignedToGroup('game-1', TUTOR_GROUP_1);
      expect(result).toBe(true);
    });

    it('returns false when no such assignment', async () => {
      const result = await mockAssignmentService.isGameAssignedToGroup('game-4', TUTOR_GROUP_1);
      expect(result).toBe(false);
    });
  });

  describe('getMyAssignments', () => {
    it('returns assignments for the student based on their groups', async () => {
      const assignments = await mockAssignmentService.getMyAssignments(STUDENT_ID);
      expect(assignments.length).toBeGreaterThan(0);
    });

    it('enriches assignments with attempt counts and completion status', async () => {
      const assignments = await mockAssignmentService.getMyAssignments(STUDENT_ID);
      const a1 = assignments.find((a) => a.id === 'assignment-1');
      expect(a1).toBeTruthy();
      expect(a1!.attemptCount).toBeGreaterThan(0);
      expect(a1!.isCompleted).toBe(true);
      expect(a1!.bestScore).toBeGreaterThan(0);
    });

    it('filters to pending assignments', async () => {
      const pending = await mockAssignmentService.getMyAssignments(STUDENT_ID, 'pending');
      pending.forEach((a) => expect(a.isCompleted).toBe(false));
    });

    it('filters to completed assignments', async () => {
      const completed = await mockAssignmentService.getMyAssignments(STUDENT_ID, 'completed');
      completed.forEach((a) => expect(a.isCompleted).toBe(true));
    });

    it('returns empty array for student with no groups', async () => {
      const assignments = await mockAssignmentService.getMyAssignments('no-groups-student');
      expect(assignments).toEqual([]);
    });
  });

  describe('getAssignmentById', () => {
    it('returns enriched assignment for student with access', async () => {
      const assignment = await mockAssignmentService.getAssignmentById(STUDENT_ID, 'assignment-1');
      expect(assignment).not.toBeNull();
      expect(assignment!.id).toBe('assignment-1');
      expect(assignment!.game).toBeTruthy();
      expect(typeof assignment!.game.gameData).toBe('object');
    });

    it('returns null for nonexistent assignment', async () => {
      const assignment = await mockAssignmentService.getAssignmentById(STUDENT_ID, 'nonexistent');
      expect(assignment).toBeNull();
    });

    it('throws when student does not have access', async () => {
      // assignment-3 is for group-2, which student-profile-1 is not in
      await expect(
        mockAssignmentService.getAssignmentById(STUDENT_ID, 'assignment-3')
      ).rejects.toThrow('do not have access');
    });
  });

  describe('getMyStats', () => {
    it('returns stats with correct shape', async () => {
      const stats = await mockAssignmentService.getMyStats(STUDENT_ID);
      expect(typeof stats.totalGroups).toBe('number');
      expect(typeof stats.totalAssignments).toBe('number');
      expect(typeof stats.completedAssignments).toBe('number');
      expect(typeof stats.averageScore).toBe('number');
      expect(stats.completedAssignments).toBeLessThanOrEqual(stats.totalAssignments);
    });

    it('returns zero stats for unknown student', async () => {
      const stats = await mockAssignmentService.getMyStats('unknown-student');
      expect(stats.totalGroups).toBe(0);
      expect(stats.totalAssignments).toBe(0);
      expect(stats.completedAssignments).toBe(0);
      expect(stats.averageScore).toBe(0);
    });
  });

  describe('getMyPersonalBests', () => {
    it('returns personal bests with game info', async () => {
      const bests = await mockAssignmentService.getMyPersonalBests(STUDENT_ID);
      expect(bests.length).toBeGreaterThan(0);
      bests.forEach((b) => {
        expect(b.game).toBeTruthy();
        expect(typeof b.bestScore).toBe('number');
        expect(typeof b.totalAttempts).toBe('number');
      });
    });

    it('returns empty array for student with no attempts', async () => {
      const bests = await mockAssignmentService.getMyPersonalBests('no-attempts-student');
      expect(bests).toEqual([]);
    });
  });

  describe('getMyProgressTrends', () => {
    it('returns trend data with expected shape', async () => {
      const trends = await mockAssignmentService.getMyProgressTrends(STUDENT_ID, 90);
      expect(Array.isArray(trends.scoreOverTime)).toBe(true);
      expect(Array.isArray(trends.performanceByGameType)).toBe(true);
      expect(typeof trends.totalAttempts).toBe('number');
      expect(typeof trends.averageScore).toBe('number');
    });
  });

  describe('getAttemptDetails', () => {
    it('returns attempt details for a known seed attempt', async () => {
      const details = await mockAssignmentService.getAttemptDetails('attempt-1');
      expect(details).not.toBeNull();
      expect(details.id).toBe('attempt-1');
      expect(details.assignment).toBeTruthy();
      expect(typeof details.attemptData).toBe('object');
    });

    it('returns null for unknown attempt id', async () => {
      const details = await mockAssignmentService.getAttemptDetails('nonexistent-attempt');
      expect(details).toBeNull();
    });
  });
});
