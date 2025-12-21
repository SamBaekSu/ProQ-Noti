export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: '12.2.3 (519615d)';
  };
  graphql_public: {
    Tables: {
      [_ in never]: never;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      graphql: {
        Args: {
          extensions?: Json;
          operationName?: string;
          query?: string;
          variables?: Json;
        };
        Returns: Json;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  public: {
    Tables: {
      fcm_tokens: {
        Row: {
          created_at: string;
          device_type: string;
          fcm_token: string;
          id: string;
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          device_type: string;
          fcm_token: string;
          id?: string;
          updated_at?: string | null;
          user_id: string;
        };
        Update: {
          created_at?: string;
          device_type?: string;
          fcm_token?: string;
          id?: string;
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [];
      };
      notifications: {
        Row: {
          body: string;
          created_at: string;
          id: string;
          user_id: string;
        };
        Insert: {
          body: string;
          created_at?: string;
          id?: string;
          user_id: string;
        };
        Update: {
          body?: string;
          created_at?: string;
          id?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      riot_accounts: {
        Row: {
          created_at: string | null;
          id: number;
          is_main: boolean | null;
          is_online: boolean | null;
          last_checked_at: string | null;
          last_match_id: string | null;
          last_online: string | null;
          pro_user_id: number;
          puuid: string;
          region: string;
          summoner_name: string;
          tag_line: string;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          id?: number;
          is_main?: boolean | null;
          is_online?: boolean | null;
          last_checked_at?: string | null;
          last_match_id?: string | null;
          last_online?: string | null;
          pro_user_id: number;
          puuid: string;
          region?: string;
          summoner_name: string;
          tag_line: string;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          id?: number;
          is_main?: boolean | null;
          is_online?: boolean | null;
          last_checked_at?: string | null;
          last_match_id?: string | null;
          last_online?: string | null;
          pro_user_id?: number;
          puuid?: string;
          region?: string;
          summoner_name?: string;
          tag_line?: string;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'riot_accounts_pro_user_id_fkey';
            columns: ['pro_user_id'];
            isOneToOne: false;
            referencedRelation: 'riot_pro_users';
            referencedColumns: ['id'];
          }
        ];
      };
      riot_pro_users: {
        Row: {
          id: number;
          is_starter: boolean;
          league: string | null;
          position_number: number;
          pro_name: string;
          team_id: number | null;
        };
        Insert: {
          id?: number;
          is_starter?: boolean;
          league?: string | null;
          position_number?: number;
          pro_name: string;
          team_id?: number | null;
        };
        Update: {
          id?: number;
          is_starter?: boolean;
          league?: string | null;
          position_number?: number;
          pro_name?: string;
          team_id?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: 'riot_pro_users_team_id_fkey';
            columns: ['team_id'];
            isOneToOne: false;
            referencedRelation: 'teams';
            referencedColumns: ['id'];
          }
        ];
      };
      subscribe: {
        Row: {
          created_at: string | null;
          id: number;
          riot_pro_user_id: number;
          user_id: string;
        };
        Insert: {
          created_at?: string | null;
          id?: number;
          riot_pro_user_id: number;
          user_id: string;
        };
        Update: {
          created_at?: string | null;
          id?: number;
          riot_pro_user_id?: number;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'subscribe_riot_pro_user_id_fkey';
            columns: ['riot_pro_user_id'];
            isOneToOne: false;
            referencedRelation: 'riot_pro_users';
            referencedColumns: ['id'];
          }
        ];
      };
      teams: {
        Row: {
          created_at: string;
          id: number;
          name_abbr: string;
          name_prefix: string;
          name_suffix: string | null;
        };
        Insert: {
          created_at?: string;
          id?: number;
          name_abbr: string;
          name_prefix: string;
          name_suffix?: string | null;
        };
        Update: {
          created_at?: string;
          id?: number;
          name_abbr?: string;
          name_prefix?: string;
          name_suffix?: string | null;
        };
        Relationships: [];
      };
      users: {
        Row: {
          avatar_url: string | null;
          created_at: string | null;
          email: string | null;
          id: string;
          updated_at: string | null;
          user_name: string | null;
        };
        Insert: {
          avatar_url?: string | null;
          created_at?: string | null;
          email?: string | null;
          id: string;
          updated_at?: string | null;
          user_name?: string | null;
        };
        Update: {
          avatar_url?: string | null;
          created_at?: string | null;
          email?: string | null;
          id?: string;
          updated_at?: string | null;
          user_name?: string | null;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      clean_old_cron_job_run_details: { Args: never; Returns: undefined };
      get_players_with_subscription: {
        Args: { current_user_id?: string; team_abbr: string };
        Returns: {
          account_id: number;
          id: number;
          is_online: boolean;
          is_subscribed: boolean;
          last_match_id: string;
          last_online: string;
          league: string;
          pro_name: string;
          puuid: string;
          summoner_name: string;
          tag_line: string;
          team_id: number;
        }[];
      };
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

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  'public'
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] &
        DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] &
        DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
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
    : never = never
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
    : never = never
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
    : never = never
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
    : never = never
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  graphql_public: {
    Enums: {}
  },
  public: {
    Enums: {}
  }
} as const;
