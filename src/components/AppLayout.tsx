import React, { useState } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { AuthProvider } from '@/contexts/AuthContext';
import { DataProvider } from '@/contexts/DataContext';

// Components
import Navigation from './Navigation';
import Hero from './Hero';
import News from './News';
import About from './About';
import AdmissionForm from './AdmissionForm';
import Gallery from './Gallery';
import Contact from './Contact';
import LoginModal from './LoginModal';
import AdminDashboard from './admin/AdminDashboard';
import TeacherDashboard from './teacher/TeacherDashboard';
import SMCDashboard from './smc/SMCDashboard';
import Footer from './Footer';

const AppLayout: React.FC = () => {
  const { sidebarOpen, toggleSidebar } = useAppContext();
  const isMobile = useIsMobile();
  
  const [currentView, setCurrentView] = useState<'home' | 'admin' | 'teacher' | 'smc'>('home');
  const [currentSection, setCurrentSection] = useState('home');
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleNavigate = (section: string) => {
    if (section === 'login') {
      setShowLoginModal(true);
    } else {
      setCurrentSection(section);
    }
  };

  const handleLoginSuccess = (userRole: string) => {
    setShowLoginModal(false);
    switch (userRole) {
      case 'admin':
        setCurrentView('admin');
        break;
      case 'teacher':
        setCurrentView('teacher');
        break;
      case 'smc':
        setCurrentView('smc');
        break;
      default:
        setCurrentView('home');
    }
  };

  const handleLogout = () => {
    setCurrentView('home');
    setCurrentSection('home');
  };

  const renderHomeContent = () => {
    switch (currentSection) {
      case 'home':
        return <Hero onNavigate={handleNavigate} />;
      case 'news':
        return <News />;
      case 'about':
        return <About />;
      case 'admission':
        return <AdmissionForm />;
      case 'gallery':
        return <Gallery />;
      case 'contact':
        return <Contact />;
      default:
        return <Hero onNavigate={handleNavigate} />;
    }
  };

  return (
    <AuthProvider>
      <DataProvider>
        <div className="min-h-screen bg-gray-50">
          {currentView === 'home' && (
            <>
              <Navigation onNavigate={handleNavigate} currentSection={currentSection} />
              {renderHomeContent()}
              <Footer />
              <LoginModal 
                isOpen={showLoginModal} 
                onClose={() => setShowLoginModal(false)}
                onLoginSuccess={handleLoginSuccess}
              />
            </>
          )}
          
          {currentView === 'admin' && (
            <AdminDashboard onLogout={handleLogout} />
          )}
          
          {currentView === 'teacher' && (
            <TeacherDashboard onLogout={handleLogout} />
          )}
          
          {currentView === 'smc' && (
            <SMCDashboard onLogout={handleLogout} />
          )}
        </div>
      </DataProvider>
    </AuthProvider>
  );
};

export default AppLayout;