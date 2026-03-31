import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Role, UserSession, AuthContextType, SubscriptionStatus } from '@/types/auth';
import * as supabaseAuth from '@/lib/supabase-auth';
import { supabase } from '@/lib/supabase';
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
    firstName: 'Dev',
    lastName: 'Tutor',
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
    firstName: 'Dev',
    lastName: 'Student',
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

// Async: builds a full UserSession by fetching the Tutor or Student row from DB
async function buildUserSession(supabaseSession: SupabaseSession | null): Promise<UserSession | null> {
  if (!supabaseSession?.user) return null;

  const { user } = supabaseSession;
  const role = (user.user_metadata?.role as Role) || Role.STUDENT;

  const userSession: UserSession = {
    user: {
      id: user.id,
      email: user.email || '',
      role,
      firstName: user.user_metadata?.first_name ?? null,
      lastName: user.user_metadata?.last_name ?? null,
      emailVerified: !!user.email_confirmed_at,
      createdAt: new Date(user.created_at),
      updatedAt: new Date(user.updated_at || user.created_at),
    },
  };

  if (role === Role.TUTOR) {
    const { data } = await supabase
      .from('Tutor')
      .select('id, subscriptionStatus, trialEndsAt, subscriptionPeriodEnd, createdAt, updatedAt')
      .eq('userId', user.id)
      .single();

    userSession.tutor = {
      id: data?.id ?? user.id,
      userId: user.id,
      subscriptionStatus: (data?.subscriptionStatus as SubscriptionStatus) ?? SubscriptionStatus.FREE,
      trialEndsAt: data?.trialEndsAt ? new Date(data.trialEndsAt) : null,
      subscriptionPeriodEnd: data?.subscriptionPeriodEnd ? new Date(data.subscriptionPeriodEnd) : null,
      createdAt: data?.createdAt ? new Date(data.createdAt) : new Date(user.created_at),
      updatedAt: data?.updatedAt ? new Date(data.updatedAt) : new Date(user.updated_at || user.created_at),
    };
  } else {
    const { data } = await supabase
      .from('Student')
      .select('id, subscriptionStatus, trialEndsAt, subscriptionPeriodEnd, createdAt, updatedAt')
      .eq('userId', user.id)
      .single();

    userSession.student = {
      id: data?.id ?? user.id,
      userId: user.id,
      subscriptionStatus: (data?.subscriptionStatus as SubscriptionStatus) ?? SubscriptionStatus.FREE,
      trialEndsAt: data?.trialEndsAt ? new Date(data.trialEndsAt) : null,
      subscriptionPeriodEnd: data?.subscriptionPeriodEnd ? new Date(data.subscriptionPeriodEnd) : null,
      createdAt: data?.createdAt ? new Date(data.createdAt) : new Date(user.created_at),
      updatedAt: data?.updatedAt ? new Date(data.updatedAt) : new Date(user.updated_at || user.created_at),
    };
  }

  return userSession;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [session, setSession] = useState<UserSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize session and listen to auth changes
  useEffect(() => {
    if (MOCK_USER_MODE) {
      const savedRole = localStorage.getItem('dev_role');
      if (savedRole === Role.TUTOR) {
        setSession(DEV_TUTOR_SESSION);
      } else if (savedRole === Role.STUDENT) {
        setSession(DEV_STUDENT_SESSION);
      }
      setIsLoading(false);
    } else {
      supabaseAuth.getSession().then(async (supabaseSession) => {
        setSession(await buildUserSession(supabaseSession));
        setIsLoading(false);
      });

      const {
        data: { subscription },
      } = supabaseAuth.onAuthStateChange(async (event, supabaseSession) => {
        console.log('Auth state changed:', event);
        setSession(await buildUserSession(supabaseSession));
        setIsLoading(false);
      });

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
    setSession(await buildUserSession(supabaseSession));
  };

  // Real sign up (delegates to supabase-auth; profile row created by DB trigger)
  const signUp = async (email: string, password: string, role: Role) => {
    const { session: supabaseSession } = await supabaseAuth.signUp({ email, password, role });
    setSession(await buildUserSession(supabaseSession));
  };

  // Set user role (for users who signed up but haven't chosen a role yet)
  const setUserRole = async (role: Role) => {
    await supabaseAuth.updateUserMetadata({ role });
    const supabaseSession = await supabaseAuth.getSession();
    setSession(await buildUserSession(supabaseSession));
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
