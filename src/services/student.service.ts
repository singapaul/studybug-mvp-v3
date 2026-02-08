/**
 * Mock Student Service
 * In production, this would call real API endpoints
 */

import { Group } from '@/types/group';
import { StudentAssignment, AssignmentFilter, AssignmentSort } from '@/types/assignment';
// import { getGroupByJoinCode, addStudentToGroup, getGroups } from './group.service';
// import { getGames } from './game.service';

const MEMBERS_KEY = 'dev_group_members';
const ASSIGNMENTS_KEY = 'dev_assignments';
const ATTEMPTS_KEY = 'dev_game_attempts';

// Helper to get group members
function getMembers() {
  const stored = localStorage.getItem(MEMBERS_KEY);
  if (!stored) return [];
  return JSON.parse(stored).map((m: any) => ({
    ...m,
    joinedAt: new Date(m.joinedAt),
  }));
}

// Helper to get assignments
function getAssignments() {
  const stored = localStorage.getItem(ASSIGNMENTS_KEY);
  if (!stored) return [];
  return JSON.parse(stored).map((a: any) => ({
    ...a,
    dueDate: a.dueDate ? new Date(a.dueDate) : null,
    createdAt: new Date(a.createdAt),
    updatedAt: new Date(a.updatedAt),
  }));
}

// Helper to get attempts
function getAttempts() {
  const stored = localStorage.getItem(ATTEMPTS_KEY);
  if (!stored) return [];
  return JSON.parse(stored).map((a: any) => ({
    ...a,
    completedAt: new Date(a.completedAt),
  }));
}

/**
 * Join a group using a join code
 */
