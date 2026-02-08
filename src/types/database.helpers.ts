/**
 * Helper types for working with Supabase database types
 */

import type { Database } from './database.types';

// Table row types
export type Tables<T extends keyof Database['public']['Tables']> = 
  Database['public']['Tables'][T]['Row'];

export type Inserts<T extends keyof Database['public']['Tables']> = 
  Database['public']['Tables'][T]['Insert'];

export type Updates<T extends keyof Database['public']['Tables']> = 
  Database['public']['Tables'][T]['Update'];

// Enum types
export type Enums<T extends keyof Database['public']['Enums']> = 
  Database['public']['Enums'][T];

// Specific table types (for convenience)
export type Game = Tables<'Game'>;
export type GameInsert = Inserts<'Game'>;
export type GameUpdate = Updates<'Game'>;

export type Group = Tables<'Group'>;
export type GroupInsert = Inserts<'Group'>;
export type GroupUpdate = Updates<'Group'>;

export type Student = Tables<'Student'>;
export type StudentInsert = Inserts<'Student'>;
export type StudentUpdate = Updates<'Student'>;

export type Tutor = Tables<'Tutor'>;
export type TutorInsert = Inserts<'Tutor'>;
export type TutorUpdate = Updates<'Tutor'>;

export type GameAttempt = Tables<'GameAttempt'>;
export type GameAttemptInsert = Inserts<'GameAttempt'>;
export type GameAttemptUpdate = Updates<'GameAttempt'>;

export type Assignment = Tables<'Assignment'>;
export type AssignmentInsert = Inserts<'Assignment'>;
export type AssignmentUpdate = Updates<'Assignment'>;

export type GroupMember = Tables<'GroupMember'>;
export type GroupMemberInsert = Inserts<'GroupMember'>;
export type GroupMemberUpdate = Updates<'GroupMember'>;

// Enum types
export type Role = Enums<'Role'>;
export type GameType = Enums<'GameType'>;
export type SubscriptionStatus = Enums<'SubscriptionStatus'>;
