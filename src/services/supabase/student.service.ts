/**
 * Supabase Student Service
 * Handles all student-related database operations
 */

import { supabase } from '@/lib/supabase';
import { StudentAssignment, AssignmentFilter, AssignmentSort } from '@/types/assignment';
import { Group } from '@/types/group';
import { GameType } from '@/types/game';
import { getGroupByJoinCode } from './group.service';

/**
 * Get the current authenticated student's ID
 */
async function getCurrentStudentId(): Promise<string> {
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error('Not authenticated');
  }

  const { data: student, error: studentError } = await supabase
    .from('Student')
    .select('id')
    .eq('userId', user.id)
    .single();

  if (studentError || !student) {
    throw new Error('Student profile not found');
  }

  return student.id;
}

/**
 * Join a group using a join code
 */
export async function joinGroup(
  joinCode: string
): Promise<{ success: boolean; error?: string; groupName?: string }> {
  const normalizedCode = joinCode.trim().toUpperCase();

  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return {
      success: false,
      error: 'Not authenticated',
    };
  }

  const studentId = await getCurrentStudentId();

  const group = await getGroupByJoinCode(normalizedCode);
  if (!group) {
    return {
      success: false,
      error: 'Invalid join code. Please check and try again.',
    };
  }

  // Check if already a member
  const { data: existingMember } = await supabase
    .from('GroupMember')
    .select('id')
    .eq('groupId', group.id)
    .eq('studentId', studentId)
    .single();

  if (existingMember) {
    return {
      success: false,
      error: "You're already a member of this group.",
    };
  }

  try {
    // Add student to group
    const { error: insertError } = await supabase
      .from('GroupMember')
      .insert({
        groupId: group.id,
        studentId: studentId,
      });

    if (insertError) {
      throw insertError;
    }

    return {
      success: true,
      groupName: group.name,
    };
  } catch (error) {
    return {
      success: false,
      error: 'Failed to join group. Please try again.',
    };
  }
}

/**
 * Get all groups the current student is a member of
 */
export async function getMyGroups(): Promise<Group[]> {
  const studentId = await getCurrentStudentId();

  const { data, error } = await supabase
    .from('GroupMember')
    .select(`
      group:Group(*)
    `)
    .eq('studentId', studentId);

  if (error) {
    throw new Error(`Failed to fetch student groups: ${error.message}`);
  }

  return data.map((item) => ({
    id: item.group.id,
    tutorId: item.group.tutorId,
    name: item.group.name,
    ageRange: item.group.ageRange,
    subjectArea: item.group.subjectArea,
    joinCode: item.group.joinCode,
    createdAt: new Date(item.group.createdAt),
    updatedAt: new Date(item.group.updatedAt),
  }));
}

/**
 * Get all assignments for the current student across all their groups
 */
