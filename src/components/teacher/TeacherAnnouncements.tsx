import React, { useEffect } from 'react';
import { Bell, Calendar, User } from 'lucide-react';
import { useData } from '@/contexts/DataContext';

const TeacherAnnouncements: React.FC = () => {
  const { announcements, markAnnouncementRead } = useData();

  // Filter announcements for teachers
  const teacherAnnouncements = announcements
    .filter(a => a.target === 'teachers' || a.target === 'both')
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const unreadAnnouncements = teacherAnnouncements.filter(a => !a.isRead);

  // Mark announcements as read when component mounts
  useEffect(() => {
    unreadAnnouncements.forEach(announcement => {
      markAnnouncementRead(announcement.id);
    });
  }, [unreadAnnouncements, markAnnouncementRead]);

  return (
    <div className="space-y-6">
      {/* Header */}
<div className="text-center space-y-2">
  <h3 className="text-3xl font-serif font-bold text-pink-700 tracking-wide">
          News
  </h3>
  <p className="text-gray-600 mt-1">
    Stay updated with important news and information
  </p>
</div>

      {/* Stats */}
      <div className="flex justify-center">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 text-center">
          <div className="bg-pink-100 p-2 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center">
            <Bell className="h-6 w-6 text-pink-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-1">{teacherAnnouncements.length}</h3>
          <p className="text-gray-600 text-sm">Total Announcements</p>
        </div>
      </div>

      {/* Announcements List */}
      {teacherAnnouncements.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <Bell className="h-16 w-16 text-gray-400 mx-auto mb-6" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No announcements yet</h3>
          <p className="text-gray-500">Check back later for the latest news and updates.</p>
          </div>
        ) : (
        <div className="space-y-8">
            {teacherAnnouncements.map((announcement) => {
              const isRecent = new Date(announcement.createdAt) > new Date(Date.now() - 24 * 60 * 60 * 1000);
              
              return (
                <div 
                  key={announcement.id} 
                className={`bg-white rounded-lg shadow-sm border border-gray-200 cursor-pointer transition-all duration-200 hover:shadow-md hover:border-pink-300 ${
                  isRecent ? 'ring-2 ring-pink-200 bg-pink-50' : ''
                }`}
              >
                {/* Blue background content area */}
                <div className="bg-blue-500 p-8">
                  <div className="text-center">
                    <h2 className="inline-block bg-white text-black px-4 py-2 rounded-full text-lg font-semibold mb-4">
                      {announcement.title}
                    </h2>
                    <p className="text-white leading-relaxed text-lg whitespace-pre-wrap">{announcement.content}</p>
                  </div>
                      </div>
                      
                {/* Footer with admin info and date/time */}
                <div className="flex items-center justify-between p-6">
                  <div className="flex items-center space-x-1 text-sm text-gray-500">
                          <User className="h-4 w-4" />
                          <span>By {announcement.author}</span>
                        </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(announcement.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}</span>
                        </div>
                    <div className="flex items-center space-x-1">
                      <Bell className="h-4 w-4" />
                      <span>{new Date(announcement.createdAt).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}</span>
                    </div>
                    {isRecent && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        New
                      </span>
                    )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      {/* Information */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-blue-900 mb-3">About Announcements</h4>
        <ul className="space-y-2 text-blue-800 text-sm">
          <li>• Announcements are automatically marked as read when you view them</li>
          <li>• New announcements are highlighted with a blue border</li>
          <li>• You'll see announcements targeted to teachers and general announcements</li>
          <li>• Check this section regularly for important updates and information</li>
        </ul>
      </div>
    </div>
  );
};

export default TeacherAnnouncements;