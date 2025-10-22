import React, { useState } from 'react';
import { Plus, Bell, Users, Globe, Trash2, Edit3 } from 'lucide-react';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';

const AdminAnnouncements: React.FC = () => {
  const { announcements, addAnnouncement, deleteAnnouncement } = useData();
  const { currentUser } = useAuth();
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    target: 'teachers' as 'teachers' | 'public' | 'both'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.title.trim() && formData.content.trim()) {
      addAnnouncement({
        title: formData.title.trim(),
        content: formData.content.trim(),
        target: formData.target,
        author: currentUser?.name || 'Admin',
        createdAt: new Date().toISOString(),
        isRead: false
      });
      
      setFormData({ title: '', content: '', target: 'teachers' });
      setShowAddForm(false);
    }
  };

  const getTargetIcon = (target: string) => {
    switch (target) {
      case 'teachers':
        return <Users className="h-4 w-4" />;
      case 'public':
        return <Globe className="h-4 w-4" />;
      case 'both':
        return <Bell className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const getTargetColor = (target: string) => {
    switch (target) {
      case 'teachers':
        return 'bg-blue-100 text-blue-800';
      case 'public':
        return 'bg-green-100 text-green-800';
      case 'both':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleDeleteAnnouncement = (id: string) => {
    if (window.confirm('Are you sure you want to delete this announcement? This action cannot be undone.')) {
      deleteAnnouncement(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h3 className="text-3xl font-serif font-bold text-pink-700 tracking-wide">
          Announcements
        </h3>
        <p className="text-gray-600 mt-1">
          Create and manage announcements for teachers and public
        </p>
      </div>

      {/* Centered Add Announcement Button */}
      <div className="flex justify-center">
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-pink-600 text-white px-6 py-2 rounded-lg hover:bg-pink-700 transition-colors duration-200 flex items-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>New Announcement</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 p-2 rounded-full">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-lg font-bold text-gray-900">
                {announcements.filter(a => a.target === 'teachers').length}
              </p>
              <p className="text-sm text-gray-600">For Teachers</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="bg-green-100 p-2 rounded-full">
              <Globe className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-lg font-bold text-gray-900">
                {announcements.filter(a => a.target === 'public').length}
              </p>
              <p className="text-sm text-gray-600">For Public</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="bg-purple-100 p-2 rounded-full">
              <Bell className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-lg font-bold text-gray-900">
                {announcements.filter(a => a.target === 'both').length}
              </p>
              <p className="text-sm text-gray-600">For Both</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="bg-gray-100 p-2 rounded-full">
              <Bell className="h-5 w-5 text-gray-600" />
            </div>
            <div>
              <p className="text-lg font-bold text-gray-900">{announcements.length}</p>
              <p className="text-sm text-gray-600">Total</p>
            </div>
          </div>
        </div>
      </div>

      {/* Add Announcement Form */}
      {showAddForm && (
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Create New Announcement</h4>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Announcement Title *
              </label>
              <input
                type="text"
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Enter announcement title"
                required
              />
            </div>

            <div>
              <label htmlFor="target" className="block text-sm font-medium text-gray-700 mb-2">
                Target Audience *
              </label>
              <select
                id="target"
                value={formData.target}
                onChange={(e) => setFormData({ ...formData, target: e.target.value as any })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              >
                <option value="teachers">Teachers Only</option>
                <option value="public">Public Only</option>
                <option value="both">Teachers & Public</option>
              </select>
            </div>

            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                Announcement Content *
              </label>
              <textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Write your announcement content here..."
                required
              />
            </div>

            <div className="flex items-center space-x-4">
              <button
                type="submit"
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200"
              >
                Publish Announcement
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAddForm(false);
                  setFormData({ title: '', content: '', target: 'teachers' });
                }}
                className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors duration-200"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Announcements List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h4 className="text-lg font-semibold text-gray-900">
            All Announcements ({announcements.length})
          </h4>
        </div>
        
        {announcements.length === 0 ? (
          <div className="p-8 text-center">
            <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No announcements yet</p>
            <p className="text-gray-400 text-sm">Click "New Announcement" to get started</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {announcements
              .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
              .map((announcement) => (
                <div key={announcement.id} className="px-6 py-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h5 className="text-lg font-medium text-gray-900">{announcement.title}</h5>
                        <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getTargetColor(announcement.target)}`}>
                          {getTargetIcon(announcement.target)}
                          <span className="capitalize">{announcement.target}</span>
                        </span>
                      </div>
                      
                      <p className="text-gray-700 mb-3 leading-relaxed">{announcement.content}</p>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>By {announcement.author}</span>
                        <span>{new Date(announcement.createdAt).toLocaleDateString()}</span>
                        <span>{new Date(announcement.createdAt).toLocaleTimeString()}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={() => handleDeleteAnnouncement(announcement.id)}
                        className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors duration-200"
                        title="Delete announcement"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminAnnouncements;
