// Re-export auth utilities for convenience
export * from './auth-utils';
export { useAuth } from '@/contexts/AuthContext';
export { Role, SubscriptionStatus } from '@/types/auth';
export type { User, Tutor, Student, UserSession, AuthContextType } from '@/types/auth';
