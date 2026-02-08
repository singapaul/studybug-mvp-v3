/**
 * Supabase Assignment Service
 * Handles creating and managing game assignments for groups
 */

import { supabase } from '@/lib/supabase';

export interface CreateAssignmentInput {
  gameId: string;
  groupId: string;
  dueDate?: Date | null;
  passPercentage?: number | null;
}

/**
 * Create a new assignment (assign a game to a group)
 */
export async function createAssignment(input: CreateAssignmentInput) {
  const { data, error } = await supabase
    .from('Assignment')
    .insert({
      gameId: input.gameId,
      groupId: input.groupId,
      dueDate: input.dueDate?.toISOString() || null,
      passPercentage: input.passPercentage || null,
    })
    .select(
      `
      *,
      game:Game(*),
      group:Group(*)
    `
    )
    .single();

  if (error) {
    throw new Error(`Failed to create assignment: ${error.message}`);
  }

  return data;
}

/**
 * Delete an assignment
 */
export async function deleteAssignment(assignmentId: string): Promise<void> {
  const { error } = await supabase.from('Assignment').delete().eq('id', assignmentId);

  if (error) {
    throw new Error(`Failed to delete assignment: ${error.message}`);
  }
}

/**
 * Update an assignment
 */
export async function updateAssignment(
  assignmentId: string,
  updates: {
    dueDate?: Date | null;
    passPercentage?: number | null;
  }
) {
  const { data, error } = await supabase
    .from('Assignment')
    .update({
      dueDate: updates.dueDate?.toISOString() || null,
      passPercentage: updates.passPercentage || null,
    })
    .eq('id', assignmentId)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update assignment: ${error.message}`);
  }

  return data;
}

/**
 * Get all assignments for a specific group
 */
export async function getGroupAssignments(groupId: string) {
  const { data, error } = await supabase
    .from('Assignment')
    .select(
      `
      *,
      game:Game(*),
      gameAttempts:GameAttempt(*)
    `
    )
    .eq('groupId', groupId)
    .order('createdAt', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch group assignments: ${error.message}`);
  }

  return data;
}

/**
 * Check if a game is already assigned to a group
 */
export async function isGameAssignedToGroup(gameId: string, groupId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('Assignment')
    .select('id')
    .eq('gameId', gameId)
    .eq('groupId', groupId)
    .single();

  if (error && error.code !== 'PGRST116') {
    // PGRST116 is "not found" which is expected
    throw new Error(`Failed to check assignment: ${error.message}`);
  }

  return !!data;
}
