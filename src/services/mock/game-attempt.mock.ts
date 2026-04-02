import { SEED_GAME_ATTEMPTS } from './seed';
import type { GameAttemptService } from '../interface';
import { GameAttempt } from '@/types/assignment';

let attempts: GameAttempt[] = SEED_GAME_ATTEMPTS.map((a) => ({ ...a }));

export const mockGameAttemptService: GameAttemptService = {
  async saveGameAttempt(
    studentId: string,
    assignmentId: string,
    scorePercentage: number,
    timeTaken: number,
    attemptData: Record<string, unknown>
  ): Promise<GameAttempt> {
    const attempt: GameAttempt = {
      id: crypto.randomUUID(),
      assignmentId,
      studentId,
      scorePercentage,
      timeTaken,
      completedAt: new Date(),
      attemptData: JSON.stringify(attemptData),
    };
    attempts = [...attempts, attempt];
    return attempt;
  },

  async getMyAssignmentAttempts(studentId: string, assignmentId: string): Promise<GameAttempt[]> {
    return attempts
      .filter((a) => a.studentId === studentId && a.assignmentId === assignmentId)
      .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime());
  },

  async getMyBestAttempt(studentId: string, assignmentId: string): Promise<GameAttempt | null> {
    const relevant = await mockGameAttemptService.getMyAssignmentAttempts(studentId, assignmentId);
    if (relevant.length === 0) return null;
    return relevant.reduce((best, current) =>
      current.scorePercentage > best.scorePercentage ? current : best
    );
  },

  async getMyAttempts(studentId: string): Promise<GameAttempt[]> {
    return attempts
      .filter((a) => a.studentId === studentId)
      .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime());
  },
};

export function resetGameAttemptMockData(): void {
  attempts = SEED_GAME_ATTEMPTS.map((a) => ({ ...a }));
}
