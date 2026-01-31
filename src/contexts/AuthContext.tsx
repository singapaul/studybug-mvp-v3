import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Role, UserSession, AuthContextType } from '@/types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hardcoded dev users - replace with real auth later
const DEV_TUTOR_SESSION: UserSession = {
  user: {
    id: 'tutor-dev-1',
    email: 'tutor@dev.local',
    role: Role.TUTOR,
    emailVerified: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  tutor: {
    id: 'tutor-profile-1',
    userId: 'tutor-dev-1',
    subscriptionStatus: 'FREE' as const,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
};

const DEV_STUDENT_SESSION: UserSession = {
  user: {
    id: 'student-dev-1',
    email: 'student@dev.local',
    role: Role.STUDENT,
    emailVerified: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  student: {
    id: 'student-profile-1',
    userId: 'student-dev-1',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
};

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [session, setSession] = useState<UserSession | null>(null);

  // Load session from localStorage on mount
  useEffect(() => {
    const savedRole = localStorage.getItem('dev_role');
    if (savedRole === Role.TUTOR) {
      setSession(DEV_TUTOR_SESSION);
    } else if (savedRole === Role.STUDENT) {
      setSession(DEV_STUDENT_SESSION);
    }
  }, []);

  const login = (role: Role) => {
    const newSession = role === Role.TUTOR ? DEV_TUTOR_SESSION : DEV_STUDENT_SESSION;
    setSession(newSession);
    localStorage.setItem('dev_role', role);
  };

  const logout = () => {
    setSession(null);
    localStorage.removeItem('dev_role');
  };

  const switchRole = (role: Role) => {
    login(role);
  };

  const value: AuthContextType = {
    session,
    isAuthenticated: session !== null,
    isTutor: session?.user.role === Role.TUTOR,
    isStudent: session?.user.role === Role.STUDENT,
    login,
    logout,
    switchRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
