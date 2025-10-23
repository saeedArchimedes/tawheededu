import React, { createContext, useContext, useState, useEffect } from 'react';
import { Resource, Upload, Announcement, Suggestion, AdmissionApplication, AttendanceRecord } from '@/types';
import { supabase, TABLES, STORAGE_BUCKETS } from '@/lib/supabase';

interface DataContextType {
  // Resources
  resources: Resource[];
  loading: boolean;
  addResource: (resource: Omit<Resource, 'id'>, file: File) => Promise<void>;
  deleteResource: (id: string) => Promise<void>;
  
  // Uploads
  uploads: Upload[];
  addUpload: (upload: Omit<Upload, 'id'>, file: File) => Promise<void>;
  markUpload: (id: string, comments: string, grade?: string) => Promise<void>;
  clearAllUploads: () => Promise<void>;
  
  // Announcements
  announcements: Announcement[];
  addAnnouncement: (announcement: Omit<Announcement, 'id'>) => Promise<void>;
  deleteAnnouncement: (id: string) => Promise<void>;
  markAnnouncementRead: (id: string) => Promise<void>;
  
  // Suggestions
  suggestions: Suggestion[];
  addSuggestion: (suggestion: Omit<Suggestion, 'id'>) => Promise<void>;
  markSuggestionRead: (id: string) => Promise<void>;
  addSuggestionReply: (id: string, reply: string, repliedBy: string) => Promise<void>;
  clearAllSuggestions: () => Promise<void>;
  clearTeacherSuggestions: (teacherName: string) => Promise<void>;
  
  // Admissions
  admissions: AdmissionApplication[];
  addAdmission: (admission: Omit<AdmissionApplication, 'id'>) => Promise<void>;
  updateAdmissionStatus: (id: string, status: AdmissionApplication['status']) => Promise<void>;
  
  // Attendance
  attendanceRecords: AttendanceRecord[];
  addAttendanceRecord: (record: Omit<AttendanceRecord, 'id'>) => Promise<void>;
  