export async function joinGroup(
  studentId: string,
  studentEmail: string,
  joinCode: string
): Promise<{ success: boolean; error?: string; groupName?: string }> {
  await new Promise((resolve) => setTimeout(resolve, 400));

  // Normalize join code
  const normalizedCode = joinCode.trim().toUpperCase();

  // Check if code exists
  const group = await getGroupByJoinCode(normalizedCode);
  if (!group) {
    return {
      success: false,
      error: 'Invalid join code. Please check and try again.',
    };
  }

  // Check if already a member
  const members = getMembers();
  const isAlreadyMember = members.some(
    (m: any) => m.groupId === group.id && m.studentId === studentId
  );

  if (isAlreadyMember) {
    return {
      success: false,
      error: "You're already a member of this group.",
    };
  }

  // Add student to group
  try {
    await addStudentToGroup(group.id, studentId, studentEmail);
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
 * Get all groups a student is a member of
 */
export async function getStudentGroups(studentId: string): Promise<Group[]> {
  await new Promise((resolve) => setTimeout(resolve, 300));

  const members = getMembers();
  const studentMembers = members.filter((m: any) => m.studentId === studentId);
  const allGroups = await getGroups();

  return allGroups.filter((group) =>
    studentMembers.some((m: any) => m.groupId === group.id)
  );
}

/**
 * Get all assignments for a student across all their groups
 */
export async function getStudentAssignments(
  studentId: string,
  filter: AssignmentFilter = 'all',
  sort: AssignmentSort = 'dueDate'
): Promise<StudentAssignment[]> {
  await new Promise((resolve) => setTimeout(resolve, 400));

  // Get student's groups
  const groups = await getStudentGroups(studentId);
  const groupIds = groups.map((g) => g.id);

  // Get all assignments for these groups
  const allAssignments = getAssignments();
  const studentAssignments = allAssignments.filter((a: any) =>
    groupIds.includes(a.groupId)
  );

  // Get all attempts for this student
  const allAttempts = getAttempts();
  const studentAttempts = allAttempts.filter(
    (a: any) => a.studentId === studentId
  );

  // Get all games (for game details)
  const allGames = await getGames();

  // Build student assignments with attempt data
  const enrichedAssignments: StudentAssignment[] = studentAssignments.map(
    (assignment: any) => {
      const attempts = studentAttempts.filter(
        (a: any) => a.assignmentId === assignment.id
      );
      const bestScore =
        attempts.length > 0
          ? Math.max(...attempts.map((a: any) => a.scorePercentage))
          : undefined;

      const isCompleted = attempts.length > 0;
      const isOverdue =
        assignment.dueDate && new Date(assignment.dueDate) < new Date();
      const isPassing =
        bestScore !== undefined && assignment.passPercentage
          ? bestScore >= assignment.passPercentage
          : undefined;

      const group = groups.find((g) => g.id === assignment.groupId)!;
      const game = allGames.find((g: any) => g.id === assignment.gameId)!;

      return {
        ...assignment,
        game,
        group,
        bestScore,
        attemptCount: attempts.length,
        isCompleted,
        isOverdue,
        isPassing,
        gameAttempts: attempts,
      };
    }
  );

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
 * Get student dashboard stats
 */
export async function getStudentStats(studentId: string) {
  await new Promise((resolve) => setTimeout(resolve, 200));

  const groups = await getStudentGroups(studentId);
  const assignments = await getStudentAssignments(studentId);
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
 * Get all game attempts for a student with enriched data
 */
export async function getStudentAttempts(
  studentId: string,
  filters?: {
    gameType?: string;
    groupId?: string;
    startDate?: Date;
    endDate?: Date;
  }
) {
  await new Promise((resolve) => setTimeout(resolve, 300));

  const allAttempts = getAttempts();
  const studentAttempts = allAttempts.filter(
    (a: any) => a.studentId === studentId
  );

  // Get all assignments and games for enrichment
  const assignments = await getStudentAssignments(studentId);
  const allGames = await getGames();
  const groups = await getStudentGroups(studentId);

  // Enrich attempts with game and assignment data
  let enrichedAttempts = studentAttempts.map((attempt: any) => {
    const assignment = assignments.find((a) => a.id === attempt.assignmentId);
    const game = allGames.find((g: any) => g.id === assignment?.gameId);
    const group = groups.find((g) => g.id === assignment?.groupId);

    return {
      ...attempt,
      assignment,
      game,
      group,
    };
  });

  // Apply filters
  if (filters?.gameType) {
    enrichedAttempts = enrichedAttempts.filter(
      (a: any) => a.game?.gameType === filters.gameType
    );
  }
  if (filters?.groupId) {
    enrichedAttempts = enrichedAttempts.filter(
      (a: any) => a.group?.id === filters.groupId
    );
  }
  if (filters?.startDate) {
    enrichedAttempts = enrichedAttempts.filter(
      (a: any) => new Date(a.completedAt) >= filters.startDate!
    );
  }
  if (filters?.endDate) {
    enrichedAttempts = enrichedAttempts.filter(
      (a: any) => new Date(a.completedAt) <= filters.endDate!
    );
  }

  // Sort by completion date (newest first)
  enrichedAttempts.sort(
    (a: any, b: any) =>
      new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
  );

  return enrichedAttempts;
}

/**
 * Get personal bests for each game the student has played
 */
export async function getStudentPersonalBests(studentId: string) {
  await new Promise((resolve) => setTimeout(resolve, 300));

  const allAttempts = getAttempts();
  const studentAttempts = allAttempts.filter(
    (a: any) => a.studentId === studentId
  );

  const allGames = await getGames();
  const assignments = await getStudentAssignments(studentId);

  // Group attempts by game
  const gameAttempts = new Map<string, any[]>();
  studentAttempts.forEach((attempt: any) => {
    const assignment = assignments.find((a) => a.id === attempt.assignmentId);
    if (!assignment) return;

    const gameId = assignment.gameId;
    if (!gameAttempts.has(gameId)) {
      gameAttempts.set(gameId, []);
    }
    gameAttempts.get(gameId)!.push({
      ...attempt,
      assignment,
    });
  });

  // Calculate personal bests for each game
  const personalBests = Array.from(gameAttempts.entries()).map(
    ([gameId, attempts]) => {
      const game = allGames.find((g: any) => g.id === gameId);
      const bestScore = Math.max(...attempts.map((a: any) => a.scorePercentage));
      const bestTime = Math.min(...attempts.map((a: any) => a.timeTaken));
      const totalAttempts = attempts.length;
      const averageScore =
        attempts.reduce((sum: number, a: any) => sum + a.scorePercentage, 0) /
        totalAttempts;

      return {
        game,
        bestScore,
        bestTime,
        totalAttempts,
        averageScore: Math.round(averageScore),
        lastPlayedAt: new Date(
          Math.max(...attempts.map((a: any) => new Date(a.completedAt).getTime()))
        ),
      };
    }
  );

  // Sort by best score
  personalBests.sort((a, b) => b.bestScore - a.bestScore);

  return personalBests;
}

/**
 * Get progress trends data for charts
 */
export async function getStudentProgressTrends(
  studentId: string,
  days: number = 30
) {
  await new Promise((resolve) => setTimeout(resolve, 300));

  const allAttempts = getAttempts();
  const studentAttempts = allAttempts.filter(
    (a: any) => a.studentId === studentId
  );

  const assignments = await getStudentAssignments(studentId);
  const allGames = await getGames();

  // Filter to recent attempts
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);

  const recentAttempts = studentAttempts
    .filter((a: any) => new Date(a.completedAt) >= cutoffDate)
    .map((attempt: any) => {
      const assignment = assignments.find((a) => a.id === attempt.assignmentId);
      const game = allGames.find((g: any) => g.id === assignment?.gameId);
      return {
        ...attempt,
        game,
      };
    })
    .sort(
      (a: any, b: any) =>
        new Date(a.completedAt).getTime() - new Date(b.completedAt).getTime()
    );

  // Calculate score over time
  const scoreOverTime = recentAttempts.map((attempt: any, index: number) => ({
    date: new Date(attempt.completedAt).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    }),
    score: attempt.scorePercentage,
    attemptNumber: index + 1,
  }));

  // Calculate performance by game type
  const gameTypePerformance = new Map<string, number[]>();
  recentAttempts.forEach((attempt: any) => {
    const gameType = attempt.game?.gameType || 'Unknown';
    if (!gameTypePerformance.has(gameType)) {
      gameTypePerformance.set(gameType, []);
    }
    gameTypePerformance.get(gameType)!.push(attempt.scorePercentage);
  });

  const performanceByGameType = Array.from(gameTypePerformance.entries()).map(
    ([gameType, scores]) => ({
      gameType,
      averageScore: Math.round(
        scores.reduce((sum, s) => sum + s, 0) / scores.length
      ),
      attempts: scores.length,
    })
  );

  // Calculate streak (consecutive days with at least one attempt)
  const attemptDates = recentAttempts.map((a: any) =>
    new Date(a.completedAt).toDateString()
  );
  const uniqueDates = [...new Set(attemptDates)].sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime()
  );

  let currentStreak = 0;
  const today = new Date().toDateString();
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
    totalAttempts: recentAttempts.length,
    averageScore:
      recentAttempts.length > 0
        ? Math.round(
            recentAttempts.reduce(
              (sum: number, a: any) => sum + a.scorePercentage,
              0
            ) / recentAttempts.length
          )
        : 0,
  };
}

