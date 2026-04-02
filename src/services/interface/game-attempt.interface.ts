import { GameAttempt } from '@/types/assignment';

export interface GameAttemptService {
  saveGameAttempt(
    studentId: string,
    assignmentId: string,
    scorePercentage: number,
    timeTaken: number,
    attemptData: Record<string, unknown>
  ): Promise<GameAttempt>;
  getMyAssignmentAttempts(studentId: string, assignmentId: string): Promise<GameAttempt[]>;
  getMyBestAttempt(studentId: string, assignmentId: string): Promise<GameAttempt | null>;
  getMyAttempts(studentId: string): Promise<GameAttempt[]>;
}
