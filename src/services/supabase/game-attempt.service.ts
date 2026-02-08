/**
 * Supabase Game Attempt Service
 * Handles saving and retrieving game attempts/completions
 */

import { supabase } from '@/lib/supabase';
import { GameAttempt } from '@/types/assignment';

/**
 * Get Student ID for current authenticated user
 */
async function getCurrentStudentId(): Promise<string> {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('No authenticated user');
  }

  const { data, error } = await supabase
    .from('Student')
    .select('id')
    .eq('userId', user.id)
    .single();

  if (error || !data) {
    throw new Error('Student profile not found');
  }

  return data.id;
}

/**
 * Save a game attempt
 */
export async function saveGameAttempt(
  assignmentId: string,
  scorePercentage: number,
  timeTaken: number,
  attemptData: Record<string, unknown>
): Promise<GameAttempt> {
  const studentId = await getCurrentStudentId();
  const { data, error } = await supabase
    .from('GameAttempt')
    .insert({
      assignmentId: assignmentId,
      studentId: studentId,
      scorePercentage: scorePercentage,
      timeTaken: timeTaken,
      attemptData: JSON.stringify(attemptData), // Convert to JSON string for TEXT column
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to save game attempt: ${error.message}`);
  }

  return {
    id: data.id,
    assignmentId: data.assignmentId,
    studentId: data.studentId,
    scorePercentage: data.scorePercentage,
    timeTaken: data.timeTaken,
    completedAt: new Date(data.completedAt),
    attemptData: JSON.parse(data.attemptData), // Parse JSON string from TEXT column
  };
}

/**
 * Get all attempts for a specific assignment by a student
 */
export async function getMyAssignmentAttempts(
  assignmentId: string
): Promise<GameAttempt[]> {
  const studentId = await getCurrentStudentId();
  const { data, error } = await supabase
    .from('GameAttempt')
    .select('*')
    .eq('assignmentId', assignmentId)
    .eq('studentId', studentId)
    .order('completedAt', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch assignment attempts: ${error.message}`);
  }

  return data.map((attempt) => ({
    id: attempt.id,
    assignmentId: attempt.assignmentId,
    studentId: attempt.studentId,
    scorePercentage: attempt.scorePercentage,
    timeTaken: attempt.timeTaken,
    completedAt: new Date(attempt.completedAt),
    attemptData: JSON.parse(attempt.attemptData), // Parse JSON string from TEXT column
  }));
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
  const studentId = await getCurrentStudentId();
  const { data, error } = await supabase
    .from('GameAttempt')
    .select('*')
    .eq('studentId', studentId)
    .order('completedAt', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch student attempts: ${error.message}`);
  }

  return data.map((attempt) => ({
    id: attempt.id,
    assignmentId: attempt.assignmentId,
    studentId: attempt.studentId,
    scorePercentage: attempt.scorePercentage,
    timeTaken: attempt.timeTaken,
    completedAt: new Date(attempt.completedAt),
    attemptData: JSON.parse(attempt.attemptData), // Parse JSON string from TEXT column
  }));
}

/**
 * Delete all attempts for an assignment (for testing)
 */
export async function deleteAssignmentAttempts(assignmentId: string): Promise<void> {
  const { error } = await supabase
    .from('GameAttempt')
    .delete()
    .eq('assignmentId', assignmentId);

  if (error) {
    throw new Error(`Failed to delete assignment attempts: ${error.message}`);
  }
}
