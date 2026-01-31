import { Role, UserSession } from '@/types/auth';

/**
 * Check if user has a specific role
 */
export function hasRole(session: UserSession | null, role: Role): boolean {
  return session?.user.role === role;
}

/**
 * Check if user is a tutor
 */
export function isTutor(session: UserSession | null): boolean {
  return hasRole(session, Role.TUTOR);
}

/**
 * Check if user is a student
 */
export function isStudent(session: UserSession | null): boolean {
  return hasRole(session, Role.STUDENT);
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(session: UserSession | null): boolean {
  return session !== null;
}

/**
 * Get tutor profile from session
 */
export function getTutorProfile(session: UserSession | null) {
  if (isTutor(session)) {
    return session?.tutor;
  }
  return null;
}

/**
 * Get student profile from session
 */
export function getStudentProfile(session: UserSession | null) {
  if (isStudent(session)) {
    return session?.student;
  }
  return null;
}

/**
 * Get display name for user (email prefix for now)
 */
export function getDisplayName(session: UserSession | null): string {
  if (!session) return 'Guest';
  return session.user.email.split('@')[0];
}

/**
 * Get role-specific home path
 */
export function getHomePath(role: Role): string {
  return role === Role.TUTOR ? '/tutor/dashboard' : '/student/dashboard';
}