export async function getMyAssignments(
  filter: AssignmentFilter = 'all',
  sort: AssignmentSort = 'dueDate'
): Promise<StudentAssignment[]> {
  const studentId = await getCurrentStudentId();

  // Get student's group IDs
  const { data: memberData, error: memberError } = await supabase
    .from('GroupMember')
    .select('groupId')
    .eq('studentId', studentId);

  if (memberError) {
    throw new Error(`Failed to fetch student memberships: ${memberError.message}`);
  }

  const groupIds = memberData.map((m) => m.groupId);

  if (groupIds.length === 0) {
    return [];
  }

  // Get assignments for these groups with related data
  const { data: assignments, error: assignmentError } = await supabase
    .from('Assignment')
    .select(`
      *,
      game:Game(*),
      group:Group(*),
      gameAttempts:GameAttempt(*)
    `)
    .in('groupId', groupIds);

  if (assignmentError) {
    throw new Error(`Failed to fetch assignments: ${assignmentError.message}`);
  }

  // Get student's attempts
  const { data: attempts, error: attemptsError } = await supabase
    .from('GameAttempt')
    .select('*')
    .eq('studentId', studentId);

  if (attemptsError) {
    throw new Error(`Failed to fetch attempts: ${attemptsError.message}`);
  }

  // Build enriched assignments
  const enrichedAssignments: StudentAssignment[] = assignments.map((assignment) => {
    const studentAttempts = attempts.filter(
      (a) => a.assignmentId === assignment.id
    );

    const bestScore =
      studentAttempts.length > 0
        ? Math.max(...studentAttempts.map((a) => a.scorePercentage))
        : undefined;

    const isCompleted = studentAttempts.length > 0;
    const isOverdue = assignment.dueDate && new Date(assignment.dueDate) < new Date();
    const isPassing =
      bestScore !== undefined && assignment.passPercentage
        ? bestScore >= assignment.passPercentage
        : undefined;

    return {
      id: assignment.id,
      gameId: assignment.gameId,
      groupId: assignment.groupId,
      dueDate: assignment.dueDate ? new Date(assignment.dueDate) : null,
      passPercentage: assignment.passPercentage,
      createdAt: new Date(assignment.createdAt),
      updatedAt: new Date(assignment.updatedAt),
      game: {
        id: assignment.game.id,
        tutorId: assignment.game.tutorId,
        name: assignment.game.name,
        gameType: assignment.game.gameType as GameType,
        gameData: JSON.parse(assignment.game.gameData),
        createdAt: new Date(assignment.game.createdAt),
        updatedAt: new Date(assignment.game.updatedAt),
      },
      group: {
        id: assignment.group.id,
        tutorId: assignment.group.tutorId,
        name: assignment.group.name,
        ageRange: assignment.group.ageRange,
        subjectArea: assignment.group.subjectArea,
        joinCode: assignment.group.joinCode,
        createdAt: new Date(assignment.group.createdAt),
        updatedAt: new Date(assignment.group.updatedAt),
      },
      bestScore,
      attemptCount: studentAttempts.length,
      isCompleted,
      isOverdue,
      isPassing,
      gameAttempts: studentAttempts.map((a) => ({
        id: a.id,
        assignmentId: a.assignmentId,
        studentId: a.studentId,
        scorePercentage: a.scorePercentage,
        timeTaken: a.timeTaken,
        completedAt: new Date(a.completedAt),
        attemptData: JSON.parse(a.attemptData),
      })),
    };
  });

  // Apply filter
  let filtered = enrichedAssignments;
  if (filter === 'pending') {
    filtered = enrichedAssignments.filter((a) => !a.isCompleted);
  } else if (filter === 'completed') {
    filtered = enrichedAssignments.filter((a) => a.isCompleted);
  } else if (filter === 'overdue') {
    filtered = enrichedAssignments.filter((a) => a.isOverdue && !a.isCompleted);
  }

  // Apply sort
  filtered.sort((a, b) => {
    if (sort === 'dueDate') {
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return a.dueDate.getTime() - b.dueDate.getTime();
    } else if (sort === 'group') {
      return a.group.name.localeCompare(b.group.name);
    } else if (sort === 'gameType') {
      return a.game.gameType.localeCompare(b.game.gameType);
    }
    return 0;
  });

  return filtered;
}

/**
 * Get dashboard stats for the current student
 */
export async function getMyStats() {
  const groups = await getMyGroups();
  const assignments = await getMyAssignments();
  const completed = assignments.filter((a) => a.isCompleted);

  const totalScore =
    completed.length > 0
      ? completed.reduce((sum, a) => sum + (a.bestScore || 0), 0) / completed.length
      : 0;

  return {
    totalGroups: groups.length,
    totalAssignments: assignments.length,
    completedAssignments: completed.length,
    averageScore: Math.round(totalScore),
  };
}

/**
 * Get all game attempts for the current student with enriched data
 */
export async function getMyAttempts(
  filters?: {
    gameType?: string;
    groupId?: string;
    startDate?: Date;
    endDate?: Date;
  }
) {
  const studentId = await getCurrentStudentId();

  const query = supabase
    .from('GameAttempt')
    .select(`
      *,
      assignment:Assignment(
        *,
        game:Game(*),
        group:Group(*)
      )
    `)
    .eq('studentId', studentId)
    .order('completedAt', { ascending: false });

  const { data, error } = await query;

  if (error) {
    throw new Error(`Failed to fetch student attempts: ${error.message}`);
  }

  let enrichedAttempts = data.map((attempt) => ({
    id: attempt.id,
    assignmentId: attempt.assignmentId,
    studentId: attempt.studentId,
    scorePercentage: attempt.scorePercentage,
    timeTaken: attempt.timeTaken,
    completedAt: new Date(attempt.completedAt),
    attemptData: JSON.parse(attempt.attemptData),
    assignment: attempt.assignment,
    game: attempt.assignment?.game,
    group: attempt.assignment?.group,
  }));

  // Apply filters
  if (filters?.gameType) {
    enrichedAttempts = enrichedAttempts.filter(
      (a) => a.game?.gameType === filters.gameType
    );
  }
  if (filters?.groupId) {
    enrichedAttempts = enrichedAttempts.filter(
      (a) => a.group?.id === filters.groupId
    );
  }
  if (filters?.startDate) {
    enrichedAttempts = enrichedAttempts.filter(
      (a) => new Date(a.completedAt) >= filters.startDate!
    );
  }
  if (filters?.endDate) {
    enrichedAttempts = enrichedAttempts.filter(
      (a) => new Date(a.completedAt) <= filters.endDate!
    );
  }

  return enrichedAttempts;
}

