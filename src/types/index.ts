// Types for Tawheed Educational Center System

export interface User {
  id: string;
  username: string;
  password: string;
  role: 'admin' | 'teacher' | 'smc';
  name: string;
  isFirstLogin: boolean;
  createdAt: string;
}

export interface Teacher extends User {
  role: 'teacher';
  addedBy: string;
  lastSignIn?: string;
  attendanceHistory: AttendanceRecord[];
}

export interface AttendanceRecord {
  id: string;
  teacherId: string;
  teacherName: string;
  date: string;
  time: string;
  status: 'on-time' | 'late';
  location: {
    latitude: number;
    longitude: number;
  };
}

export interface Resource {
  id: string;
  title: string;
  fileName: string;
  fileUrl: string;
  type: 'pdf' | 'image';
  uploadedBy: string;
  uploadedAt: string;
  category: 'resource' | 'timetable';
}

export interface Upload {
  id: string;
  teacherId: string;
  teacherName: string;
  type: 'lesson-plan' | 'progress-report';
  fileName: string;
  fileUrl: string;
  uploadedAt: string;
  status: 'pending' | 'marked';
  comments?: string;
  grade?: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  target: 'teachers' | 'public' | 'both';
  isRead: boolean;
}

export interface Suggestion {
  id: string;
  name: string;
  email?: string;
  message: string;
  source: 'public' | 'teacher';
  submittedAt: string;
  isRead: boolean;
  reply?: string;
  repliedAt?: string;
  repliedBy?: string;
}

export interface AdmissionApplication {
  id: string;
  studentName: string;
  parentName: string;
  email: string;
  phone: string;
  grade: string;
  message?: string;
  submittedAt: string;
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected';
}