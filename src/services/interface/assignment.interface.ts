import { Assignment, StudentAssignment, AssignmentFilter, AssignmentSort } from '@/types/assignment';

export interface CreateAssignmentInput {
  gameId: string;
  groupId: string;
  dueDate?: Date | null;
  passPercentage?: number | null;
}

export interface AssignmentService {
  createAssignment(input: CreateAssignmentInput): Promise<Assignment>;
  deleteAssignment(assignmentId: string): Promise<void>;
  updateAssignment(assignmentId: string, updates: { dueDate?: Date | null; passPercentage?: number | null }): Promise<Assignment>;
  getGroupAssignments(groupId: string): Promise<Assignment[]>;
  isGameAssignedToGroup(gameId: string, groupId: string): Promise<boolean>;
  getMyAssignments(studentId: string, filter?: AssignmentFilter, sort?: AssignmentSort): Promise<StudentAssignment[]>;
  getAssignmentById(studentId: string, assignmentId: string): Promise<StudentAssignment | null>;
  getMyStats(studentId: string): Promise<{ totalGroups: number; totalAssignments: number; completedAssignments: number; averageScore: number }>;
  getMyAttempts(studentId: string, filters?: { gameType?: string; groupId?: string; startDate?: Date; endDate?: Date }): Promise<any[]>;
  getMyPersonalBests(studentId: string): Promise<any[]>;
  getMyProgressTrends(studentId: string, days?: number): Promise<any>;
  getAttemptDetails(attemptId: string): Promise<any>;
}
