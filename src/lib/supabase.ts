import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Storage bucket names
export const STORAGE_BUCKETS = {
  RESOURCES: 'resources',
  UPLOADS: 'uploads',
  PROFILE_IMAGES: 'profile-images'
} as const

// Database table names
export const TABLES = {
  USERS: 'users',
  TEACHERS: 'teachers', 
  RESOURCES: 'resources',
  UPLOADS: 'uploads',
  ANNOUNCEMENTS: 'announcements',
  SUGGESTIONS: 'suggestions',
  ADMISSIONS: 'admissions',
  ATTENDANCE: 'attendance_records',
  VIEWED_RESOURCES: 'viewed_resources',
  VIEWED_TIMETABLES: 'viewed_timetables'
} as const
