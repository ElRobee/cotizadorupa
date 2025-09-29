import React from 'react';
import { BarChart3, FileText, Users, Settings, Building2 } from 'lucide-react';
import { getThemeClasses } from '../../lib/utils.js';

const MobileNav = ({ currentView, setCurrentView, theme, darkMode }) => {
  const currentTheme = getThemeClasses(theme, darkMode);

  const navItems = [
    { id: 'dashboard', icon: BarChart3, label: 'Inicio' },
    { id: 'quotations', icon: FileText, label: 'Cotizaciones' },
    { id: 'clients', icon: Users, label: 'Clientes' },
    { id: 'services', icon: Settings, label: 'Servicios' },
    { id: 'company', icon: Building2, label: 'Empresa' }
  ];

  return (
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
      </div>
    </nav>
  );
};

export default MobileNav;
