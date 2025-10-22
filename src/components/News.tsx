import React, { useEffect } from 'react';
import { Bell, Calendar, User } from 'lucide-react';
import { useData } from '@/contexts/DataContext';

const News: React.FC = () => {
  const { getPublicAnnouncements, markAnnouncementRead } = useData();
  const publicAnnouncements = getPublicAnnouncements();

  // Auto-mark all public announcements as read when component mounts
  useEffect(() => {
    publicAnnouncements.forEach(announcement => {
      if (!announcement.isRead) {
        markAnnouncementRead(announcement.id);
      }
    });
  }, [publicAnnouncements, markAnnouncementRead]);

  const handleAnnouncementClick = (announcementId: string) => {
    markAnnouncementRead(announcementId);
  };


  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-serif font-bold text-pink-700 tracking-wide mb-4">
            News
          </h1>
          <p className="text-gray-600 text-lg">
            Stay updated with the latest news and announcements from Tawheed Educational Center
          </p>
        </div>

        {/* Stats */}
        <div className="flex justify-center mb-12">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 text-center">
            <div className="bg-pink-100 p-2 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center">
              <Bell className="h-6 w-6 text-pink-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-1">{publicAnnouncements.length}</h3>
            <p className="text-gray-600 text-sm">Total Announcements</p>
          </div>
        </div>

        {/* Announcements List */}
        {publicAnnouncements.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <Bell className="h-16 w-16 text-gray-400 mx-auto mb-6" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No announcements yet</h3>
            <p className="text-gray-500">Check back later for the latest news and updates.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {publicAnnouncements
              .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
              .map((announcement) => (
                <div
                  key={announcement.id}
                  onClick={() => handleAnnouncementClick(announcement.id)}
                  className={`bg-white rounded-lg shadow-sm border border-gray-200 cursor-pointer transition-all duration-200 hover:shadow-md hover:border-pink-300 ${
                    !announcement.isRead ? 'ring-2 ring-pink-200 bg-pink-50' : ''
                  }`}
                >
                  {/* Blue background content area */}
                  <div className="bg-blue-500 p-8">
                    <div className="text-center">
                      <h2 className="inline-block bg-white text-black px-4 py-2 rounded-full text-lg font-semibold mb-4">
                        {announcement.title}
                      </h2>
                      <p className="text-white leading-relaxed text-lg">{announcement.content}</p>
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
                      {!announcement.isRead && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          New
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}

        {/* Footer Note */}
        <div className="mt-12 text-center">
          <p className="text-gray-500 text-sm">
            For more information or questions, please contact us through our contact page.
          </p>
        </div>
      </div>
    </div>
  );
};

export default News;
