import { createClient } from '@supabase/supabase-js';
import { SUPABASE_CONFIG } from '../constants/supabase_config';

export const supabase = createClient(
  SUPABASE_CONFIG.url,
  SUPABASE_CONFIG.anonKey,
  {
    auth: {
      persistSession: true,
      detectSessionInUrl: false,
    },
  },
);

export default supabase;

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          phone: string | null;
          role: 'client' | 'lawyer' | 'admin';
          subscription_tier: 'free' | 'basic' | 'premium';
          storage_used_mb: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['profiles']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>;
      };
      legal_documents: {
        Row: {
          id: string;
          title: string;
          category: string;
          description: string | null;
          price: number;
          file_url: string | null;
          cover_image_url: string | null;
          downloads: number;
          rating: number;
          year: number | null;
          author: string | null;
          created_at: string;
          updated_at: string;
        };
      };
      user_purchases: {
        Row: {
          id: string;
          user_id: string;
          document_id: string;
          amount_paid: number;
          payment_method: string;
          payment_reference: string | null;
          purchased_at: string;
        };
      };
      cases: {
        Row: {
          id: string;
          user_id: string;
          lawyer_id: string | null;
          case_number: string;
          title: string;
          description: string | null;
          status: 'pending' | 'active' | 'closed' | 'on-hold';
          priority: 'low' | 'medium' | 'high' | 'urgent';
          progress: number;
          next_hearing: string | null;
          created_at: string;
          updated_at: string;
        };
      };
      appointments: {
        Row: {
          id: string;
          user_id: string;
          lawyer_id: string;
          appointment_date: string;
          appointment_time: string;
          type: 'consultation' | 'case-review' | 'court-prep';
          status: 'upcoming' | 'completed' | 'cancelled';
          location: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
      };
    };
  };
};
