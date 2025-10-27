-- Migration to add teacher_username field to attendance_records table
-- Run this script to update the database schema

-- Add the teacher_username column to attendance_records table
ALTER TABLE attendance_records 
ADD COLUMN teacher_username TEXT;

-- Update existing records to populate teacher_username
-- This will need to be done manually or through a data migration script
-- For now, we'll set it to the teacher_name as a fallback
UPDATE attendance_records 
SET teacher_username = teacher_name 
WHERE teacher_username IS NULL;

-- Make the column NOT NULL after populating existing data
ALTER TABLE attendance_records 
ALTER COLUMN teacher_username SET NOT NULL;

-- Add an index for better performance
CREATE INDEX idx_attendance_teacher_username ON attendance_records(teacher_username);
