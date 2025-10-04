import React, { useState } from 'react';
import { BarChart3, FileText, Users, Settings, Building2, LogOut, User } from 'lucide-react';
import { getThemeClasses } from '../../lib/utils.js';

const MobileNav = ({ currentView, setCurrentView, theme, darkMode, handleLogout, userProfile, userRole }) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const currentTheme = getThemeClasses(theme, darkMode);

  const navItems = [
    { id: 'dashboard', icon: BarChart3, label: 'Inicio' },
    { id: 'quotations', icon: FileText, label: 'Cotizaciones' },
    { id: 'clients', icon: Users, label: 'Clientes' },
    { id: 'services', icon: Settings, label: 'Servicios' },
    { id: 'company', icon: Building2, label: 'Empresa' }
  ];

  const handleLogoutMobile = () => {
    setShowUserMenu(false);
    handleLogout();
  };

  return (
    <>
      {/* User Menu Overlay */}
      {showUserMenu && (
        <div className="md:hidden fixed inset-0 z-40 bg-black bg-opacity-50" onClick={() => setShowUserMenu(false)}>
          <div className={`absolute bottom-16 left-0 right-0 mx-4 rounded-lg shadow-lg ${
            darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          } border`}>
            <div className="p-4">
              {/* User Info */}
              <div className="flex items-center space-x-3 mb-4 pb-4 border-b border-gray-200 dark:border-gray-600">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${currentTheme.bg}`}>
                  <User className={`w-5 h-5 ${currentTheme.text}`} />
                </div>
                <div className="flex-1">
                  <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {userProfile?.username || 'Usuario'}
                  </p>
                  <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {userRole === 'admin' ? 'Administrador' : 'Usuario'}
                  </p>
                </div>
              </div>
              
              {/* Logout Button */}
              <button
                onClick={handleLogoutMobile}
                className={`w-full flex items-center space-x-3 px-3 py-2 text-red-600 rounded-lg transition-colors ${
                  darkMode ? 'hover:bg-red-900 hover:bg-opacity-20' : 'hover:bg-red-50'
                }`}
              >
                <LogOut className="w-5 h-5" />
                <span>Cerrar Sesión</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <nav className={`md:hidden fixed bottom-0 left-0 right-0 z-50 ${
        darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      } border-t shadow-lg`}>
        <div className="flex justify-around items-center h-16 px-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`flex flex-col items-center justify-center flex-1 h-full space-y-1 transition-colors ${
                  isActive
                    ? `${currentTheme.text}`
                    : `${darkMode ? 'text-gray-400' : 'text-gray-600'}`
                }`}
              >
                <div className={`relative ${isActive ? 'transform scale-110' : ''}`}>
                  <Icon className="w-6 h-6" />
                  {isActive && (
                    <div className={`absolute -top-1 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full ${
                      theme === 'blue' ? 'bg-blue-600' :
                      theme === 'green' ? 'bg-green-600' :
                      theme === 'purple' ? 'bg-purple-600' :
                      theme === 'red' ? 'bg-red-600' :
                      'bg-gray-600'
                    }`} />
                  )}
                </div>
                <span className={`text-xs font-medium ${isActive ? 'font-semibold' : ''}`}>
                  {item.label}
                </span>
              </button>
            );
          })}
          
          {/* User Menu Button */}
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className={`flex flex-col items-center justify-center flex-1 h-full space-y-1 transition-colors ${
              showUserMenu
                ? `${currentTheme.text}`
                : `${darkMode ? 'text-gray-400' : 'text-gray-600'}`
            }`}
          >
            <div className={`relative ${showUserMenu ? 'transform scale-110' : ''}`}>
              <User className="w-6 h-6" />
              {showUserMenu && (
                <div className={`absolute -top-1 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full ${
                  theme === 'blue' ? 'bg-blue-600' :
                  theme === 'green' ? 'bg-green-600' :
                  theme === 'purple' ? 'bg-purple-600' :
                  theme === 'red' ? 'bg-red-600' :
                  'bg-gray-600'
                }`} />
              )}
            </div>
            <span className={`text-xs font-medium ${showUserMenu ? 'font-semibold' : ''}`}>
              Usuario
            </span>
          </button>
        </div>
      </nav>
    </>
  );
};

export default MobileNav;
