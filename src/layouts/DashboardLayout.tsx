import React, { useState } from 'react';
import { Outlet, Navigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { PartyPopper, LogOut, Calendar as CalendarIcon, User, ChevronLeft, ChevronRight } from 'lucide-react';
import UserProfile from '../components/UserProfile';
import LoadingOverlay from '../components/LoadingOverlay';

const DashboardLayout: React.FC = () => {
  const { user, logout, isLoading } = useAuth();
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const handleLogout = async () => {
    await logout();
  };

  const isAdmin = user.role === 'admin';
  const calendarPath = isAdmin ? '/admin/calendar' : '/calendar';

  return (
    <LoadingOverlay isLoading={isLoading}>
      <div className="min-h-screen bg-gray-50">
        {/* Sidebar */}
        <aside 
          className={`fixed left-0 top-0 h-full bg-gradient-to-b from-indigo-600 to-purple-700 shadow-lg transition-all duration-300 z-20 ${
            isCollapsed ? 'w-16' : 'w-64'
          }`}
        >
          <div className="absolute -right-4 top-4">
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-1.5 bg-white text-indigo-600 rounded-full shadow-lg hover:bg-indigo-50 transition-all"
            >
              {isCollapsed ? (
                <ChevronRight className="w-4 h-4" />
              ) : (
                <ChevronLeft className="w-4 h-4" />
              )}
            </button>
          </div>

          <div className="p-4">
            <div className={`flex items-center gap-3 mb-6 ${isCollapsed ? 'justify-center' : ''}`}>
              <div className="bg-white/10 p-2 rounded-lg">
                <PartyPopper className="w-6 h-6 text-white" />
              </div>
              {!isCollapsed && (
                <div className="text-white">
                  <h1 className="text-lg font-bold">EventHub Pro</h1>
                  <p className="text-xs text-white/70">Sistema de Eventos</p>
                </div>
              )}
            </div>

            <nav className="space-y-2">
              <Link
                to={calendarPath}
                className={`flex items-center gap-3 px-3 py-2 text-white/80 hover:bg-white/10 rounded-lg transition-colors ${
                  isCollapsed ? 'justify-center' : ''
                } ${location.pathname === calendarPath ? 'bg-white/10' : ''}`}
              >
                <div className="min-w-[24px] flex justify-center">
                  <CalendarIcon className="w-6 h-6" />
                </div>
                {!isCollapsed && <span>Calendario</span>}
              </Link>
              <button
                onClick={() => setIsProfileOpen(true)}
                className={`flex items-center gap-3 px-3 py-2 text-white/80 hover:bg-white/10 rounded-lg transition-colors w-full ${
                  isCollapsed ? 'justify-center' : ''
                }`}
              >
                <div className="min-w-[24px] flex justify-center">
                  <User className="w-6 h-6" />
                </div>
                {!isCollapsed && <span>Mi Perfil</span>}
              </button>
            </nav>
          </div>

          <div className="absolute bottom-4 left-0 right-0 px-4">
            <button
              onClick={handleLogout}
              disabled={isLoading}
              className={`flex items-center gap-3 w-full px-3 py-2 text-white/80 hover:bg-white/10 rounded-lg transition-colors ${
                isCollapsed ? 'justify-center' : ''
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <div className="min-w-[24px] flex justify-center">
                <LogOut className="w-6 h-6" />
              </div>
              {!isCollapsed && <span>Cerrar Sesión</span>}
            </button>
          </div>
        </aside>

        {/* Main content */}
        <div 
          className={`transition-all duration-300 ${
            isCollapsed ? 'ml-16' : 'ml-64'
          } p-6`}
        >
          <Outlet />
        </div>

        {/* User Profile Modal */}
        <UserProfile isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
      </div>
    </LoadingOverlay>
  );
};

export default DashboardLayout;