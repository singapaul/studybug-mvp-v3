/**
 * Supabase Auth Helper Functions
 * Handle signup with automatic User/Tutor/Student creation
 */

import { supabase } from './supabase';
import { Role } from '@/types/auth';

/**
 * Sign up a new user
 * This will automatically create User + Tutor/Student records via database trigger
 */
export async function signUp(
  email: string,
  password: string,
  role: Role
): Promise<{ success: boolean; error?: string; userId?: string }> {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          role: role, // This gets stored in auth.users.raw_user_meta_data
        },
      },
    });

    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    if (!data.user) {
      return {
        success: false,
        error: 'User creation failed',
      };
    }

    return {
      success: true,
      userId: data.user.id,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'An unexpected error occurred',
    };
  }
}

/**
 * Sign in existing user
 */
export async function signIn(
  email: string,
  password: string
): Promise<{ success: boolean; error?: string; userId?: string; role?: Role }> {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    if (!data.user) {
      return {
        success: false,
        error: 'Sign in failed',
      };
    }

    // Get role from metadata or from User table
    const role = data.user.user_metadata?.role as Role;

    return {
      success: true,
      userId: data.user.id,
      role,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'An unexpected error occurred',
    };
  }
}

/**
 * Sign out current user
 */
export async function signOut(): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: true,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'An unexpected error occurred',
    };
  }
}

/**
 * Get current user session
 */
export async function getCurrentUser() {
  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error) {
      return null;
    }

    return user;
  } catch (error) {
    return null;
  }
}

/**
 * Get current user's role
 */
export async function getCurrentUserRole(): Promise<Role | null> {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return null;
    }

    // Try to get from metadata first
    if (user.user_metadata?.role) {
      return user.user_metadata.role as Role;
    }

    // Fallback: query User table
    const { data, error } = await supabase.from('User').select('role').eq('id', user.id).single();

    if (error || !data) {
      return null;
    }

    return data.role as Role;
  } catch (error) {
    return null;
  }
}

/**
 * Get user's profile (Tutor or Student record)
 */
export async function getUserProfile(userId: string) {
  try {
    // Get user with role
    const { data: userData, error: userError } = await supabase
      .from('User')
      .select('role')
      .eq('id', userId)
      .single();

    if (userError || !userData) {
      return null;
    }

    const role = userData.role;

    // Get role-specific profile
    if (role === 'TUTOR') {
      const { data, error } = await supabase
        .from('Tutor')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) return null;
      return { ...data, role };
    } else if (role === 'STUDENT') {
      const { data, error } = await supabase
        .from('Student')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) return null;
      return { ...data, role };
    }

    return null;
  } catch (error) {
    return null;
  }
}

/**
 * Reset password
 */
export async function resetPassword(email: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: true,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'An unexpected error occurred',
    };
  }
}

/**
 * Update password (when user is logged in)
 */
export async function updatePassword(
  newPassword: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: true,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'An unexpected error occurred',
    };
  }
}
