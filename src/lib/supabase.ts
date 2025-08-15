import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database table names
export const TABLES = {
  USERS: 'users',
  SWING_ANALYSES: 'swing_analyses',
  VIDEO_UPLOADS: 'video_uploads',
  MONTHLY_REPORTS: 'monthly_reports',
  ACHIEVEMENTS: 'achievements',
  USER_SETTINGS: 'user_settings',
} as const;

// Storage bucket names
export const STORAGE_BUCKETS = {
  VIDEOS: 'swing-videos',
  THUMBNAILS: 'swing-thumbnails',
  AVATARS: 'user-avatars',
} as const;

// RPC function names
export const RPC_FUNCTIONS = {
  GET_MONTHLY_REPORT: 'get_monthly_report',
  GET_SWING_HISTORY: 'get_swing_history',
  GET_PROGRESS_TRENDS: 'get_progress_trends',
  TRIGGER_AI_ANALYSIS: 'trigger_ai_analysis',
} as const;
