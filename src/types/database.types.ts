export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      Assignment: {
        Row: {
          createdAt: string
          dueDate: string | null
          gameId: string
          groupId: string
          id: string
          passPercentage: number | null
          updatedAt: string
        }
        Insert: {
          createdAt?: string
          dueDate?: string | null
          gameId: string
          groupId: string
          id?: string
          passPercentage?: number | null
          updatedAt?: string
        }
        Update: {
          createdAt?: string
          dueDate?: string | null
          gameId?: string
          groupId?: string
          id?: string
          passPercentage?: number | null
          updatedAt?: string
        }
        Relationships: [
          {
            foreignKeyName: "Assignment_gameId_fkey"
            columns: ["gameId"]
            isOneToOne: false
            referencedRelation: "Game"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Assignment_groupId_fkey"
            columns: ["groupId"]
            isOneToOne: false
            referencedRelation: "Group"
            referencedColumns: ["id"]
          },
        ]
      }
      Game: {
        Row: {
          createdAt: string
          gameData: string
          gameType: Database["public"]["Enums"]["GameType"]
          id: string
          name: string
          updatedAt: string
          userId: string
        }
        Insert: {
          createdAt?: string
          gameData: string
          gameType: Database["public"]["Enums"]["GameType"]
          id?: string
          name: string
          updatedAt?: string
          userId: string
        }
        Update: {
          createdAt?: string
          gameData?: string
          gameType?: Database["public"]["Enums"]["GameType"]
          id?: string
          name?: string
          updatedAt?: string
          userId?: string
        }
        Relationships: []
      }
      GameAttempt: {
        Row: {
          assignmentId: string
          attemptData: string
          completedAt: string
          id: string
          scorePercentage: number
          studentId: string
          timeTaken: number
        }
        Insert: {
          assignmentId: string
          attemptData: string
          completedAt?: string
          id?: string
          scorePercentage: number
          studentId: string
          timeTaken: number
        }
        Update: {
          assignmentId?: string
          attemptData?: string
          completedAt?: string
          id?: string
          scorePercentage?: number
          studentId?: string
          timeTaken?: number
        }
        Relationships: [
          {
            foreignKeyName: "GameAttempt_assignmentId_fkey"
            columns: ["assignmentId"]
            isOneToOne: false
            referencedRelation: "Assignment"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "GameAttempt_studentId_fkey"
            columns: ["studentId"]
            isOneToOne: false
            referencedRelation: "Student"
            referencedColumns: ["id"]
          },
        ]
      }
      Group: {
        Row: {
          ageRange: string | null
          createdAt: string
          id: string
          joinCode: string
          name: string
          subjectArea: string | null
          tutorId: string
          updatedAt: string
        }
        Insert: {
          ageRange?: string | null
          createdAt?: string
          id?: string
          joinCode: string
          name: string
          subjectArea?: string | null
          tutorId: string
          updatedAt?: string
        }
        Update: {
          ageRange?: string | null
          createdAt?: string
          id?: string
          joinCode?: string
          name?: string
          subjectArea?: string | null
          tutorId?: string
          updatedAt?: string
        }
        Relationships: [
          {
            foreignKeyName: "Group_tutorId_fkey"
            columns: ["tutorId"]
            isOneToOne: false
            referencedRelation: "Tutor"
            referencedColumns: ["id"]
          },
        ]
      }
      GroupMember: {
        Row: {
          groupId: string
          id: string
          joinedAt: string
          studentId: string
        }
        Insert: {
          groupId: string
          id?: string
          joinedAt?: string
          studentId: string
        }
        Update: {
          groupId?: string
          id?: string
          joinedAt?: string
          studentId?: string
        }
        Relationships: [
          {
            foreignKeyName: "GroupMember_groupId_fkey"
            columns: ["groupId"]
            isOneToOne: false
            referencedRelation: "Group"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "GroupMember_studentId_fkey"
            columns: ["studentId"]
            isOneToOne: false
            referencedRelation: "Student"
            referencedColumns: ["id"]
          },
        ]
      }
      Student: {
        Row: {
          createdAt: string
          id: string
          updatedAt: string
          userId: string
        }
        Insert: {
          createdAt?: string
          id?: string
          updatedAt?: string
          userId: string
        }
        Update: {
          createdAt?: string
          id?: string
          updatedAt?: string
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "Student_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "User"
            referencedColumns: ["id"]
          },
        ]
      }
      Tutor: {
        Row: {
          createdAt: string
          id: string
          subscriptionStatus: Database["public"]["Enums"]["SubscriptionStatus"]
          updatedAt: string
          userId: string
        }
        Insert: {
          createdAt?: string
          id?: string
          subscriptionStatus?: Database["public"]["Enums"]["SubscriptionStatus"]
          updatedAt?: string
          userId: string
        }
        Update: {
          createdAt?: string
          id?: string
          subscriptionStatus?: Database["public"]["Enums"]["SubscriptionStatus"]
          updatedAt?: string
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "Tutor_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "User"
            referencedColumns: ["id"]
          },
        ]
      }
      User: {
        Row: {
          createdAt: string
          email: string
          emailVerified: boolean
          id: string
          passwordHash: string | null
          role: Database["public"]["Enums"]["Role"]
          updatedAt: string
        }
        Insert: {
          createdAt?: string
          email: string
          emailVerified?: boolean
          id?: string
          passwordHash?: string | null
          role: Database["public"]["Enums"]["Role"]
          updatedAt?: string
        }
        Update: {
          createdAt?: string
          email?: string
          emailVerified?: boolean
          id?: string
          passwordHash?: string | null
          role?: Database["public"]["Enums"]["Role"]
          updatedAt?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_user_profile: {
        Args: { user_email: string; user_id: string; user_role: string }
        Returns: undefined
      }
      is_my_student: { Args: { student_id: string }; Returns: boolean }
      is_my_tutor: { Args: { tutor_id: string }; Returns: boolean }
    }
    Enums: {
      GameType: "PAIRS" | "FLASHCARDS" | "MULTIPLE_CHOICE" | "SPLAT" | "SWIPE"
      Role: "TUTOR" | "STUDENT"
      SubscriptionStatus: "FREE" | "ACTIVE" | "CANCELLED" | "EXPIRED"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      GameType: ["PAIRS", "FLASHCARDS", "MULTIPLE_CHOICE", "SPLAT", "SWIPE"],
      Role: ["TUTOR", "STUDENT"],
      SubscriptionStatus: ["FREE", "ACTIVE", "CANCELLED", "EXPIRED"],
    },
  },
} as const
