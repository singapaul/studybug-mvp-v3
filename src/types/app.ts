// App-wide types for the Studybug MVP

export type UserRole = 'tutor' | 'student';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: string;
}

export interface DemoClass {
  id: string;
  name: string;
  subject: string;
  ageRange: string;
  description: string;
  joinCode: string;
  tutorId: string;
  studentIds: string[];
  createdAt: string;
}

export interface DemoStudent {
  id: string;
  name: string;
  email: string;
  joinedAt: string;
  lastActive: string;
  classIds: string[];
}

export type GameType = 'multiple-choice' | 'flashcards';

export interface MultipleChoiceQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
}

export interface FlashcardQuestion {
  id: string;
  front: string;
  back: string;
}

export interface DemoGame {
  id: string;
  name: string;
  type: GameType;
  subject: string;
  description: string;
  questions: MultipleChoiceQuestion[] | FlashcardQuestion[];
  tutorId: string;
  timesAssigned: number;
  createdAt: string;
}

export interface DemoAssignment {
  id: string;
  gameId: string;
  classId: string;
  dueDate: string;
  passPercentage?: number;
  createdAt: string;
}

export interface StudentProgress {
  id: string;
  studentId: string;
  assignmentId: string;
  status: 'not-started' | 'in-progress' | 'completed';
  score?: number;
  attempts: number;
  timeSpent?: number; // in seconds
  lastPlayedAt?: string;
  answers?: { questionId: string; answer: number | string; correct: boolean; timeSpent: number }[];
}

export interface ActivityItem {
  id: string;
  type: 'student-joined' | 'assignment-completed' | 'assignment-created' | 'class-created' | 'game-created';
  message: string;
  timestamp: string;
  metadata?: Record<string, string>;
}

export interface GameSession {
  assignmentId: string;
  gameId: string;
  currentQuestionIndex: number;
  answers: { questionId: string; answer: number | string; correct: boolean; timeSpent: number }[];
  startTime: number;
  isPaused: boolean;
}

export interface GameResult {
  assignmentId: string;
  score: number;
  totalQuestions: number;
  timeSpent: number;
  answers: { questionId: string; answer: number | string; correct: boolean; timeSpent: number }[];
  completedAt: string;
}
