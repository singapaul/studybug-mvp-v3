// Assignment and attempt types for students

import { Game } from './game';
import { Group } from './group';

export interface Assignment {
  id: string;
  gameId: string;
  groupId: string;
  dueDate: Date | null;
  passPercentage: number | null;
  createdAt: Date;
  updatedAt: Date;
  game: Game;
  group: Group;
  gameAttempts?: GameAttempt[];
}

export interface GameAttempt {
  id: string;
  assignmentId: string;
  studentId: string;
  scorePercentage: number;
  timeTaken: number;
  completedAt: Date;
  attemptData: string; // JSON string
}

export interface StudentAssignment extends Assignment {
  bestScore?: number;
  attemptCount: number;
  isCompleted: boolean;
  isOverdue: boolean;
  isPassing?: boolean;
}

export type AssignmentStatus = 'pending' | 'completed' | 'overdue';
export type AssignmentFilter = 'all' | 'pending' | 'completed' | 'overdue';
export type AssignmentSort = 'dueDate' | 'group' | 'gameType';
