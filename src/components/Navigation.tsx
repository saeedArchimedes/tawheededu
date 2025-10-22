import React, { useState } from 'react';
import { Menu, X, GraduationCap, Bell } from 'lucide-react';
import { useData } from '@/contexts/DataContext';

interface NavigationProps {
  onNavigate: (section: string) => void;
  currentSection: string;
}

const Navigation: React.FC<NavigationProps> = ({ onNavigate, currentSection }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { getUnreadPublicAnnouncements } = useData();
  const unreadNewsCount = getUnreadPublicAnnouncements().length;

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'news', label: 'News', hasNotification: unreadNewsCount > 0, notificationCount: unreadNewsCount },
    { id: 'about', label: 'About' },
    { id: 'admission', label: 'Admission' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'contact', label: 'Contact' }
  ];

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <GraduationCap className="h-8 w-8 text-pink-500" /> 
            <span className="text-xl font-bold text-gray-900">Tawheed Educational Center</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`px-3 py-2 text-sm font-medium transition-colors duration-200 relative ${
                  currentSection === item.id
                    ? 'text-pink-500 border-b-2 border-pink-500'
                    : 'text-gray-700 hover:text-pink-500'
                }`}
              >
                {item.label}
                {item.hasNotification && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {item.notificationCount}
                  </span>
                )}
              </button>
            ))}
            <div className="flex items-center space-x-4 ml-8">
              <button
                onClick={() => onNavigate('login')}
                className="bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600 transition-colors duration-200"
              >
                Login
              </button>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-700 hover:text-pink-500 focus:outline-none"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.id);
                    setIsMenuOpen(false);
                  }}
                  className={`block w-full text-left px-3 py-2 text-base font-medium transition-colors duration-200 relative ${
                    currentSection === item.id
                      ? 'text-pink-500 bg-pink-50'
                      : 'text-gray-700 hover:text-pink-500 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{item.label}</span>
                    {item.hasNotification && (
                      <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {item.notificationCount}
                      </span>
                    )}
                  </div>
                </button>
              ))}
              <button
                onClick={() => {
                  onNavigate('login');
                  setIsMenuOpen(false);
                }}
                className="block w-full text-left px-3 py-2 text-base font-medium bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors duration-200 mt-4"
              >
                Login
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
