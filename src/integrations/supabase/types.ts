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
      absent_notes: {
        Row: {
          added_by: string | null
          created_at: string
          date: string
          id: string
          note: string
          remarks: string | null
          student_id: string
        }
        Insert: {
          added_by?: string | null
          created_at?: string
          date?: string
          id?: string
          note: string
          remarks?: string | null
          student_id: string
        }
        Update: {
          added_by?: string | null
          created_at?: string
          date?: string
          id?: string
          note?: string
          remarks?: string | null
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "absent_notes_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      academic_years: {
        Row: {
          created_at: string
          end_date: string | null
          id: string
          is_current: boolean | null
          label: string
          start_date: string | null
        }
        Insert: {
          created_at?: string
          end_date?: string | null
          id?: string
          is_current?: boolean | null
          label: string
          start_date?: string | null
        }
        Update: {
          created_at?: string
          end_date?: string | null
          id?: string
          is_current?: boolean | null
          label?: string
          start_date?: string | null
        }
        Relationships: []
      }
      admission_applications: {
        Row: {
          address: string | null
          application_number: string | null
          course: string
          created_at: string
          date_of_birth: string | null
          email: string
          father_name: string | null
          full_name: string
          gender: string | null
          id: string
          mother_name: string | null
          percentage_12th: string | null
          phone: string
          photo_url: string | null
          previous_school: string | null
          review_notes: string | null
          reviewed_by: string | null
          status: string
        }
        Insert: {
          address?: string | null
          application_number?: string | null
          course: string
          created_at?: string
          date_of_birth?: string | null
          email: string
          father_name?: string | null
          full_name: string
          gender?: string | null
          id?: string
          mother_name?: string | null
          percentage_12th?: string | null
          phone: string
          photo_url?: string | null
          previous_school?: string | null
          review_notes?: string | null
          reviewed_by?: string | null
          status?: string
        }
        Update: {
          address?: string | null
          application_number?: string | null
          course?: string
          created_at?: string
          date_of_birth?: string | null
          email?: string
          father_name?: string | null
          full_name?: string
          gender?: string | null
          id?: string
          mother_name?: string | null
          percentage_12th?: string | null
          phone?: string
          photo_url?: string | null
          previous_school?: string | null
          review_notes?: string | null
          reviewed_by?: string | null
          status?: string
        }
        Relationships: []
      }
      announcements: {
        Row: {
          content: string
          course_id: string | null
          created_at: string
          id: string
          is_active: boolean | null
          posted_by: string | null
          semester: number | null
          title: string
        }
        Insert: {
          content?: string
          course_id?: string | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          posted_by?: string | null
          semester?: number | null
          title: string
        }
        Update: {
          content?: string
          course_id?: string | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          posted_by?: string | null
          semester?: number | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "announcements_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      attendance: {
        Row: {
          course_id: string | null
          created_at: string
          date: string
          id: string
          marked_by: string | null
          status: string
          student_id: string
          subject: string
          year_level: number | null
        }
        Insert: {
          course_id?: string | null
          created_at?: string
          date?: string
          id?: string
          marked_by?: string | null
          status?: string
          student_id: string
          subject: string
          year_level?: number | null
        }
        Update: {
          course_id?: string | null
          created_at?: string
          date?: string
          id?: string
          marked_by?: string | null
          status?: string
          student_id?: string
          subject?: string
          year_level?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "attendance_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      birthday_settings: {
        Row: {
          id: string
          principal_name: string
          quote: string
          updated_at: string
          updated_by: string | null
          wishes_message: string
        }
        Insert: {
          id?: string
          principal_name?: string
          quote?: string
          updated_at?: string
          updated_by?: string | null
          wishes_message?: string
        }
        Update: {
          id?: string
          principal_name?: string
          quote?: string
          updated_at?: string
          updated_by?: string | null
          wishes_message?: string
        }
        Relationships: []
      }
      contact_submissions: {
        Row: {
          created_at: string
          email: string
          id: string
          message: string
          name: string
          status: string
          subject: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          message?: string
          name: string
          status?: string
          subject?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          status?: string
          subject?: string
        }
        Relationships: []
      }
      courses: {
        Row: {
          code: string
          created_at: string
          department_id: string | null
          duration: string | null
          eligibility: string | null
          fee: string | null
          id: string
          is_active: boolean | null
          name: string
          overview: string | null
        }
        Insert: {
          code: string
          created_at?: string
          department_id?: string | null
          duration?: string | null
          eligibility?: string | null
          fee?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          overview?: string | null
        }
        Update: {
          code?: string
          created_at?: string
          department_id?: string | null
          duration?: string | null
          eligibility?: string | null
          fee?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          overview?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "courses_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
        ]
      }
      departments: {
        Row: {
          code: string
          created_at: string
          description: string | null
          hod_name: string | null
          id: string
          is_active: boolean | null
          name: string
        }
        Insert: {
          code: string
          created_at?: string
          description?: string | null
          hod_name?: string | null
          id?: string
          is_active?: boolean | null
          name: string
        }
        Update: {
          code?: string
          created_at?: string
          description?: string | null
          hod_name?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
        }
        Relationships: []
      }
      events: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          event_date: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          posted_by: string | null
          title: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          event_date?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          posted_by?: string | null
          title: string
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          event_date?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          posted_by?: string | null
          title?: string
        }
        Relationships: []
      }
      faculty_members: {
        Row: {
          created_at: string | null
          department: string
          email: string | null
          experience: string
          id: string
          is_active: boolean | null
          name: string
          phone: string | null
          photo_url: string | null
          posted_by: string | null
          qualification: string
          role: string
          sort_order: number | null
          subjects: string[] | null
        }
        Insert: {
          created_at?: string | null
          department?: string
          email?: string | null
          experience?: string
          id?: string
          is_active?: boolean | null
          name: string
          phone?: string | null
          photo_url?: string | null
          posted_by?: string | null
          qualification?: string
          role?: string
          sort_order?: number | null
          subjects?: string[] | null
        }
        Update: {
          created_at?: string | null
          department?: string
          email?: string | null
          experience?: string
          id?: string
          is_active?: boolean | null
          name?: string
          phone?: string | null
          photo_url?: string | null
          posted_by?: string | null
          qualification?: string
          role?: string
          sort_order?: number | null
          subjects?: string[] | null
        }
        Relationships: []
      }
      fee_payments: {
        Row: {
          amount: number
          created_at: string
          id: string
          payment_date: string
          payment_method: string | null
          receipt_number: string | null
          recorded_by: string | null
          remarks: string | null
          semester: number | null
          student_id: string | null
        }
        Insert: {
          amount?: number
          created_at?: string
          id?: string
          payment_date?: string
          payment_method?: string | null
          receipt_number?: string | null
          recorded_by?: string | null
          remarks?: string | null
          semester?: number | null
          student_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          payment_date?: string
          payment_method?: string | null
          receipt_number?: string | null
          recorded_by?: string | null
          remarks?: string | null
          semester?: number | null
          student_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fee_payments_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      gallery_images: {
        Row: {
          category: string
          created_at: string
          description: string | null
          id: string
          image_url: string
          is_active: boolean | null
          posted_by: string | null
          sort_order: number | null
          title: string
        }
        Insert: {
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          image_url: string
          is_active?: boolean | null
          posted_by?: string | null
          sort_order?: number | null
          title: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string
          is_active?: boolean | null
          posted_by?: string | null
          sort_order?: number | null
          title?: string
        }
        Relationships: []
      }
      marks: {
        Row: {
          course_id: string | null
          created_at: string
          exam_type: string
          id: string
          max_marks: number
          obtained_marks: number
          semester: number | null
          student_id: string
          subject: string
          uploaded_by: string | null
          year_level: number | null
        }
        Insert: {
          course_id?: string | null
          created_at?: string
          exam_type?: string
          id?: string
          max_marks?: number
          obtained_marks?: number
          semester?: number | null
          student_id: string
          subject: string
          uploaded_by?: string | null
          year_level?: number | null
        }
        Update: {
          course_id?: string | null
          created_at?: string
          exam_type?: string
          id?: string
          max_marks?: number
          obtained_marks?: number
          semester?: number | null
          student_id?: string
          subject?: string
          uploaded_by?: string | null
          year_level?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "marks_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "marks_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      notices: {
        Row: {
          content: string
          created_at: string
          id: string
          is_active: boolean | null
          is_pinned: boolean | null
          posted_by: string | null
          title: string
          type: string
        }
        Insert: {
          content?: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          is_pinned?: boolean | null
          posted_by?: string | null
          title: string
          type?: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          is_pinned?: boolean | null
          posted_by?: string | null
          title?: string
          type?: string
        }
        Relationships: []
      }
      popup_banners: {
        Row: {
          created_at: string
          id: string
          image_url: string | null
          is_active: boolean | null
          link_url: string | null
          posted_by: string | null
          title: string
        }
        Insert: {
          created_at?: string
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          link_url?: string | null
          posted_by?: string | null
          title: string
        }
        Update: {
          created_at?: string
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          link_url?: string | null
          posted_by?: string | null
          title?: string
        }
        Relationships: []
      }
      previous_year_papers: {
        Row: {
          course: string
          created_at: string
          file_url: string | null
          id: string
          is_active: boolean | null
          posted_by: string | null
          semester: number | null
          subject: string
          title: string
          year: string
        }
        Insert: {
          course: string
          created_at?: string
          file_url?: string | null
          id?: string
          is_active?: boolean | null
          posted_by?: string | null
          semester?: number | null
          subject: string
          title: string
          year: string
        }
        Update: {
          course?: string
          created_at?: string
          file_url?: string | null
          id?: string
          is_active?: boolean | null
          posted_by?: string | null
          semester?: number | null
          subject?: string
          title?: string
          year?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          full_name: string
          id: string
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          phone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      students: {
        Row: {
          academic_year_id: string | null
          address: string | null
          admission_year: number | null
          avatar_url: string | null
          course_id: string | null
          created_at: string
          date_of_birth: string | null
          father_name: string | null
          fee_due_date: string | null
          fee_paid: number | null
          fee_remarks: string | null
          id: string
          is_active: boolean | null
          mother_name: string | null
          parent_phone: string | null
          phone: string | null
          roll_number: string
          semester: number | null
          total_fee: number | null
          user_id: string
          year_level: number | null
        }
        Insert: {
          academic_year_id?: string | null
          address?: string | null
          admission_year?: number | null
          avatar_url?: string | null
          course_id?: string | null
          created_at?: string
          date_of_birth?: string | null
          father_name?: string | null
          fee_due_date?: string | null
          fee_paid?: number | null
          fee_remarks?: string | null
          id?: string
          is_active?: boolean | null
          mother_name?: string | null
          parent_phone?: string | null
          phone?: string | null
          roll_number: string
          semester?: number | null
          total_fee?: number | null
          user_id: string
          year_level?: number | null
        }
        Update: {
          academic_year_id?: string | null
          address?: string | null
          admission_year?: number | null
          avatar_url?: string | null
          course_id?: string | null
          created_at?: string
          date_of_birth?: string | null
          father_name?: string | null
          fee_due_date?: string | null
          fee_paid?: number | null
          fee_remarks?: string | null
          id?: string
          is_active?: boolean | null
          mother_name?: string | null
          parent_phone?: string | null
          phone?: string | null
          roll_number?: string
          semester?: number | null
          total_fee?: number | null
          user_id?: string
          year_level?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "students_academic_year_id_fkey"
            columns: ["academic_year_id"]
            isOneToOne: false
            referencedRelation: "academic_years"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "students_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      study_materials: {
        Row: {
          course_id: string | null
          created_at: string
          file_url: string | null
          id: string
          semester: number | null
          subject: string
          title: string
          uploaded_by: string | null
        }
        Insert: {
          course_id?: string | null
          created_at?: string
          file_url?: string | null
          id?: string
          semester?: number | null
          subject: string
          title: string
          uploaded_by?: string | null
        }
        Update: {
          course_id?: string | null
          created_at?: string
          file_url?: string | null
          id?: string
          semester?: number | null
          subject?: string
          title?: string
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "study_materials_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      teachers: {
        Row: {
          created_at: string
          department_id: string | null
          employee_id: string
          experience: string | null
          id: string
          is_active: boolean | null
          qualification: string | null
          subjects: string[] | null
          user_id: string
        }
        Insert: {
          created_at?: string
          department_id?: string | null
          employee_id: string
          experience?: string | null
          id?: string
          is_active?: boolean | null
          qualification?: string | null
          subjects?: string[] | null
          user_id: string
        }
        Update: {
          created_at?: string
          department_id?: string | null
          employee_id?: string
          experience?: string | null
          id?: string
          is_active?: boolean | null
          qualification?: string | null
          subjects?: string[] | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "teachers_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
        ]
      }
      timetables: {
        Row: {
          course_id: string | null
          created_at: string
          day_of_week: string
          id: string
          period: string
          room: string | null
          semester: number | null
          subject: string
          teacher_name: string | null
          title: string
          uploaded_by: string | null
        }
        Insert: {
          course_id?: string | null
          created_at?: string
          day_of_week: string
          id?: string
          period: string
          room?: string | null
          semester?: number | null
          subject: string
          teacher_name?: string | null
          title: string
          uploaded_by?: string | null
        }
        Update: {
          course_id?: string | null
          created_at?: string
          day_of_week?: string
          id?: string
          period?: string
          room?: string | null
          semester?: number | null
          subject?: string
          teacher_name?: string | null
          title?: string
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "timetables_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      top_students: {
        Row: {
          course: string
          created_at: string
          id: string
          is_active: boolean | null
          photo_url: string | null
          posted_by: string | null
          rank: number
          student_name: string
          year: string
        }
        Insert: {
          course: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          photo_url?: string | null
          posted_by?: string | null
          rank: number
          student_name: string
          year: string
        }
        Update: {
          course?: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          photo_url?: string | null
          posted_by?: string | null
          rank?: number
          student_name?: string
          year?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_application_status: {
        Args: { _app_number: string; _email: string }
        Returns: {
          address: string | null
          application_number: string | null
          course: string
          created_at: string
          date_of_birth: string | null
          email: string
          father_name: string | null
          full_name: string
          gender: string | null
          id: string
          mother_name: string | null
          percentage_12th: string | null
          phone: string
          photo_url: string | null
          previous_school: string | null
          review_notes: string | null
          reviewed_by: string | null
          status: string
        }[]
        SetofOptions: {
          from: "*"
          to: "admission_applications"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      get_user_role: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["app_role"]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "student" | "teacher" | "principal" | "admin"
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
      app_role: ["student", "teacher", "principal", "admin"],
    },
  },
} as const
