import React, { useState } from 'react';
import { BarChart3, FileText, Users, Settings, Building2, LogOut, User, Wrench, DollarSign, MoreHorizontal } from 'lucide-react';
import { getThemeClasses } from '../../lib/utils.js';

const MobileNav = ({ currentView, setCurrentView, theme, darkMode, handleLogout, userProfile, userRole }) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const currentTheme = getThemeClasses(theme, darkMode);

  // Items principales (más usados)
  const mainNavItems = [
    { id: 'dashboard', icon: BarChart3, label: 'Inicio' },
    { id: 'quotations', icon: FileText, label: 'Cotizaciones' },
    { id: 'clients', icon: Users, label: 'Clientes' }
  ];

  // Items secundarios (en menú "Más")
  const moreNavItems = [
    { id: 'paymentStatus', icon: DollarSign, label: 'Estado de Pago' },
    { id: 'services', icon: Settings, label: 'Servicios' },
    { id: 'maintenance', icon: Wrench, label: 'Mantenimiento' },
    { id: 'company', icon: Building2, label: 'Empresa' }
  ];

  const handleLogoutMobile = () => {
    setShowUserMenu(false);
    handleLogout();
  };

  return (
    <>
      {/* More Menu Overlay */}
      {showMoreMenu && (
        <div className="md:hidden fixed inset-0 z-40 bg-black bg-opacity-50" onClick={() => setShowMoreMenu(false)}>
          <div className={`absolute bottom-16 left-0 right-0 mx-4 rounded-lg shadow-lg ${
            darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          } border`}>
            <div className="p-2">
              <div className={`px-4 py-3 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Más opciones
                </h3>
              </div>
              {moreNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentView === item.id;
                
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setCurrentView(item.id);
                      setShowMoreMenu(false);
                    }}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? `${currentTheme.bg} ${currentTheme.text}`
                        : `${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* User Menu Overlay */}
      {showUserMenu && (
        <div className="md:hidden fixed inset-0 z-40 bg-black bg-opacity-50" onClick={() => setShowUserMenu(false)}>
          <div className={`absolute bottom-16 left-0 right-0 mx-4 rounded-lg shadow-lg ${
            darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          } border`}>
            <div className="p-4">
              {/* User Info */}
              <div className="flex items-center space-x-3 mb-4 pb-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}">
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
        <div className="flex justify-around items-center h-16 px-1">
          {/* Items principales */}
          {mainNavItems.map((item) => {
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
          
          {/* More Menu Button */}
          <button
            onClick={() => setShowMoreMenu(!showMoreMenu)}
            className={`flex flex-col items-center justify-center flex-1 h-full space-y-1 transition-colors ${
              showMoreMenu || moreNavItems.some(item => item.id === currentView)
                ? `${currentTheme.text}`
                : `${darkMode ? 'text-gray-400' : 'text-gray-600'}`
            }`}
          >
            <div className={`relative ${showMoreMenu ? 'transform scale-110' : ''}`}>
              <MoreHorizontal className="w-6 h-6" />
              {moreNavItems.some(item => item.id === currentView) && (
                <div className={`absolute -top-1 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full ${
                  theme === 'blue' ? 'bg-blue-600' :
                  theme === 'green' ? 'bg-green-600' :
                  theme === 'purple' ? 'bg-purple-600' :
                  theme === 'red' ? 'bg-red-600' :
                  'bg-gray-600'
                }`} />
              )}
            </div>
            <span className={`text-xs font-medium ${showMoreMenu ? 'font-semibold' : ''}`}>
              Más
            </span>
          </button>

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
              Perfil
            </span>
          </button>
        </div>
      </nav>
    </>
  );
};

export default MobileNav;
