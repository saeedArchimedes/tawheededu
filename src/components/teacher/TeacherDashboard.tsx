import React, { useState } from 'react';
import { Menu, X, MapPin, FileText, Upload, Bell, Calendar, MessageSquare, LogOut, Settings } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import TeacherAttendance from './TeacherAttendance';
import TeacherResources from './TeacherResources';
import TeacherUploads from './TeacherUploads';
import TeacherAnnouncements from './TeacherAnnouncements';
import TeacherTimetable from './TeacherTimetable';
import TeacherSuggestions from './TeacherSuggestions';
import TeacherSettings from './TeacherSettings';

interface TeacherDashboardProps {
  onLogout: () => void;
}

const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ onLogout }) => {
  const { currentUser, logout } = useAuth();
  const { getUnreadCounts } = useData();
  const [activeSection, setActiveSection] = useState('attendance');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const unreadCounts = getUnreadCounts();

  const menuItems = [
    { id: 'attendance', label: 'Sign In', icon: MapPin },
    { id: 'resources', label: 'Resources', icon: FileText, badge: unreadCounts.resources },
    { id: 'uploads', label: 'Lesson Plans', icon: Upload },
    { id: 'announcements', label: 'Announcements', icon: Bell, badge: unreadCounts.announcements },
    { id: 'timetable', label: 'Timetable', icon: Calendar, badge: unreadCounts.timetable },
    { id: 'suggestions', label: 'Suggestions', icon: MessageSquare },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const handleLogout = () => {
    logout();
    onLogout();
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'attendance':
        return <TeacherAttendance />;
      case 'resources':
        return <TeacherResources />;
      case 'uploads':
        return <TeacherUploads />;
      case 'announcements':
        return <TeacherAnnouncements />;
      case 'timetable':
        return <TeacherTimetable />;
      case 'suggestions':
        return <TeacherSuggestions />;
      case 'settings':
        return <TeacherSettings />;
      default:
        return <TeacherAttendance />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-900">Teacher Portal</h1>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-500 hover:text-gray-700"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-4">
          <div className="bg-blue-50 rounded-lg p-3 mb-6">
            <p className="text-sm text-blue-800">
              Welcome, <span className="font-semibold">{currentUser?.name}</span>
            </p>
            <p className="text-xs text-blue-600">Teacher</p>
            {currentUser?.isFirstLogin && (
              <p className="text-xs text-orange-600 mt-1">Please update your password in Settings</p>
            )}
          </div>

          <nav className="space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveSection(item.id);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center justify-between px-4 py-3 text-left rounded-lg transition-colors duration-200 ${
                  activeSection === item.id
                    ? 'bg-blue-100 text-blue-800 border border-blue-200'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <item.icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </div>
                {item.badge && item.badge > 0 && (
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </nav>

          <div className="mt-8 pt-4 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-4 py-3 text-left text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
            >
              <LogOut className="h-5 w-5" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 lg:ml-0">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-gray-500 hover:text-gray-700"
            >
              <Menu className="h-6 w-6" />
            </button>
            <h2 className="text-2xl font-bold text-gray-900 capitalize">
              {activeSection === 'attendance' ? 'Daily Sign In' : 
               activeSection === 'uploads' ? 'Lesson Plans & Reports' :
               activeSection}
            </h2>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;