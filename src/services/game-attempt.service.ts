/**
 * Game Attempt Service
 * Handles saving and retrieving game attempts/completions
 */

import { GameAttempt } from '@/types/assignment';

const ATTEMPTS_KEY = 'dev_game_attempts';
const STUDENT_ID_KEY = 'dev_student_id';

// Helper to get current student ID (mock implementation)
function getCurrentStudentId(): string {
  const studentId = localStorage.getItem(STUDENT_ID_KEY);
  if (!studentId) {
    throw new Error('No student ID found in session');
  }
  return studentId;
}

// Helper to get all attempts
function getAttempts(): GameAttempt[] {
  const stored = localStorage.getItem(ATTEMPTS_KEY);
  if (!stored) return [];
  return JSON.parse(stored).map((a: any) => ({
    ...a,
    completedAt: new Date(a.completedAt),
  }));
}

// Helper to save attempts
function saveAttempts(attempts: GameAttempt[]): void {
  localStorage.setItem(ATTEMPTS_KEY, JSON.stringify(attempts));
}

/**
 * Save a game attempt
 */
export async function saveGameAttempt(
  assignmentId: string,
  scorePercentage: number,
  timeTaken: number,
  attemptData: any
): Promise<GameAttempt> {
  const studentId = getCurrentStudentId();
  await new Promise((resolve) => setTimeout(resolve, 300));

  const attempts = getAttempts();

  const newAttempt: GameAttempt = {
    id: `attempt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    assignmentId,
    studentId,
    scorePercentage,
    timeTaken,
    completedAt: new Date(),
    attemptData: JSON.stringify(attemptData),
  };

  attempts.push(newAttempt);
  saveAttempts(attempts);

  return newAttempt;
}

/**
 * Get all attempts for a specific assignment by a student
 */
export async function getMyAssignmentAttempts(
  assignmentId: string
): Promise<GameAttempt[]> {
  await new Promise((resolve) => setTimeout(resolve, 200));

  const studentId = getCurrentStudentId();
  const attempts = getAttempts();
  return attempts
    .filter((a) => a.assignmentId === assignmentId && a.studentId === studentId)
    .sort((a, b) => b.completedAt.getTime() - a.completedAt.getTime());
}

/**
 * Get best attempt for an assignment
 */
export async function getMyBestAttempt(
  assignmentId: string
): Promise<GameAttempt | null> {
  const attempts = await getMyAssignmentAttempts(assignmentId);
  if (attempts.length === 0) return null;

  return attempts.reduce((best, current) =>
    current.scorePercentage > best.scorePercentage ? current : best
  );
}

/**
 * Get all attempts for a student across all assignments
 */
export async function getMyAttempts(): Promise<GameAttempt[]> {
  await new Promise((resolve) => setTimeout(resolve, 200));

  const studentId = getCurrentStudentId();
  const attempts = getAttempts();
  return attempts
    .filter((a) => a.studentId === studentId)
    .sort((a, b) => b.completedAt.getTime() - a.completedAt.getTime());
}

/**
 * Delete all attempts for an assignment (for testing)
 */
export async function deleteAssignmentAttempts(
  assignmentId: string
): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 200));

  const attempts = getAttempts();
  const filtered = attempts.filter((a) => a.assignmentId !== assignmentId);
  saveAttempts(filtered);
}
