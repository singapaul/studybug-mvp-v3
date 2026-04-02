import { SEED_ASSIGNMENTS, SEED_GAME_ATTEMPTS } from './seed';
import type { AssignmentService, CreateAssignmentInput } from '../interface';
import { Assignment, StudentAssignment, AssignmentFilter, AssignmentSort } from '@/types/assignment';
import { mockGameService } from './game.mock';
import { mockGameAttemptService } from './game-attempt.mock';
import { mockGroupService } from './group.mock';

let assignments: Assignment[] = SEED_ASSIGNMENTS.map((a) => ({ ...a }));

export const mockAssignmentService: AssignmentService = {
  async createAssignment(input: CreateAssignmentInput): Promise<Assignment> {
    const now = new Date();
    // Get the game and group
    const game = await mockGameService.getGameById(input.gameId);
    const group = await mockGroupService.getGroupById(input.groupId);
    if (!game || !group) throw new Error('Game or group not found');

    const assignment: Assignment = {
      id: crypto.randomUUID(),
      gameId: input.gameId,
      groupId: input.groupId,
      dueDate: input.dueDate ?? null,
      passPercentage: input.passPercentage ?? null,
      createdAt: now,
      updatedAt: now,
      game: game as any,
      group,
    };
    assignments = [assignment, ...assignments];
    return assignment;
  },

  async deleteAssignment(assignmentId: string): Promise<void> {
    assignments = assignments.filter((a) => a.id !== assignmentId);
  },

  async updateAssignment(
    assignmentId: string,
    updates: { dueDate?: Date | null; passPercentage?: number | null }
  ): Promise<Assignment> {
    const idx = assignments.findIndex((a) => a.id === assignmentId);
    if (idx === -1) throw new Error('Assignment not found');
    const updated: Assignment = {
      ...assignments[idx],
      ...(updates.dueDate !== undefined && { dueDate: updates.dueDate }),
      ...(updates.passPercentage !== undefined && { passPercentage: updates.passPercentage }),
      updatedAt: new Date(),
    };
    assignments = assignments.map((a) => (a.id === assignmentId ? updated : a));
    return updated;
  },

  async getGroupAssignments(groupId: string): Promise<Assignment[]> {
    return assignments
      .filter((a) => a.groupId === groupId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  async isGameAssignedToGroup(gameId: string, groupId: string): Promise<boolean> {
    return assignments.some((a) => a.gameId === gameId && a.groupId === groupId);
  },

  async getMyAssignments(
    studentId: string,
    filter: AssignmentFilter = 'all',
    sort: AssignmentSort = 'dueDate'
  ): Promise<StudentAssignment[]> {
    // Get student's groups
    const studentGroups = await mockGroupService.getMyGroupsAsStudent(studentId);
    const groupIds = studentGroups.map((g) => g.id);

    if (groupIds.length === 0) return [];

    // Get assignments for these groups
    const relevantAssignments = assignments.filter((a) => groupIds.includes(a.groupId));

    // Get all attempts for this student
    const allAttempts = await mockGameAttemptService.getMyAttempts(studentId);

    // Build enriched assignments
    let enriched: StudentAssignment[] = relevantAssignments.map((assignment) => {
      const studentAttempts = allAttempts.filter((a) => a.assignmentId === assignment.id);
      const bestScore =
        studentAttempts.length > 0
          ? Math.max(...studentAttempts.map((a) => a.scorePercentage))
          : undefined;
      const isCompleted = studentAttempts.length > 0;
      const isOverdue = !!(assignment.dueDate && new Date(assignment.dueDate) < new Date());
      const isPassing =
        bestScore !== undefined && assignment.passPercentage
          ? bestScore >= assignment.passPercentage
          : undefined;

      return {
        ...assignment,
        bestScore,
        attemptCount: studentAttempts.length,
        isCompleted,
        isOverdue,
        isPassing,
        gameAttempts: studentAttempts,
      };
    });

    // Apply filter
    if (filter === 'pending') {
      enriched = enriched.filter((a) => !a.isCompleted);
    } else if (filter === 'completed') {
      enriched = enriched.filter((a) => a.isCompleted);
    } else if (filter === 'overdue') {
      enriched = enriched.filter((a) => a.isOverdue && !a.isCompleted);
    }

    // Apply sort
    enriched.sort((a, b) => {
      if (sort === 'dueDate') {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      } else if (sort === 'group') {
        return a.group.name.localeCompare(b.group.name);
      } else if (sort === 'gameType') {
        return a.game.gameType.localeCompare(b.game.gameType);
      }
      return 0;
    });

    return enriched;
  },

  async getAssignmentById(studentId: string, assignmentId: string): Promise<StudentAssignment | null> {
    const assignment = assignments.find((a) => a.id === assignmentId);
    if (!assignment) return null;

    // Verify student has access
    const studentGroups = await mockGroupService.getMyGroupsAsStudent(studentId);
    const hasAccess = studentGroups.some((g) => g.id === assignment.groupId);
    if (!hasAccess) throw new Error('You do not have access to this assignment');

    const studentAttempts = await mockGameAttemptService.getMyAssignmentAttempts(studentId, assignmentId);
    const bestScore =
      studentAttempts.length > 0
        ? Math.max(...studentAttempts.map((a) => a.scorePercentage))
        : undefined;
    const isCompleted = studentAttempts.length > 0;
    const isOverdue = !!(assignment.dueDate && new Date(assignment.dueDate) < new Date());
    const isPassing =
      bestScore !== undefined && assignment.passPercentage
        ? bestScore >= assignment.passPercentage
        : undefined;

    // Parse game data
    const gameWithParsedData = {
      ...assignment.game,
      gameData: typeof assignment.game.gameData === 'string'
        ? JSON.parse(assignment.game.gameData)
        : assignment.game.gameData,
    };

    return {
      ...assignment,
      game: gameWithParsedData,
      bestScore,
      attemptCount: studentAttempts.length,
      isCompleted,
      isOverdue,
      isPassing,
      gameAttempts: studentAttempts,
    };
  },

  async getMyStats(studentId: string): Promise<{ totalGroups: number; totalAssignments: number; completedAssignments: number; averageScore: number }> {
    const studentGroups = await mockGroupService.getMyGroupsAsStudent(studentId);
    const allAssignments = await mockAssignmentService.getMyAssignments(studentId);
    const completed = allAssignments.filter((a) => a.isCompleted);
    const totalScore =
      completed.length > 0
        ? completed.reduce((sum, a) => sum + (a.bestScore || 0), 0) / completed.length
        : 0;

    return {
      totalGroups: studentGroups.length,
      totalAssignments: allAssignments.length,
      completedAssignments: completed.length,
      averageScore: Math.round(totalScore),
    };
  },

  async getMyAttempts(
    studentId: string,
    filters?: { gameType?: string; groupId?: string; startDate?: Date; endDate?: Date }
  ): Promise<any[]> {
    const rawAttempts = await mockGameAttemptService.getMyAttempts(studentId);

    let enriched = rawAttempts.map((attempt) => {
      const assignment = assignments.find((a) => a.id === attempt.assignmentId);
      return {
        ...attempt,
        attemptData: typeof attempt.attemptData === 'string'
          ? JSON.parse(attempt.attemptData)
          : attempt.attemptData,
        assignment,
        game: assignment?.game,
        group: assignment?.group,
      };
    });

    if (filters?.gameType) {
      enriched = enriched.filter((a) => a.game?.gameType === filters.gameType);
    }
    if (filters?.groupId) {
      enriched = enriched.filter((a) => a.group?.id === filters.groupId);
    }
    if (filters?.startDate) {
      enriched = enriched.filter((a) => new Date(a.completedAt) >= filters.startDate!);
    }
    if (filters?.endDate) {
      enriched = enriched.filter((a) => new Date(a.completedAt) <= filters.endDate!);
    }

    return enriched;
  },

  async getMyPersonalBests(studentId: string): Promise<any[]> {
    const attempts = await mockAssignmentService.getMyAttempts(studentId);

    const gameAttempts = new Map<string, typeof attempts>();
    attempts.forEach((attempt) => {
      const gameId = attempt.game?.id;
      if (!gameId) return;
      if (!gameAttempts.has(gameId)) gameAttempts.set(gameId, []);
      gameAttempts.get(gameId)!.push(attempt);
    });

    return Array.from(gameAttempts.entries()).map(([, list]) => {
      const game = list[0].game;
      const bestScore = Math.max(...list.map((a) => a.scorePercentage));
      const bestTime = Math.min(...list.map((a) => a.timeTaken));
      const totalAttempts = list.length;
      const averageScore = list.reduce((sum, a) => sum + a.scorePercentage, 0) / totalAttempts;
      return {
        game,
        bestScore,
        bestTime,
        totalAttempts,
        averageScore: Math.round(averageScore),
        lastPlayedAt: new Date(Math.max(...list.map((a) => new Date(a.completedAt).getTime()))),
      };
    }).sort((a, b) => b.bestScore - a.bestScore);
  },

  async getMyProgressTrends(studentId: string, days: number = 30): Promise<any> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    const attempts = await mockAssignmentService.getMyAttempts(studentId, { startDate: cutoffDate });

    const scoreOverTime = attempts.map((attempt, index: number) => ({
      date: new Date(attempt.completedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      score: attempt.scorePercentage,
      attemptNumber: index + 1,
    }));

    const gameTypePerformance = new Map<string, number[]>();
    attempts.forEach((attempt) => {
      const gameType = attempt.game?.gameType || 'Unknown';
      if (!gameTypePerformance.has(gameType)) gameTypePerformance.set(gameType, []);
      gameTypePerformance.get(gameType)!.push(attempt.scorePercentage);
    });

    const performanceByGameType = Array.from(gameTypePerformance.entries()).map(([gameType, scores]) => ({
      gameType,
      averageScore: Math.round(scores.reduce((sum, s) => sum + s, 0) / scores.length),
      attempts: scores.length,
    }));

    return {
      scoreOverTime,
      performanceByGameType,
      currentStreak: attempts.length > 0 ? 1 : 0,
      totalAttempts: attempts.length,
      averageScore: attempts.length > 0
        ? Math.round(attempts.reduce((sum, a) => sum + a.scorePercentage, 0) / attempts.length)
        : 0,
    };
  },

  async getAttemptDetails(attemptId: string): Promise<any> {
    // Search in seed data and any newly saved attempts via game attempt service
    const allAttempts = await mockGameAttemptService.getMyAttempts('student-profile-1');
    const seedAndNew = [...SEED_GAME_ATTEMPTS, ...allAttempts.filter(
      (a) => !SEED_GAME_ATTEMPTS.find((s) => s.id === a.id)
    )];

    const attempt = seedAndNew.find((a) => a.id === attemptId);
    if (!attempt) return null;

    const assignment = assignments.find((a) => a.id === attempt.assignmentId);
    return {
      ...attempt,
      attemptData: typeof attempt.attemptData === 'string'
        ? JSON.parse(attempt.attemptData)
        : attempt.attemptData,
      assignment,
      game: assignment?.game,
      group: assignment?.group,
    };
  },
};

export function resetAssignmentMockData(): void {
  assignments = SEED_ASSIGNMENTS.map((a) => ({ ...a }));
}
