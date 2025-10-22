-- Supabase Database Schema for Tawheed School Management System
-- Run these SQL commands in your Supabase SQL Editor

-- Enable Row Level Security
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- Create custom types
CREATE TYPE user_role AS ENUM ('admin', 'teacher', 'smc');
CREATE TYPE upload_status AS ENUM ('pending', 'marked');
CREATE TYPE admission_status AS ENUM ('pending', 'reviewed', 'accepted', 'rejected');
CREATE TYPE attendance_status AS ENUM ('on-time', 'late');
CREATE TYPE resource_category AS ENUM ('resource', 'timetable');
CREATE TYPE upload_type AS ENUM ('lesson-plan', 'progress-report');
CREATE TYPE announcement_target AS ENUM ('teachers', 'public', 'both');
CREATE TYPE suggestion_source AS ENUM ('public', 'teacher');

-- Users table (for admins and SMC)
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role user_role NOT NULL,
  name TEXT NOT NULL,
  is_first_login BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Teachers table (extends users)
CREATE TABLE teachers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role user_role DEFAULT 'teacher',
  name TEXT NOT NULL,
  is_first_login BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  added_by TEXT NOT NULL,
  last_sign_in TIMESTAMP WITH TIME ZONE,
  attendance_history JSONB DEFAULT '[]'::jsonb
);

-- Resources table
CREATE TABLE resources (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_type TEXT NOT NULL CHECK (file_type IN ('pdf', 'image')),
  uploaded_by TEXT NOT NULL,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  category resource_category NOT NULL
);

-- Uploads table
CREATE TABLE uploads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  teacher_id TEXT NOT NULL,
  teacher_name TEXT NOT NULL,
  type upload_type NOT NULL,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status upload_status DEFAULT 'pending',
  comments TEXT,
  grade TEXT
);

-- Announcements table
CREATE TABLE announcements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  author TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  target announcement_target NOT NULL,
  is_read BOOLEAN DEFAULT false
);

-- Suggestions table
CREATE TABLE suggestions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  message TEXT NOT NULL,
  source suggestion_source NOT NULL,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_read BOOLEAN DEFAULT false,
  reply TEXT,
  replied_at TIMESTAMP WITH TIME ZONE,
  replied_by TEXT
);

-- Admissions table
CREATE TABLE admissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_name TEXT NOT NULL,
  parent_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  grade TEXT NOT NULL,
  message TEXT,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status admission_status DEFAULT 'pending'
);

-- Attendance records table
CREATE TABLE attendance_records (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  teacher_id TEXT NOT NULL,
  teacher_name TEXT NOT NULL,
  date DATE NOT NULL,
  time TIME NOT NULL,
  status attendance_status NOT NULL,
  location JSONB NOT NULL -- {latitude: number, longitude: number}
);

-- Viewed resources tracking
CREATE TABLE viewed_resources (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  resource_id UUID REFERENCES resources(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Viewed timetables tracking
CREATE TABLE viewed_timetables (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  resource_id UUID REFERENCES resources(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_teachers_username ON teachers(username);
CREATE INDEX idx_resources_category ON resources(category);
CREATE INDEX idx_uploads_status ON uploads(status);
CREATE INDEX idx_announcements_target ON announcements(target);
CREATE INDEX idx_suggestions_source ON suggestions(source);
CREATE INDEX idx_admissions_status ON admissions(status);
CREATE INDEX idx_attendance_teacher_date ON attendance_records(teacher_id, date);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE uploads ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE suggestions ENABLE ROW LEVEL SECURITY;
ALTER TABLE admissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE viewed_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE viewed_timetables ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (adjust based on your security needs)
-- For now, allowing all operations - you should restrict these based on user roles

-- Users policies
CREATE POLICY "Allow all operations on users" ON users FOR ALL USING (true);

-- Teachers policies  
CREATE POLICY "Allow all operations on teachers" ON teachers FOR ALL USING (true);

-- Resources policies
CREATE POLICY "Allow all operations on resources" ON resources FOR ALL USING (true);

-- Uploads policies
CREATE POLICY "Allow all operations on uploads" ON uploads FOR ALL USING (true);

-- Announcements policies
CREATE POLICY "Allow all operations on announcements" ON announcements FOR ALL USING (true);

-- Suggestions policies
CREATE POLICY "Allow all operations on suggestions" ON suggestions FOR ALL USING (true);

-- Admissions policies
CREATE POLICY "Allow all operations on admissions" ON admissions FOR ALL USING (true);

-- Attendance policies
CREATE POLICY "Allow all operations on attendance_records" ON attendance_records FOR ALL USING (true);

-- Viewed resources policies
CREATE POLICY "Allow all operations on viewed_resources" ON viewed_resources FOR ALL USING (true);

-- Viewed timetables policies
CREATE POLICY "Allow all operations on viewed_timetables" ON viewed_timetables FOR ALL USING (true);

-- Insert default admin users
INSERT INTO users (username, password, role, name, is_first_login) VALUES
('saeed', 'Archimedes', 'admin', 'saeed', false),
('hassan', 'Archimedes', 'admin', 'hassan', false),
('school', 'sunnah', 'smc', 'SMC', false);
