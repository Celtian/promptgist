export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: '14.5';
  };
  public: {
    Tables: {
      jobItems: {
        Row: {
          createdAt: string;
          createdBy: string;
          id: string;
          order: number;
          promptId: string;
          updatedAt: string;
          updatedBy: string;
        };
        Insert: {
          createdAt?: string;
          createdBy: string;
          id?: string;
          order: number;
          promptId: string;
          updatedAt: string;
          updatedBy: string;
        };
        Update: {
          createdAt?: string;
          createdBy?: string;
          id?: string;
          order?: number;
          promptId?: string;
          updatedAt?: string;
          updatedBy?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'jobItems_promptId_fkey';
            columns: ['promptId'];
            isOneToOne: false;
            referencedRelation: 'prompts';
            referencedColumns: ['id'];
          },
        ];
      };
      jobs: {
        Row: {
          createdAt: string;
          createdBy: string;
          id: string;
          name: string | null;
          updatedAt: string;
          updatedBy: string;
        };
        Insert: {
          createdAt?: string;
          createdBy: string;
          id?: string;
          name?: string | null;
          updatedAt?: string;
          updatedBy: string;
        };
        Update: {
          createdAt?: string;
          createdBy?: string;
          id?: string;
          name?: string | null;
          updatedAt?: string;
          updatedBy?: string;
        };
        Relationships: [];
      };
      promptRoles: {
        Row: {
          content: string;
          createdAt: string;
          createdBy: string;
          id: string;
          name: string;
          updatedAt: string;
          updatedBy: string;
        };
        Insert: {
          content: string;
          createdAt?: string;
          createdBy: string;
          id?: string;
          name: string;
          updatedAt?: string;
          updatedBy: string;
        };
        Update: {
          content?: string;
          createdAt?: string;
          createdBy?: string;
          id?: string;
          name?: string;
          updatedAt?: string;
          updatedBy?: string;
        };
        Relationships: [];
      };
      prompts: {
        Row: {
          createdAt: string;
          createdBy: string;
          id: string;
          name: string;
          promptRoleId: string;
          updatedAt: string;
          updatedBy: string;
        };
        Insert: {
          createdAt?: string;
          createdBy: string;
          id?: string;
          name: string;
          promptRoleId: string;
          updatedAt?: string;
          updatedBy: string;
        };
        Update: {
          createdAt?: string;
          createdBy?: string;
          id?: string;
          name?: string;
          promptRoleId?: string;
          updatedAt?: string;
          updatedBy?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'prompts_promptRoleId_fkey';
            columns: ['promptRoleId'];
            isOneToOne: false;
            referencedRelation: 'promptRoles';
            referencedColumns: ['id'];
          },
        ];
      };
      workflowItems: {
        Row: {
          createdAt: string;
          createdBy: string;
          id: string;
          jobId: string;
          order: number;
          updatedAt: string;
          updatedBy: string;
          workflowId: string;
        };
        Insert: {
          createdAt?: string;
          createdBy: string;
          id?: string;
          jobId: string;
          order: number;
          updatedAt: string;
          updatedBy: string;
          workflowId: string;
        };
        Update: {
          createdAt?: string;
          createdBy?: string;
          id?: string;
          jobId?: string;
          order?: number;
          updatedAt?: string;
          updatedBy?: string;
          workflowId?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'workflowItems_jobId_fkey';
            columns: ['jobId'];
            isOneToOne: false;
            referencedRelation: 'jobs';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'workflowItems_workflowId_fkey';
            columns: ['workflowId'];
            isOneToOne: false;
            referencedRelation: 'workflows';
            referencedColumns: ['id'];
          },
        ];
      };
      workflows: {
        Row: {
          createdAt: string;
          createdBy: string;
          id: string;
          isPublic: boolean;
          name: string;
          updatedAt: string;
          updatedBy: string;
        };
        Insert: {
          createdAt?: string;
          createdBy: string;
          id?: string;
          isPublic?: boolean;
          name: string;
          updatedAt?: string;
          updatedBy: string;
        };
        Update: {
          createdAt?: string;
          createdBy?: string;
          id?: string;
          isPublic?: boolean;
          name?: string;
          updatedAt?: string;
          updatedBy?: string;
        };
        Relationships: [];
      };
      workflowStars: {
        Row: {
          createdAt: string;
          id: string;
          updatedAt: string;
          userId: string;
          workflowId: string;
        };
        Insert: {
          createdAt?: string;
          id?: string;
          updatedAt?: string;
          userId: string;
          workflowId: string;
        };
        Update: {
          createdAt?: string;
          id?: string;
          updatedAt?: string;
          userId?: string;
          workflowId?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'workflowStars_workflowId_fkey';
            columns: ['workflowId'];
            isOneToOne: false;
            referencedRelation: 'workflows';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, 'public'>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] & DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema['Enums']
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema['CompositeTypes']
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {},
  },
} as const;