/**
 * Get detailed attempt data including question breakdown
 */
export async function getAttemptDetails(attemptId: string) {
  await new Promise((resolve) => setTimeout(resolve, 200));

  const allAttempts = getAttempts();
  const attempt = allAttempts.find((a: any) => a.id === attemptId);

  if (!attempt) {
    throw new Error('Attempt not found');
  }

  const assignments = getAssignments();
  const assignment = assignments.find((a: any) => a.id === attempt.assignmentId);

  const allGames = await getGames();
  const game = allGames.find((g: any) => g.id === assignment?.gameId);

  const groups = await getStudentGroups(attempt.studentId);
  const group = groups.find((g) => g.id === assignment?.groupId);

  // Parse attempt data (if it's a JSON string)
  let attemptData = attempt.attemptData;
  if (typeof attemptData === 'string') {
    try {
      attemptData = JSON.parse(attemptData);
    } catch (e) {
      // Already parsed or invalid
    }
  }

  return {
    ...attempt,
    assignment,
    game,
    group,
    attemptData,
  };
}

// Export helper for other services
export async function getGames() {
  const stored = localStorage.getItem('dev_games');
  if (!stored) return [];
  return JSON.parse(stored).map((g: any) => ({
    ...g,
    createdAt: new Date(g.createdAt),
    updatedAt: new Date(g.updatedAt),
  }));
}

export async function getGroups() {
  const stored = localStorage.getItem('dev_groups');
  if (!stored) return [];
  return JSON.parse(stored).map((g: any) => ({
    ...g,
    createdAt: new Date(g.createdAt),
    updatedAt: new Date(g.updatedAt),
  }));
}