/**
 * Get personal bests for each game the current student has played
 */
export async function getMyPersonalBests() {
  const attempts = await getMyAttempts();

  // Group by game
  const gameAttempts = new Map<string, typeof attempts>();
  attempts.forEach((attempt) => {
    const gameId = attempt.game?.id;
    if (!gameId) return;

    if (!gameAttempts.has(gameId)) {
      gameAttempts.set(gameId, []);
    }
    gameAttempts.get(gameId)!.push(attempt);
  });

  // Calculate personal bests
  const personalBests = Array.from(gameAttempts.entries()).map(([, gameAttemptsList]) => {
    const game = gameAttemptsList[0].game;
    const bestScore = Math.max(...gameAttemptsList.map((a) => a.scorePercentage));
    const bestTime = Math.min(...gameAttemptsList.map((a) => a.timeTaken));
    const totalAttempts = gameAttemptsList.length;
    const averageScore =
      gameAttemptsList.reduce((sum, a) => sum + a.scorePercentage, 0) /
      totalAttempts;

    return {
      game,
      bestScore,
      bestTime,
      totalAttempts,
      averageScore: Math.round(averageScore),
      lastPlayedAt: new Date(
        Math.max(...gameAttemptsList.map((a) => new Date(a.completedAt).getTime()))
      ),
    };
  });

  personalBests.sort((a, b) => b.bestScore - a.bestScore);

  return personalBests;
}

/**
 * Get progress trends data for charts for the current student
 */
export async function getMyProgressTrends(days: number = 30) {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);

  const attempts = await getMyAttempts({
    startDate: cutoffDate,
  });

  // Calculate score over time
  const scoreOverTime = attempts.map((attempt, index: number) => ({
    date: new Date(attempt.completedAt).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    }),
    score: attempt.scorePercentage,
    attemptNumber: index + 1,
  }));

  // Calculate performance by game type
  const gameTypePerformance = new Map<string, number[]>();
  attempts.forEach((attempt) => {
    const gameType = attempt.game?.gameType || 'Unknown';
    if (!gameTypePerformance.has(gameType)) {
      gameTypePerformance.set(gameType, []);
    }
    gameTypePerformance.get(gameType)!.push(attempt.scorePercentage);
  });

  const performanceByGameType = Array.from(gameTypePerformance.entries()).map(
    ([gameType, scores]) => ({
      gameType,
      averageScore: Math.round(scores.reduce((sum, s) => sum + s, 0) / scores.length),
      attempts: scores.length,
    })
  );

  // Calculate streak
  const attemptDates = attempts.map((a) => new Date(a.completedAt).toDateString());
  const uniqueDates = [...new Set(attemptDates)].sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime()
  );

  let currentStreak = 0;
  const checkDate = new Date();

  for (let i = 0; i < uniqueDates.length; i++) {
    const dateStr = checkDate.toDateString();
    if (uniqueDates.includes(dateStr)) {
      currentStreak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }

  return {
    scoreOverTime,
    performanceByGameType,
    currentStreak,
    totalAttempts: attempts.length,
    averageScore:
      attempts.length > 0
        ? Math.round(
            attempts.reduce((sum, a) => sum + a.scorePercentage, 0) /
              attempts.length
          )
        : 0,
  };
}

/**
 * Get detailed attempt data including question breakdown
 */
export async function getAttemptDetails(attemptId: string) {
  const { data, error } = await supabase
    .from('GameAttempt')
    .select(`
      *,
      assignment:Assignment(
        *,
        game:Game(*),
        group:Group(*)
      )
    `)
    .eq('id', attemptId)
    .single();

  if (error) {
    throw new Error(`Failed to fetch attempt details: ${error.message}`);
  }

  return {
    id: data.id,
    assignmentId: data.assignmentId,
    studentId: data.studentId,
    scorePercentage: data.scorePercentage,
    timeTaken: data.timeTaken,
    completedAt: new Date(data.completedAt),
    attemptData: JSON.parse(data.attemptData),
    assignment: data.assignment,
    game: data.assignment?.game,
    group: data.assignment?.group,
  };
}
