export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      announcements: {
        Row: {
          content: string
          created_at: string | null
          created_by: string
          group_id: string | null
          id: string
          priority: Database["public"]["Enums"]["announcement_priority"]
          title: string
        }
        Insert: {
          content: string
          created_at?: string | null
          created_by: string
          group_id?: string | null
          id?: string
          priority?: Database["public"]["Enums"]["announcement_priority"]
          title: string
        }
        Update: {
          content?: string
          created_at?: string | null
          created_by?: string
          group_id?: string | null
          id?: string
          priority?: Database["public"]["Enums"]["announcement_priority"]
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "announcements_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "announcements_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
        ]
      }
      group_members: {
        Row: {
          group_id: string
          user_id: string
        }
        Insert: {
          group_id: string
          user_id: string
        }
        Update: {
          group_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "group_members_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      groups: {
        Row: {
          created_at: string | null
          grade: Database["public"]["Enums"]["grade"]
          id: string
          letter: Database["public"]["Enums"]["letter"]
          name: string
          shift: Database["public"]["Enums"]["shift"]
          specialty: Database["public"]["Enums"]["specialty"]
          teacher_id: string | null
        }
        Insert: {
          created_at?: string | null
          grade: Database["public"]["Enums"]["grade"]
          id?: string
          letter: Database["public"]["Enums"]["letter"]
          name: string
          shift: Database["public"]["Enums"]["shift"]
          specialty: Database["public"]["Enums"]["specialty"]
          teacher_id?: string | null
        }
        Update: {
          created_at?: string | null
          grade?: Database["public"]["Enums"]["grade"]
          id?: string
          letter?: Database["public"]["Enums"]["letter"]
          name?: string
          shift?: Database["public"]["Enums"]["shift"]
          specialty?: Database["public"]["Enums"]["specialty"]
          teacher_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "groups_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string | null
          id: string
          name: string | null
          role: Database["public"]["Enums"]["app_role"]
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          id: string
          name?: string | null
          role: Database["public"]["Enums"]["app_role"]
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          name?: string | null
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string | null
        }
        Relationships: []
      }
      task_assignees: {
        Row: {
          task_id: string
          user_id: string
        }
        Insert: {
          task_id: string
          user_id: string
        }
        Update: {
          task_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "task_assignees_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "task_assignees_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      task_submissions: {
        Row: {
          attachments: Json | null
          content: string | null
          created_at: string | null
          id: string
          score_details: Json | null
          student_id: string
          submission_hash: string | null
          submitted_at: string
          task_id: string
          teacher_feedback: string | null
          team_id: string | null
          total_score: number | null
        }
        Insert: {
          attachments?: Json | null
          content?: string | null
          created_at?: string | null
          id?: string
          score_details?: Json | null
          student_id: string
          submission_hash?: string | null
          submitted_at?: string
          task_id: string
          teacher_feedback?: string | null
          team_id?: string | null
          total_score?: number | null
        }
        Update: {
          attachments?: Json | null
          content?: string | null
          created_at?: string | null
          id?: string
          score_details?: Json | null
          student_id?: string
          submission_hash?: string | null
          submitted_at?: string
          task_id?: string
          teacher_feedback?: string | null
          team_id?: string | null
          total_score?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "task_submissions_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "task_submissions_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "task_submissions_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          allow_late_submissions: boolean
          created_at: string | null
          created_by: string
          description: string | null
          due_date: string | null
          group_id: string
          id: string
          max_score: number | null
          rubric: string | null
          rubric_structured: Json | null
          status: Database["public"]["Enums"]["task_status"]
          title: string
          type: Database["public"]["Enums"]["task_type"]
        }
        Insert: {
          allow_late_submissions?: boolean
          created_at?: string | null
          created_by: string
          description?: string | null
          due_date?: string | null
          group_id: string
          id?: string
          max_score?: number | null
          rubric?: string | null
          rubric_structured?: Json | null
          status?: Database["public"]["Enums"]["task_status"]
          title: string
          type: Database["public"]["Enums"]["task_type"]
        }
        Update: {
          allow_late_submissions?: boolean
          created_at?: string | null
          created_by?: string
          description?: string | null
          due_date?: string | null
          group_id?: string
          id?: string
          max_score?: number | null
          rubric?: string | null
          rubric_structured?: Json | null
          status?: Database["public"]["Enums"]["task_status"]
          title?: string
          type?: Database["public"]["Enums"]["task_type"]
        }
        Relationships: [
          {
            foreignKeyName: "tasks_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
        ]
      }
      team_members: {
        Row: {
          team_id: string
          user_id: string
        }
        Insert: {
          team_id: string
          user_id: string
        }
        Update: {
          team_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_members_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      teams: {
        Row: {
          color: string | null
          created_at: string | null
          group_id: string
          id: string
          name: string
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          group_id: string
          id?: string
          name: string
        }
        Update: {
          color?: string | null
          created_at?: string | null
          group_id?: string
          id?: string
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "teams_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_role: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["app_role"]
      }
      is_group_member: {
        Args: { _group_id: string; _user_id: string }
        Returns: boolean
      }
      is_group_teacher: {
        Args: { _group_id: string; _user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      announcement_priority: "low" | "medium" | "high"
      app_role: "student" | "teacher" | "tutor" | "parent"
      grade: "1o" | "2o" | "3o" | "4o" | "5o" | "6o"
      letter: "A" | "B" | "C" | "D" | "E"
      shift: "Matutino" | "Vespertino"
      specialty:
        | "Servicios de Hospedaje"
        | "Programación"
        | "Contabilidad"
        | "Construcción"
      task_status:
        | "pending"
        | "in-progress"
        | "completed"
        | "submitted"
        | "graded"
        | "plagiarized"
      task_type: "collective" | "group" | "individual"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      announcement_priority: ["low", "medium", "high"],
      app_role: ["student", "teacher", "tutor", "parent"],
      grade: ["1o", "2o", "3o", "4o", "5o", "6o"],
      letter: ["A", "B", "C", "D", "E"],
      shift: ["Matutino", "Vespertino"],
      specialty: [
        "Servicios de Hospedaje",
        "Programación",
        "Contabilidad",
        "Construcción",
      ],
      task_status: [
        "pending",
        "in-progress",
        "completed",
        "submitted",
        "graded",
        "plagiarized",
      ],
      task_type: ["collective", "group", "individual"],
    },
  },
} as const