  // Notification counts
  getUnreadCounts: () => {
    announcements: number;
    suggestions: number;
    uploads: number;
    admissions: number;
    attendance: number;
    resources: number;
    timetable: number;
  };
  getPublicAnnouncements: () => Announcement[];
  getUnreadPublicAnnouncements: () => Announcement[];
  markResourceViewed: (resourceId: string) => Promise<void>;
  markTimetableViewed: (timetableId: string) => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [uploads, setUploads] = useState<Upload[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [admissions, setAdmissions] = useState<AdmissionApplication[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [viewedResources, setViewedResources] = useState<string[]>([]);
  const [viewedTimetables, setViewedTimetables] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Load all data from Supabase on mount
  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      const [
        resourcesResult,
        uploadsResult,
        announcementsResult,
        suggestionsResult,
        admissionsResult,
        attendanceResult,
        viewedResourcesResult,
        viewedTimetablesResult
      ] = await Promise.all([
        supabase.from(TABLES.RESOURCES).select('*').order('uploaded_at', { ascending: false }),
        supabase.from(TABLES.UPLOADS).select('*').order('uploaded_at', { ascending: false }),
        supabase.from(TABLES.ANNOUNCEMENTS).select('*').order('created_at', { ascending: false }),
        supabase.from(TABLES.SUGGESTIONS).select('*').order('submitted_at', { ascending: false }),
        supabase.from(TABLES.ADMISSIONS).select('*').order('submitted_at', { ascending: false }),
        supabase.from(TABLES.ATTENDANCE).select('*').order('date', { ascending: false }),
        supabase.from(TABLES.VIEWED_RESOURCES).select('resource_id'),
        supabase.from(TABLES.VIEWED_TIMETABLES).select('resource_id')
      ]);

      if (resourcesResult.error) throw resourcesResult.error;
      if (uploadsResult.error) throw uploadsResult.error;
      if (announcementsResult.error) throw announcementsResult.error;
      if (suggestionsResult.error) throw suggestionsResult.error;
      if (admissionsResult.error) throw admissionsResult.error;
      if (attendanceResult.error) throw attendanceResult.error;

      // Transform database fields to match Resource interface
      const transformedResources = (resourcesResult.data || []).map((resource: any) => ({
        id: resource.id,
        title: resource.title,
        fileName: resource.file_name,
        fileUrl: resource.file_url,
        type: resource.file_type,
        uploadedBy: resource.uploaded_by,
        uploadedAt: resource.uploaded_at,
        category: resource.category
      }));
      setResources(transformedResources);
      setUploads(uploadsResult.data || []);
      setAnnouncements(announcementsResult.data || []);
      setSuggestions(suggestionsResult.data || []);
      setAdmissions(admissionsResult.data || []);
      setAttendanceRecords(attendanceResult.data || []);
      setViewedResources(viewedResourcesResult.data?.map(v => v.resource_id) || []);
      setViewedTimetables(viewedTimetablesResult.data?.map(v => v.resource_id) || []);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const addResource = async (resource: Omit<Resource, 'id'>, file: File) => {
    try {
      // Upload file to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(STORAGE_BUCKETS.RESOURCES)
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from(STORAGE_BUCKETS.RESOURCES)
        .getPublicUrl(fileName);

      // Insert resource record
      const newResource = {
        title: resource.title,
        file_name: resource.fileName,
        file_url: urlData.publicUrl,
        file_type: resource.type,
        uploaded_by: resource.uploadedBy,
        category: resource.category
      };

      const { data, error } = await supabase
        .from(TABLES.RESOURCES)
        .insert([newResource])
        .select()
        .single();

      if (error) throw error;

      const resourceWithId: Resource = {
        id: data.id,
        title: data.title,
        fileName: data.file_name,
        fileUrl: data.file_url,
        type: data.file_type,
        uploadedBy: data.uploaded_by,
        uploadedAt: data.uploaded_at,
        category: data.category
      };

      setResources(prev => [resourceWithId, ...prev]);
    } catch (error) {
      console.error('Error adding resource:', error);
      throw error;
    }
  };

  const deleteResource = async (id: string) => {
    try {
      // Get resource to find file name
      const resource = resources.find(r => r.id === id);
      if (!resource) throw new Error('Resource not found');

      // Delete file from storage
      const fileName = resource.fileUrl.split('/').pop();
      if (fileName) {
        await supabase.storage
          .from(STORAGE_BUCKETS.RESOURCES)
          .remove([fileName]);
      }

      // Delete from database
      const { error } = await supabase
        .from(TABLES.RESOURCES)
        .delete()
        .eq('id', id);

      if (error) throw error;
      setResources(prev => prev.filter(r => r.id !== id));
    } catch (error) {
      console.error('Error deleting resource:', error);
      throw error;
    }
  };

  const addUpload = async (upload: Omit<Upload, 'id'>, file: File) => {
    try {
      // Upload file to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(STORAGE_BUCKETS.UPLOADS)
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from(STORAGE_BUCKETS.UPLOADS)
        .getPublicUrl(fileName);

      // Insert upload record
      const newUpload = {
        teacher_id: upload.teacherId,
        teacher_name: upload.teacherName,
        type: upload.type,
        file_name: upload.fileName,
        file_url: urlData.publicUrl,
        status: 'pending' as const
      };

      const { data, error } = await supabase
        .from(TABLES.UPLOADS)
        .insert([newUpload])
        .select()
        .single();

      if (error) throw error;

      const uploadWithId: Upload = {
        id: data.id,
        teacherId: data.teacher_id,
        teacherName: data.teacher_name,
        type: data.type,
        fileName: data.file_name,
        fileUrl: data.file_url,
        uploadedAt: data.uploaded_at,
        status: data.status,
        comments: data.comments,
        grade: data.grade
      };

      setUploads(prev => [uploadWithId, ...prev]);
    } catch (error) {
      console.error('Error adding upload:', error);
      throw error;
    }
  };

  const markUpload = async (id: string, comments: string, grade?: string) => {
    try {
      const { error } = await supabase
        .from(TABLES.UPLOADS)
        .update({ 
          status: 'marked', 
          comments, 
          grade 
        })
        .eq('id', id);

      if (error) throw error;

      setUploads(prev => prev.map(u => 
        u.id === id 
          ? { ...u, status: 'marked', comments, grade }
          : u
      ));
    } catch (error) {
      console.error('Error marking upload:', error);
      throw error;
    }
  };

  const clearAllUploads = async () => {
    try {
      // Get all uploads to delete files from storage
      const uploadsToDelete = uploads.map(upload => {
        const fileName = upload.fileUrl.split('/').pop();
        return fileName;
      }).filter(Boolean);

      // Delete files from storage
      if (uploadsToDelete.length > 0) {
        await supabase.storage
          .from(STORAGE_BUCKETS.UPLOADS)
          .remove(uploadsToDelete);
      }

      // Delete all records from database
      const { error } = await supabase
        .from(TABLES.UPLOADS)
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

      if (error) throw error;
      setUploads([]);
    } catch (error) {
      console.error('Error clearing uploads:', error);
      throw error;
    }
  };

  const addAnnouncement = async (announcement: Omit<Announcement, 'id'>) => {
    try {
      const newAnnouncement = {
        title: announcement.title,
        content: announcement.content,
        author: announcement.author,
        target: announcement.target,
        is_read: false
      };

      const { data, error } = await supabase
        .from(TABLES.ANNOUNCEMENTS)
        .insert([newAnnouncement])
        .select()
        .single();

      if (error) throw error;

      const announcementWithId: Announcement = {
        id: data.id,
        title: data.title,
        content: data.content,
        author: data.author,
        createdAt: data.created_at,
        target: data.target,
        isRead: data.is_read
      };

      setAnnouncements(prev => [announcementWithId, ...prev]);
    } catch (error) {
      console.error('Error adding announcement:', error);
      throw error;
    }
  };

  const deleteAnnouncement = async (id: string) => {
    try {
      const { error } = await supabase
        .from(TABLES.ANNOUNCEMENTS)
        .delete()
        .eq('id', id);

      if (error) throw error;
      setAnnouncements(prev => prev.filter(a => a.id !== id));
    } catch (error) {
      console.error('Error deleting announcement:', error);
      throw error;
    }
  };

  const markAnnouncementRead = async (id: string) => {
    try {
      const { error } = await supabase
        .from(TABLES.ANNOUNCEMENTS)
        .update({ is_read: true })
        .eq('id', id);

      if (error) throw error;

      setAnnouncements(prev => prev.map(a => 
        a.id === id ? { ...a, isRead: true } : a
      ));
    } catch (error) {
      console.error('Error marking announcement read:', error);
      throw error;
    }
  };

  const addSuggestion = async (suggestion: Omit<Suggestion, 'id'>) => {
    try {
      const newSuggestion = {
        name: suggestion.name,
        email: suggestion.email,
        message: suggestion.message,
        source: suggestion.source,
        is_read: false
      };

      const { data, error } = await supabase
        .from(TABLES.SUGGESTIONS)
        .insert([newSuggestion])
        .select()
        .single();

      if (error) throw error;

      const suggestionWithId: Suggestion = {
        id: data.id,
        name: data.name,
        email: data.email,
        message: data.message,
        source: data.source,
        submittedAt: data.submitted_at,
        isRead: data.is_read,
        reply: data.reply,
        repliedAt: data.replied_at,
        repliedBy: data.replied_by
      };

      setSuggestions(prev => [suggestionWithId, ...prev]);
    } catch (error) {
      console.error('Error adding suggestion:', error);
      throw error;
    }
  };

  const markSuggestionRead = async (id: string) => {
    try {
      const { error } = await supabase
        .from(TABLES.SUGGESTIONS)
        .update({ is_read: true })
        .eq('id', id);

      if (error) throw error;

      setSuggestions(prev => prev.map(s => 
        s.id === id ? { ...s, isRead: true } : s
      ));
    } catch (error) {
      console.error('Error marking suggestion read:', error);
      throw error;
    }
  };

  const addSuggestionReply = async (id: string, reply: string, repliedBy: string) => {
    try {
      const { error } = await supabase
        .from(TABLES.SUGGESTIONS)
        .update({ 
          reply, 
          replied_at: new Date().toISOString(),
          replied_by: repliedBy,
          is_read: true 
        })
        .eq('id', id);

      if (error) throw error;

      setSuggestions(prev => prev.map(s => 
        s.id === id ? { 
          ...s, 
          reply, 
          repliedAt: new Date().toISOString(),
          repliedBy,
          isRead: true 
        } : s
      ));
    } catch (error) {
      console.error('Error adding suggestion reply:', error);
      throw error;
    }
  };

  const clearAllSuggestions = async () => {
    try {
      const { error } = await supabase
        .from(TABLES.SUGGESTIONS)
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

      if (error) throw error;
      setSuggestions([]);
    } catch (error) {
      console.error('Error clearing suggestions:', error);
      throw error;
    }
  };

  const clearTeacherSuggestions = async (teacherName: string) => {
    try {
      const { error } = await supabase
        .from(TABLES.SUGGESTIONS)
        .delete()
        .eq('name', teacherName);

      if (error) throw error;
      setSuggestions(prev => prev.filter(s => s.name !== teacherName));
    } catch (error) {
      console.error('Error clearing teacher suggestions:', error);
      throw error;
    }
  };

  const addAdmission = async (admission: Omit<AdmissionApplication, 'id'>) => {
    try {
      const newAdmission = {
        student_name: admission.studentName,
        parent_name: admission.parentName,
        email: admission.email,
        phone: admission.phone,
        grade: admission.grade,
        message: admission.message,
        status: 'pending' as const
      };

      const { data, error } = await supabase
        .from(TABLES.ADMISSIONS)
        .insert([newAdmission])
        .select()
        .single();

      if (error) throw error;

      const admissionWithId: AdmissionApplication = {
        id: data.id,
        studentName: data.student_name,
        parentName: data.parent_name,
        email: data.email,
        phone: data.phone,
        grade: data.grade,
        message: data.message,
        submittedAt: data.submitted_at,
        status: data.status
      };

      setAdmissions(prev => [admissionWithId, ...prev]);
    } catch (error) {
      console.error('Error adding admission:', error);
      throw error;
    }
  };

  const updateAdmissionStatus = async (id: string, status: AdmissionApplication['status']) => {
    try {
      const { error } = await supabase
        .from(TABLES.ADMISSIONS)
        .update({ status })
        .eq('id', id);

      if (error) throw error;

      setAdmissions(prev => prev.map(a => 
        a.id === id ? { ...a, status } : a
      ));
    } catch (error) {
      console.error('Error updating admission status:', error);
      throw error;
    }
  };

  const addAttendanceRecord = async (record: Omit<AttendanceRecord, 'id'>) => {
    try {
      const newRecord = {
        teacher_id: record.teacherId,
        teacher_name: record.teacherName,
        date: record.date,
        time: record.time,
        status: record.status,
        location: record.location
      };

      const { data, error } = await supabase
        .from(TABLES.ATTENDANCE)
        .insert([newRecord])
        .select()
        .single();

      if (error) throw error;

      const recordWithId: AttendanceRecord = {
        id: data.id,
        teacherId: data.teacher_id,
        teacherName: data.teacher_name,
        date: data.date,
        time: data.time,
        status: data.status,
        location: data.location
      };

      setAttendanceRecords(prev => [recordWithId, ...prev]);
    } catch (error) {
      console.error('Error adding attendance record:', error);
      throw error;
    }
  };

  const markResourceViewed = async (resourceId: string) => {
    try {
      if (!viewedResources.includes(resourceId)) {
        const { error } = await supabase
          .from(TABLES.VIEWED_RESOURCES)
          .insert([{ resource_id: resourceId }]);

        if (error) throw error;
        setViewedResources(prev => [...prev, resourceId]);
      }
    } catch (error) {
      console.error('Error marking resource viewed:', error);
      throw error;
    }
  };

  const markTimetableViewed = async (timetableId: string) => {
    try {
      if (!viewedTimetables.includes(timetableId)) {
        const { error } = await supabase
          .from(TABLES.VIEWED_TIMETABLES)
          .insert([{ resource_id: timetableId }]);

        if (error) throw error;
        setViewedTimetables(prev => [...prev, timetableId]);
      }
    } catch (error) {
      console.error('Error marking timetable viewed:', error);
      throw error;
    }
  };

  const getUnreadCounts = () => ({
    announcements: announcements.filter(a => !a.isRead).length,
    suggestions: suggestions.filter(s => !s.isRead).length,
    uploads: uploads.filter(u => u.status === 'pending').length,
    admissions: admissions.filter(a => a.status === 'pending').length,
    attendance: attendanceRecords.length, // Show total attendance records for admin
    resources: resources.filter(r => r.category === 'resource' && !viewedResources.includes(r.id)).length, // Show unviewed resources for teachers
    timetable: resources.filter(r => r.category === 'timetable' && !viewedTimetables.includes(r.id)).length // Show unviewed timetable resources for teachers
  });

  const getPublicAnnouncements = () => {
    return announcements.filter(a => a.target === 'public' || a.target === 'both');
  };

  const getUnreadPublicAnnouncements = () => {
    return announcements.filter(a => (a.target === 'public' || a.target === 'both') && !a.isRead);
  };

  return (
    <DataContext.Provider value={{
      resources,
      loading,
      addResource,
      deleteResource,
      uploads,
      addUpload,
      markUpload,
      clearAllUploads,
      announcements,
      addAnnouncement,
      deleteAnnouncement,
      markAnnouncementRead,
      suggestions,
      addSuggestion,
      markSuggestionRead,
      addSuggestionReply,
      clearAllSuggestions,
      clearTeacherSuggestions,
      admissions,
      addAdmission,
      updateAdmissionStatus,
      attendanceRecords,
      addAttendanceRecord,
      getUnreadCounts,
      getPublicAnnouncements,
      getUnreadPublicAnnouncements,
      markResourceViewed,
      markTimetableViewed
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};