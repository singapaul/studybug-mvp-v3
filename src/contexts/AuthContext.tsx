import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Role, UserSession, AuthContextType, SubscriptionStatus } from '@/types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hardcoded mock users aligned with seed data
const DEV_TUTOR_SESSION: UserSession = {
  user: {
    id: 'tutor-dev-1',
    email: 'tutor@dev.local',
    role: Role.TUTOR,
    firstName: 'Alex',
    lastName: 'Thompson',
    emailVerified: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  tutor: {
    id: 'tutor-profile-1',
    userId: 'tutor-dev-1',
    subscriptionStatus: SubscriptionStatus.ACTIVE,
    trialEndsAt: null,
    subscriptionPeriodEnd: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
};

const DEV_STUDENT_SESSION: UserSession = {
  user: {
    id: 'student-dev-1',
    email: 'student@dev.local',
    role: Role.STUDENT,
    firstName: 'Emma',
    lastName: 'Wilson',
    emailVerified: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  student: {
    id: 'student-profile-1',
    userId: 'student-dev-1',
    subscriptionStatus: SubscriptionStatus.ACTIVE,
    trialEndsAt: null,
    subscriptionPeriodEnd: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
};

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [session, setSession] = useState<UserSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore session from localStorage on mount
  useEffect(() => {
    const savedRole = localStorage.getItem('dev_role');
    if (savedRole === Role.TUTOR) {
      setSession(DEV_TUTOR_SESSION);
    } else if (savedRole === Role.STUDENT) {
      setSession(DEV_STUDENT_SESSION);
    }
    setIsLoading(false);
  }, []);

  const login = (role: Role) => {
    const newSession = role === Role.TUTOR ? DEV_TUTOR_SESSION : DEV_STUDENT_SESSION;
    setSession(newSession);
    localStorage.setItem('dev_role', role);
  };

  const logout = async () => {
    setSession(null);
    localStorage.removeItem('dev_role');
  };

  const switchRole = (role: Role) => {
    login(role);
  };

  // signIn: map email to mock role
  const signIn = async (email: string, _password: string) => {
    if (email.includes('tutor') || email === 'tutor@dev.local') {
      login(Role.TUTOR);
    } else {
      login(Role.STUDENT);
    }
  };

  // signUp: creates a mock session
  const signUp = async (_email: string, _password: string, role: Role) => {
    login(role);
  };

  // setUserRole: updates the current user's role
  const setUserRole = async (role: Role) => {
    login(role);
  };

  const value: AuthContextType = {
    session,
    isAuthenticated: session !== null,
    isTutor: session?.user.role === Role.TUTOR,
    isStudent: session?.user.role === Role.STUDENT,
    isLoading,
    login,
    logout,
    switchRole,
    signIn,
    signUp,
    setUserRole,
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
