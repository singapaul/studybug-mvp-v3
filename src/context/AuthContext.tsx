import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserRole } from '@/types/app';

interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (name: string, email: string, password: string, role: UserRole) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = 'studybug_user';

// Demo credentials
const DEMO_ACCOUNTS = [
  { email: 'demo@studybug.io', password: 'demo123', name: 'Demo Tutor', role: 'tutor' as UserRole, id: 'tutor-demo' },
  { email: 'student@studybug.io', password: 'demo123', name: 'Alex Demo', role: 'student' as UserRole, id: 'student-demo' },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setUser(parsed);
      } catch (e) {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Check demo credentials
    const demoAccount = DEMO_ACCOUNTS.find(
      acc => acc.email.toLowerCase() === email.toLowerCase() && acc.password === password
    );

    if (demoAccount) {
      const authUser: AuthUser = {
        id: demoAccount.id,
        email: demoAccount.email,
        name: demoAccount.name,
        role: demoAccount.role,
      };
      setUser(authUser);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(authUser));
      return { success: true };
    }

    // Check for demo signup accounts in localStorage
    const signupAccounts = localStorage.getItem('studybug_signup_accounts');
    if (signupAccounts) {
      try {
        const accounts = JSON.parse(signupAccounts);
        const account = accounts.find(
          (acc: { email: string; password: string }) => 
            acc.email.toLowerCase() === email.toLowerCase() && acc.password === password
        );
        if (account) {
          const authUser: AuthUser = {
            id: account.id,
            email: account.email,
            name: account.name,
            role: account.role,
          };
          setUser(authUser);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(authUser));
          return { success: true };
        }
      } catch (e) {
        // Ignore parse errors
      }
    }

    return { success: false, error: 'Invalid email or password. Try demo@studybug.io / demo123' };
  };

  const signup = async (
    name: string, 
    email: string, 
    password: string, 
    role: UserRole
  ): Promise<{ success: boolean; error?: string }> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Check if email already exists
    const existing = DEMO_ACCOUNTS.find(acc => acc.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      return { success: false, error: 'This email is already registered' };
    }

    // Create new account (stored in localStorage for demo)
    const newUser: AuthUser = {
      id: `user-${Date.now()}`,
      email,
      name,
      role,
    };

    // Store in signup accounts for future logins
    const signupAccounts = localStorage.getItem('studybug_signup_accounts');
    const accounts = signupAccounts ? JSON.parse(signupAccounts) : [];
    accounts.push({ ...newUser, password });
    localStorage.setItem('studybug_signup_accounts', JSON.stringify(accounts));

    // Log in the new user
    setUser(newUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));

    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      signup,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
