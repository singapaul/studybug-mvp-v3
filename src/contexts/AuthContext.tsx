import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Role, UserSession, AuthContextType, SubscriptionStatus } from '@/types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ---------------------------------------------------------------------------
// Mock session data (used when VITE_API_MODE=mock or no Clerk key is present)
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// Mock AuthProvider — used when no Clerk publishable key is configured
// ---------------------------------------------------------------------------

function MockAuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<UserSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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

  const signIn = async (email: string, _password: string) => {
    if (email.includes('tutor') || email === 'tutor@dev.local') {
      login(Role.TUTOR);
    } else {
      login(Role.STUDENT);
    }
  };

  const signUp = async (_email: string, _password: string, role: Role) => {
    login(role);
  };

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

// ---------------------------------------------------------------------------
// Clerk AuthProvider — used when VITE_CLERK_PUBLISHABLE_KEY is set
// Imported lazily to avoid errors when @clerk/clerk-react is available but
// no key is provided (hooks throw outside ClerkProvider).
// ---------------------------------------------------------------------------

function ClerkAuthProvider({ children }: { children: ReactNode }) {
  // Dynamic import of Clerk hooks — only used inside ClerkProvider tree
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { useUser, useAuth: useClerkAuth, useClerk } = require('@clerk/clerk-react');

  const { user, isLoaded: userLoaded } = useUser();
  const { isSignedIn, isLoaded: authLoaded } = useClerkAuth();
  const { signOut, openSignIn } = useClerk();

  const isLoading = !userLoaded || !authLoaded;

  const role = (user?.publicMetadata?.role as Role) ?? null;
  const isTutor = role === Role.TUTOR;
  const isStudent = role === Role.STUDENT;

  const session: UserSession | null = isSignedIn && user
    ? {
        user: {
          id: user.id,
          email: user.primaryEmailAddress?.emailAddress ?? '',
          role: role ?? Role.STUDENT,
          firstName: user.firstName,
          lastName: user.lastName,
          emailVerified: user.primaryEmailAddress?.verification?.status === 'verified',
          createdAt: new Date(user.createdAt),
          updatedAt: new Date(user.updatedAt),
        },
        tutor: isTutor
          ? {
              id: '',
              userId: user.id,
              subscriptionStatus: SubscriptionStatus.TRIALING,
              trialEndsAt: null,
              subscriptionPeriodEnd: null,
              createdAt: new Date(),
              updatedAt: new Date(),
            }
          : undefined,
        student: isStudent
          ? {
              id: '',
              userId: user.id,
              subscriptionStatus: SubscriptionStatus.TRIALING,
              trialEndsAt: null,
              subscriptionPeriodEnd: null,
              createdAt: new Date(),
              updatedAt: new Date(),
            }
          : undefined,
      }
    : null;

  // login is a mock-mode concept; in Clerk mode it is a no-op
  const login = (_role: Role) => {};

  const logout = async () => {
    await signOut();
  };

  // switchRole is not applicable in Clerk mode — roles are set at signup
  const switchRole = (_role: Role) => {};

  const signIn = async (_email: string, _password: string) => {
    openSignIn();
  };

  const signUp = async (_email: string, _password: string, _role: Role) => {
    // Signup handled by Clerk's UI components with metadata
  };

  const setUserRole = async (role: Role) => {
    await user?.update({ unsafeMetadata: { role } });
  };

  const value: AuthContextType = {
    session,
    isAuthenticated: !!isSignedIn,
    isTutor,
    isStudent,
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

// ---------------------------------------------------------------------------
// Public AuthProvider — delegates to Clerk or Mock based on env
// ---------------------------------------------------------------------------

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const hasClerkKey = Boolean(import.meta.env.VITE_CLERK_PUBLISHABLE_KEY);

  if (hasClerkKey) {
    return <ClerkAuthProvider>{children}</ClerkAuthProvider>;
  }

  return <MockAuthProvider>{children}</MockAuthProvider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
