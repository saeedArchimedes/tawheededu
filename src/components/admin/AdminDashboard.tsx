import React, { useState } from 'react';
import { Menu, X, Users, FileText, Upload, Bell, Calendar, MessageSquare, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import AdminAttendance from './AdminAttendance';
import AdminResources from './AdminResources';
import AdminUploads from './AdminUploads';
import AdminAnnouncements from './AdminAnnouncements';
import AdminTimetable from './AdminTimetable';
import AdminComplaints from './AdminComplaints';
import TeacherManagement from './TeacherManagement';

interface AdminDashboardProps {
  onLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
  const { currentUser, logout } = useAuth();
  const { getUnreadCounts } = useData();
  const [activeSection, setActiveSection] = useState('teachers');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const unreadCounts = getUnreadCounts();

  const menuItems = [
    { id: 'teachers', label: 'Teachers', icon: Users },
    { id: 'attendance', label: 'Attendance', icon: Users, badge: unreadCounts.attendance },
    { id: 'resources', label: 'Resources', icon: FileText },
    { id: 'uploads', label: 'Uploads', icon: Upload, badge: unreadCounts.uploads },
    { id: 'announcements', label: 'Announcements', icon: Bell },
    { id: 'timetable', label: 'Timetable', icon: Calendar },
    { id: 'complaints', label: 'Complaints', icon: MessageSquare, badge: unreadCounts.suggestions }
  ];

  const handleLogout = () => {
    logout();
    onLogout();
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'teachers':
        return <TeacherManagement />;
      case 'attendance':
        return <AdminAttendance />;
      case 'resources':
        return <AdminResources />;
      case 'uploads':
        return <AdminUploads />;
      case 'announcements':
        return <AdminAnnouncements />;
      case 'timetable':
        return <AdminTimetable />;
      case 'complaints':
        return <AdminComplaints />;
      default:
        return <TeacherManagement />;
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
          <h1 className="text-xl font-bold text-gray-900">Admin Portal</h1>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-500 hover:text-gray-700"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-4">
          <div className="bg-green-50 rounded-lg p-3 mb-6">
            <p className="text-sm text-green-800">
              Welcome, <span className="font-semibold">{currentUser?.name}</span>
            </p>
            <p className="text-xs text-green-600">Administrator</p>
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
                    ? 'bg-green-100 text-green-800 border border-green-200'
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
              {activeSection === 'teachers' ? 'Teacher Management' : activeSection}
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

export default AdminDashboard;