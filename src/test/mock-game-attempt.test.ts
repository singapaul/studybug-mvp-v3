import { describe, it, expect, beforeEach } from 'vitest';
import { mockGameAttemptService, resetGameAttemptMockData } from '@/services/mock/game-attempt.mock';

const STUDENT_ID = 'student-profile-1';
const ASSIGNMENT_1 = 'assignment-1';
const ASSIGNMENT_2 = 'assignment-2';

beforeEach(() => {
  resetGameAttemptMockData();
});

describe('mockGameAttemptService', () => {
  describe('saveGameAttempt', () => {
    it('saves an attempt and returns it', async () => {
      const attempt = await mockGameAttemptService.saveGameAttempt(
        STUDENT_ID,
        ASSIGNMENT_1,
        90,
        60,
        { correct: 9, total: 10 }
      );
      expect(attempt.id).toBeTruthy();
      expect(attempt.studentId).toBe(STUDENT_ID);
      expect(attempt.assignmentId).toBe(ASSIGNMENT_1);
      expect(attempt.scorePercentage).toBe(90);
      expect(attempt.timeTaken).toBe(60);
    });

    it('persists the attempt to the store', async () => {
      const before = await mockGameAttemptService.getMyAttempts(STUDENT_ID);
      await mockGameAttemptService.saveGameAttempt(STUDENT_ID, ASSIGNMENT_1, 75, 90, {});
      const after = await mockGameAttemptService.getMyAttempts(STUDENT_ID);
      expect(after.length).toBe(before.length + 1);
    });
  });

  describe('getMyAssignmentAttempts', () => {
    it('returns only attempts for the given assignment and student', async () => {
      const attempts = await mockGameAttemptService.getMyAssignmentAttempts(
        STUDENT_ID,
        ASSIGNMENT_1
      );
      expect(attempts.length).toBeGreaterThan(0);
      attempts.forEach((a) => {
        expect(a.studentId).toBe(STUDENT_ID);
        expect(a.assignmentId).toBe(ASSIGNMENT_1);
      });
    });

    it('returns empty array for unknown combination', async () => {
      const attempts = await mockGameAttemptService.getMyAssignmentAttempts(
        'unknown-student',
        ASSIGNMENT_1
      );
      expect(attempts).toEqual([]);
    });

    it('returns attempts sorted newest first', async () => {
      // Save an additional attempt to ensure ordering is testable
      await mockGameAttemptService.saveGameAttempt(STUDENT_ID, ASSIGNMENT_1, 95, 45, {});
      const attempts = await mockGameAttemptService.getMyAssignmentAttempts(
        STUDENT_ID,
        ASSIGNMENT_1
      );
      for (let i = 1; i < attempts.length; i++) {
        expect(new Date(attempts[i - 1].completedAt).getTime()).toBeGreaterThanOrEqual(
          new Date(attempts[i].completedAt).getTime()
        );
      }
    });
  });

  describe('getMyBestAttempt', () => {
    it('returns the attempt with the highest score', async () => {
      await mockGameAttemptService.saveGameAttempt(STUDENT_ID, ASSIGNMENT_1, 95, 45, {});
      const best = await mockGameAttemptService.getMyBestAttempt(STUDENT_ID, ASSIGNMENT_1);
      expect(best).not.toBeNull();
      expect(best!.scorePercentage).toBe(95);
    });

    it('returns null when no attempts exist', async () => {
      const best = await mockGameAttemptService.getMyBestAttempt(STUDENT_ID, 'assignment-99');
      expect(best).toBeNull();
    });
  });

  describe('getMyAttempts', () => {
    it('returns all attempts for the student', async () => {
      const attempts = await mockGameAttemptService.getMyAttempts(STUDENT_ID);
      expect(attempts.length).toBeGreaterThan(0);
      attempts.forEach((a) => expect(a.studentId).toBe(STUDENT_ID));
    });

    it('returns attempts across multiple assignments', async () => {
      const attempts = await mockGameAttemptService.getMyAttempts(STUDENT_ID);
      const assignmentIds = new Set(attempts.map((a) => a.assignmentId));
      expect(assignmentIds.size).toBeGreaterThanOrEqual(2);
    });

    it('returns empty array for student with no attempts', async () => {
      const attempts = await mockGameAttemptService.getMyAttempts('new-student');
      expect(attempts).toEqual([]);
    });
  });
});
