/**
 * Helper functions to get Tutor/Student IDs from auth user IDs
 */

import { supabase } from '@/lib/supabase';

/**
 * Get Tutor ID from auth user ID
 */
export async function getTutorIdFromUserId(userId: string): Promise<string> {
  const { data, error } = await supabase.from('Tutor').select('id').eq('userId', userId).single();

  if (error || !data) {
    throw new Error('Tutor not found for this user');
  }

  return data.id;
}

/**
 * Get Student ID from auth user ID
 */
export async function getStudentIdFromUserId(userId: string): Promise<string> {
  const { data, error } = await supabase.from('Student').select('id').eq('userId', userId).single();

  if (error || !data) {
    throw new Error('Student not found for this user');
  }

  return data.id;
}

/**
 * Get current authenticated user ID
 */
export async function getCurrentUserId(): Promise<string | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user?.id || null;
}

/**
 * Get Tutor ID for current authenticated user
 */
export async function getCurrentTutorId(): Promise<string> {
  const userId = await getCurrentUserId();
  if (!userId) {
    throw new Error('No authenticated user');
  }
  return getTutorIdFromUserId(userId);
}

/**
 * Get Student ID for current authenticated user
 */
export async function getCurrentStudentId(): Promise<string> {
  const userId = await getCurrentUserId();
  if (!userId) {
    throw new Error('No authenticated user');
  }
  return getStudentIdFromUserId(userId);
}
