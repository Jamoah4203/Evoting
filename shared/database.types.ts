export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          voter_id: string;
          first_name: string;
          last_name: string;
          role: "voter" | "admin";
          is_verified: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          voter_id: string;
          first_name: string;
          last_name: string;
          role?: "voter" | "admin";
          is_verified?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          voter_id?: string;
          first_name?: string;
          last_name?: string;
          role?: "voter" | "admin";
          is_verified?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      elections: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          start_date: string;
          end_date: string;
          is_active: boolean;
          results_published: boolean;
          created_by: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          start_date: string;
          end_date: string;
          is_active?: boolean;
          results_published?: boolean;
          created_by: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          start_date?: string;
          end_date?: string;
          is_active?: boolean;
          results_published?: boolean;
          created_by?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      positions: {
        Row: {
          id: string;
          election_id: string;
          title: string;
          description: string | null;
          max_votes: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          election_id: string;
          title: string;
          description?: string | null;
          max_votes?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          election_id?: string;
          title?: string;
          description?: string | null;
          max_votes?: number;
          created_at?: string;
        };
      };
      candidates: {
        Row: {
          id: string;
          position_id: string;
          name: string;
          bio: string | null;
          image_url: string | null;
          vote_count: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          position_id: string;
          name: string;
          bio?: string | null;
          image_url?: string | null;
          vote_count?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          position_id?: string;
          name?: string;
          bio?: string | null;
          image_url?: string | null;
          vote_count?: number;
          created_at?: string;
        };
      };
      votes: {
        Row: {
          id: string;
          user_id: string;
          candidate_id: string;
          position_id: string;
          election_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          candidate_id: string;
          position_id: string;
          election_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          candidate_id?: string;
          position_id?: string;
          election_id?: string;
          created_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      user_role: "voter" | "admin";
    };
  };
}
