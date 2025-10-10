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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      category_texts: {
        Row: {
          always_on_description: string | null
          always_on_title: string | null
          id: string
          menu_data_id: string
          pasta_description: string | null
          pasta_title: string | null
          pinsa_pizza_description: string | null
          pinsa_pizza_title: string | null
          salads_description: string | null
          salads_title: string | null
        }
        Insert: {
          always_on_description?: string | null
          always_on_title?: string | null
          id?: string
          menu_data_id: string
          pasta_description?: string | null
          pasta_title?: string | null
          pinsa_pizza_description?: string | null
          pinsa_pizza_title?: string | null
          salads_description?: string | null
          salads_title?: string | null
        }
        Update: {
          always_on_description?: string | null
          always_on_title?: string | null
          id?: string
          menu_data_id?: string
          pasta_description?: string | null
          pasta_title?: string | null
          pinsa_pizza_description?: string | null
          pinsa_pizza_title?: string | null
          salads_description?: string | null
          salads_title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "category_texts_menu_data_id_fkey"
            columns: ["menu_data_id"]
            isOneToOne: true
            referencedRelation: "menu_data"
            referencedColumns: ["id"]
          },
        ]
      }
      lunch_included: {
        Row: {
          icon: string
          id: string
          menu_data_id: string
          name: string
          order_index: number
        }
        Insert: {
          icon: string
          id?: string
          menu_data_id: string
          name: string
          order_index: number
        }
        Update: {
          icon?: string
          id?: string
          menu_data_id?: string
          name?: string
          order_index?: number
        }
        Relationships: [
          {
            foreignKeyName: "lunch_included_menu_data_id_fkey"
            columns: ["menu_data_id"]
            isOneToOne: false
            referencedRelation: "menu_data"
            referencedColumns: ["id"]
          },
        ]
      }
      lunch_pricing: {
        Row: {
          id: string
          menu_data_id: string
          on_site: number
          takeaway: number
        }
        Insert: {
          id?: string
          menu_data_id: string
          on_site: number
          takeaway: number
        }
        Update: {
          id?: string
          menu_data_id?: string
          on_site?: number
          takeaway?: number
        }
        Relationships: [
          {
            foreignKeyName: "lunch_pricing_menu_data_id_fkey"
            columns: ["menu_data_id"]
            isOneToOne: true
            referencedRelation: "menu_data"
            referencedColumns: ["id"]
          },
        ]
      }
      menu_data: {
        Row: {
          created_at: string
          id: string
          updated_at: string
          week: number
        }
        Insert: {
          created_at?: string
          id?: string
          updated_at?: string
          week: number
        }
        Update: {
          created_at?: string
          id?: string
          updated_at?: string
          week?: number
        }
        Relationships: []
      }
      menu_items: {
        Row: {
          category: string
          description: string | null
          id: string
          menu_data_id: string
          name: string
          order_index: number
          price: number
        }
        Insert: {
          category: string
          description?: string | null
          id?: string
          menu_data_id: string
          name: string
          order_index: number
          price: number
        }
        Update: {
          category?: string
          description?: string | null
          id?: string
          menu_data_id?: string
          name?: string
          order_index?: number
          price?: number
        }
        Relationships: [
          {
            foreignKeyName: "menu_items_menu_data_id_fkey"
            columns: ["menu_data_id"]
            isOneToOne: false
            referencedRelation: "menu_data"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      weekly_lunch: {
        Row: {
          day: string
          id: string
          meals: Json
          menu_data_id: string
          order_index: number
        }
        Insert: {
          day: string
          id?: string
          meals?: Json
          menu_data_id: string
          order_index: number
        }
        Update: {
          day?: string
          id?: string
          meals?: Json
          menu_data_id?: string
          order_index?: number
        }
        Relationships: [
          {
            foreignKeyName: "weekly_lunch_menu_data_id_fkey"
            columns: ["menu_data_id"]
            isOneToOne: false
            referencedRelation: "menu_data"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: {
        Args: { check_user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
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
      app_role: ["admin", "user"],
    },
  },
} as const
