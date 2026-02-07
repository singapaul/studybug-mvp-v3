import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Role, UserSession, AuthContextType, SubscriptionStatus } from '@/types/auth';
import * as supabaseAuth from '@/lib/supabase-auth';
import type { Session as SupabaseSession } from '@supabase/supabase-js';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Feature flag to use mock users instead of real authentication
const MOCK_USER_MODE = import.meta.env.VITE_MOCK_USER_MODE === 'true';

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
    subscriptionStatus: SubscriptionStatus.FREE,
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
  const [isLoading, setIsLoading] = useState(true);

  // Convert Supabase session to UserSession
  const convertSupabaseSession = (supabaseSession: SupabaseSession | null): UserSession | null => {
    if (!supabaseSession?.user) return null;

    const role = (supabaseSession.user.user_metadata?.role as Role) || Role.STUDENT;

    const userSession: UserSession = {
      user: {
        id: supabaseSession.user.id,
        email: supabaseSession.user.email || '',
        role,
        emailVerified: !!supabaseSession.user.email_confirmed_at,
        createdAt: new Date(supabaseSession.user.created_at),
        updatedAt: new Date(supabaseSession.user.updated_at || supabaseSession.user.created_at),
      },
    };

    // Add role-specific profile data
    if (role === Role.TUTOR) {
      userSession.tutor = {
        id: `tutor-${supabaseSession.user.id}`,
        userId: supabaseSession.user.id,
        subscriptionStatus: SubscriptionStatus.FREE,
        createdAt: new Date(supabaseSession.user.created_at),
        updatedAt: new Date(supabaseSession.user.updated_at || supabaseSession.user.created_at),
      };
    } else {
      userSession.student = {
        id: `student-${supabaseSession.user.id}`,
        userId: supabaseSession.user.id,
        createdAt: new Date(supabaseSession.user.created_at),
        updatedAt: new Date(supabaseSession.user.updated_at || supabaseSession.user.created_at),
      };
    }

    return userSession;
  };

  // Initialize session and listen to auth changes
  useEffect(() => {
    if (MOCK_USER_MODE) {
      // Mock mode: Load session from localStorage
      const savedRole = localStorage.getItem('dev_role');
      if (savedRole === Role.TUTOR) {
        setSession(DEV_TUTOR_SESSION);
      } else if (savedRole === Role.STUDENT) {
        setSession(DEV_STUDENT_SESSION);
      }
      setIsLoading(false);
    } else {
      // Real auth: Get initial session
      supabaseAuth.getSession().then((supabaseSession) => {
        setSession(convertSupabaseSession(supabaseSession));
        setIsLoading(false);
      });

      // Listen for auth changes
      const { data: { subscription } } = supabaseAuth.onAuthStateChange(
        (event, supabaseSession) => {
          console.log('Auth state changed:', event);
          setSession(convertSupabaseSession(supabaseSession));
          setIsLoading(false);
        }
      );

      return () => {
        subscription.unsubscribe();
      };
    }
  }, []);

  // Mock mode login
  const login = (role: Role) => {
    if (MOCK_USER_MODE) {
      const newSession = role === Role.TUTOR ? DEV_TUTOR_SESSION : DEV_STUDENT_SESSION;
      setSession(newSession);
      localStorage.setItem('dev_role', role);
    }
  };

  // Logout (works for both mock and real)
  const logout = async () => {
    if (MOCK_USER_MODE) {
      setSession(null);
      localStorage.removeItem('dev_role');
    } else {
      await supabaseAuth.signOut();
      setSession(null);
    }
  };

  // Mock mode switch role
  const switchRole = (role: Role) => {
    if (MOCK_USER_MODE) {
      login(role);
    }
  };

  // Real sign in
  const signIn = async (email: string, password: string) => {
    const { session: supabaseSession } = await supabaseAuth.signIn({ email, password });
    setSession(convertSupabaseSession(supabaseSession));
  };

  // Real sign up
  const signUp = async (email: string, password: string, role: Role) => {
    const { session: supabaseSession } = await supabaseAuth.signUp({ email, password, role });
    setSession(convertSupabaseSession(supabaseSession));
  };

  // Set user role (for users who signed up but haven't chosen a role yet)
  const setUserRole = async (role: Role) => {
    await supabaseAuth.updateUserMetadata({ role });
    const supabaseSession = await supabaseAuth.getSession();
    setSession(convertSupabaseSession(supabaseSession));
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
