// Auto-generated types from Supabase
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          id: string
          user_id: string
          slug: string
          title: string
          subtitle: string | null
          description: string | null
          category: 'web' | 'electronics'
          period: string | null
          roles: string[]
          tools: string[]
          highlights: string[]
          is_published: boolean
          order_index: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          slug: string
          title: string
          subtitle?: string | null
          description?: string | null
          category: 'web' | 'electronics'
          period?: string | null
          roles?: string[]
          tools?: string[]
          highlights?: string[]
          is_published?: boolean
          order_index?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          slug?: string
          title?: string
          subtitle?: string | null
          description?: string | null
          category?: 'web' | 'electronics'
          period?: string | null
          roles?: string[]
          tools?: string[]
          highlights?: string[]
          is_published?: boolean
          order_index?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'projects_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          }
        ]
      }
      project_images: {
        Row: {
          id: string
          project_id: string
          image_url: string
          alt_text: string | null
          order_index: number
          created_at: string
        }
        Insert: {
          id?: string
          project_id: string
          image_url: string
          alt_text?: string | null
          order_index?: number
          created_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          image_url?: string
          alt_text?: string | null
          order_index?: number
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'project_images_project_id_fkey'
            columns: ['project_id']
            isOneToOne: false
            referencedRelation: 'projects'
            referencedColumns: ['id']
          }
        ]
      }
      process_steps: {
        Row: {
          id: string
          project_id: string
          phase: '企画' | '制作' | '評価'
          title: string
          description: string | null
          order_index: number
          created_at: string
        }
        Insert: {
          id?: string
          project_id: string
          phase: '企画' | '制作' | '評価'
          title: string
          description?: string | null
          order_index?: number
          created_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          phase?: '企画' | '制作' | '評価'
          title?: string
          description?: string | null
          order_index?: number
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'process_steps_project_id_fkey'
            columns: ['project_id']
            isOneToOne: false
            referencedRelation: 'projects'
            referencedColumns: ['id']
          }
        ]
      }
      skills: {
        Row: {
          id: string
          user_id: string
          category: string
          name: string
          order_index: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          category: string
          name: string
          order_index?: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          category?: string
          name?: string
          order_index?: number
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'skills_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          }
        ]
      }
      experience: {
        Row: {
          id: string
          user_id: string
          period: string
          description: string
          industry: string | null
          order_index: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          period: string
          description: string
          industry?: string | null
          order_index?: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          period?: string
          description?: string
          industry?: string | null
          order_index?: number
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'experience_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          }
        ]
      }
      awards: {
        Row: {
          id: string
          project_id: string | null
          user_id: string
          title: string
          award_date: string | null
          description: string | null
          order_index: number
          created_at: string
        }
        Insert: {
          id?: string
          project_id?: string | null
          user_id: string
          title: string
          award_date?: string | null
          description?: string | null
          order_index?: number
          created_at?: string
        }
        Update: {
          id?: string
          project_id?: string | null
          user_id?: string
          title?: string
          award_date?: string | null
          description?: string | null
          order_index?: number
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'awards_project_id_fkey'
            columns: ['project_id']
            isOneToOne: false
            referencedRelation: 'projects'
            referencedColumns: ['id']
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
