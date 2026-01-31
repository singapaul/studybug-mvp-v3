// User and authentication types based on Prisma schema

export enum Role {
  TUTOR = 'TUTOR',
  STUDENT = 'STUDENT',
}

export enum SubscriptionStatus {
  FREE = 'FREE',
  ACTIVE = 'ACTIVE',
  CANCELLED = 'CANCELLED',
  EXPIRED = 'EXPIRED',
}

export interface User {
  id: string;
  email: string;
  role: Role;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Tutor {
  id: string;
  userId: string;
  subscriptionStatus: SubscriptionStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface Student {
  id: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserSession {
  user: User;
  tutor?: Tutor;
  student?: Student;
}

export interface AuthContextType {
  session: UserSession | null;
  isAuthenticated: boolean;
  isTutor: boolean;
  isStudent: boolean;
  login: (role: Role) => void;
  logout: () => void;
  switchRole: (role: Role) => void;
}
