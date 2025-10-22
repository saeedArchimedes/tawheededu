import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Teacher } from '@/types';
import { supabase, TABLES } from '@/lib/supabase';
import { DEFAULT_ADMINS, DEFAULT_SMC } from '@/utils/auth';

interface AuthContextType {
  currentUser: User | null;
  teachers: Teacher[];
  loading: boolean;
  login: (username: string, password: string) => Promise<{ success: boolean; message: string; user?: User }>;
  logout: () => void;
  addTeacher: (name: string, password: string) => Promise<void>;
  deleteTeacher: (teacherId: string) => Promise<void>;
  updateTeacherPassword: (teacherId: string, newPassword: string) => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);

  // Load teachers from Supabase on mount
  useEffect(() => {
    loadTeachers();
  }, []);

  const loadTeachers = async () => {
    try {
      const { data, error } = await supabase
        .from(TABLES.TEACHERS)
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTeachers(data || []);
    } catch (error) {
      console.error('Error loading teachers:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (username: string, password: string): Promise<{ success: boolean; message: string; user?: User }> => {
    try {
      // First check if user exists in Supabase users table
      const { data: userData, error: userError } = await supabase
        .from(TABLES.USERS)
        .select('*')
        .eq('username', username)
        .eq('password', password)
        .single();

      if (!userError && userData) {
        const user: User = {
          id: userData.id,
          username: userData.username,
          password: userData.password,
          role: userData.role,
          name: userData.name,
          isFirstLogin: userData.is_first_login,
          createdAt: userData.created_at
        };
        setCurrentUser(user);
        return { success: true, message: 'Login successful', user };
      }

      // Check teachers table
      const { data: teacherData, error: teacherError } = await supabase
        .from(TABLES.TEACHERS)
        .select('*')
        .eq('username', username)
        .eq('password', password)
        .single();

      if (!teacherError && teacherData) {
        const teacher: Teacher = {
          id: teacherData.id,
          username: teacherData.username,
          password: teacherData.password,
          role: teacherData.role,
          name: teacherData.name,
          isFirstLogin: teacherData.is_first_login,
          createdAt: teacherData.created_at,
          addedBy: teacherData.added_by,
          attendanceHistory: teacherData.attendance_history || []
        };
        setCurrentUser(teacher);
        return { success: true, message: 'Login successful', user: teacher };
      }

      // If no user found in database, return error
      return { success: false, message: 'Invalid username or password' };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'Login failed. Please try again.' };
    }
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const addTeacher = async (name: string, password: string) => {
    try {
      const newTeacher = {
        username: name.toLowerCase(),
        password,
        role: 'teacher' as const,
        name,
        is_first_login: true,
        added_by: currentUser?.username || 'admin',
        attendance_history: []
      };

      const { data, error } = await supabase
        .from(TABLES.TEACHERS)
        .insert([newTeacher])
        .select()
        .single();

      if (error) throw error;

      const teacherWithId: Teacher = {
        id: data.id,
        username: data.username,
        password: data.password,
        role: data.role,
        name: data.name,
        isFirstLogin: data.is_first_login,
        createdAt: data.created_at,
        addedBy: data.added_by,
        attendanceHistory: data.attendance_history || []
      };

      setTeachers(prev => [...prev, teacherWithId]);
    } catch (error) {
      console.error('Error adding teacher:', error);
      throw error;
    }
  };

  const deleteTeacher = async (teacherId: string) => {
    try {
      const { error } = await supabase
        .from(TABLES.TEACHERS)
        .delete()
        .eq('id', teacherId);

      if (error) throw error;
      setTeachers(prev => prev.filter(t => t.id !== teacherId));
    } catch (error) {
      console.error('Error deleting teacher:', error);
      throw error;
    }
  };

  const updateTeacherPassword = async (teacherId: string, newPassword: string) => {
    try {
      const { error } = await supabase
        .from(TABLES.TEACHERS)
        .update({ 
          password: newPassword, 
          is_first_login: false 
        })
        .eq('id', teacherId);

      if (error) throw error;

      setTeachers(prev => prev.map(t => 
        t.id === teacherId 
          ? { ...t, password: newPassword, isFirstLogin: false }
          : t
      ));
      
      if (currentUser?.id === teacherId) {
        setCurrentUser(prev => prev ? { ...prev, password: newPassword, isFirstLogin: false } : null);
      }
    } catch (error) {
      console.error('Error updating teacher password:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      teachers,
      loading,
      login,
      logout,
      addTeacher,
      deleteTeacher,
      updateTeacherPassword,
      isAuthenticated: !!currentUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};