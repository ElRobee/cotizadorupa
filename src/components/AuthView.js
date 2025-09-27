import React, { memo } from 'react';
import { Building2 } from 'lucide-react';
import { getThemeClasses } from '../lib/utils.js';

const AuthView = memo(({
  authMode,
  loginForm,
  onEmailChange,
  onPasswordChange,
  onLogin,
  registerForm,
  onRegisterFieldChange,
  onRegister,
  forgotForm,
  onForgotEmailChange,
  onForgotPassword,
  onSwitchMode,
  // Nuevas props para tema
  theme = 'blue',
  darkMode = false
}) => {
  const currentTheme = getThemeClasses(theme, darkMode);

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 ${
      darkMode 
        ? 'bg-gradient-to-br from-gray-900 to-gray-800' 
        : `bg-gradient-to-br ${
            theme === 'blue' ? 'from-blue-50 to-indigo-100' :
            theme === 'green' ? 'from-green-50 to-emerald-100' :
            theme === 'purple' ? 'from-purple-50 to-violet-100' :
            theme === 'red' ? 'from-red-50 to-pink-100' :
            'from-gray-50 to-slate-100'
          }`
    }`}>
      <div className={`max-w-md w-full rounded-xl shadow-2xl p-8 ${
        darkMode ? 'bg-gray-800' : 'bg-white'
      }`}>
        {/* HEADER */}
        <div className="text-center mb-8">
          <Building2 className={`w-16 h-16 mx-auto mb-4 ${
            theme === 'blue' ? 'text-blue-600' :
            theme === 'green' ? 'text-green-600' :
            theme === 'purple' ? 'text-purple-600' :
            theme === 'red' ? 'text-red-600' :
            'text-gray-600'
          }`} />
          <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            CotizApp
          </h1>
          <p className={`mt-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Sistema de Cotizaciones
          </p>
        </div>

        {/* MODO LOGIN */}
        {authMode === 'login' && (
          <div className="space-y-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Email
              </label>
              <input
                type="email"
                value={loginForm.email}
                onChange={onEmailChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${currentTheme.focus} ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
                placeholder="admin@empresa.com"
                autoComplete="email"
              />
            </div>
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Contraseña
              </label>
              <input
                type="password"
                value={loginForm.password}
                onChange={onPasswordChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${currentTheme.focus} ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
                placeholder="123456"
                autoComplete="current-password"
              />
            </div>
            <button
              onClick={onLogin}
              className={`w-full text-white py-2 rounded-lg transition-colors ${currentTheme.buttonBg} ${currentTheme.buttonHover}`}
            >
              Iniciar Sesión
            </button>
            <div className={`text-center text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              <p>Usuarios de prueba:</p>
              <p>admin@empresa.com / 123456</p>
              <p>usuario@empresa.com / 123456</p>
            </div>
            
            {/* Enlaces de navegación */}
            <div className="text-center space-y-2">
              <button
                onClick={() => onSwitchMode('register')}
                className={`block w-full text-sm transition-colors ${
                  theme === 'blue' ? 'text-blue-600 hover:text-blue-800' :
                  theme === 'green' ? 'text-green-600 hover:text-green-800' :
                  theme === 'purple' ? 'text-purple-600 hover:text-purple-800' :
                  theme === 'red' ? 'text-red-600 hover:text-red-800' :
                  'text-gray-600 hover:text-gray-800'
                } ${darkMode ? 'hover:text-opacity-80' : ''}`}
              >
                ¿No tienes cuenta? Regístrate
              </button>
              <button
                onClick={() => onSwitchMode('forgot')}
                className={`block w-full text-sm transition-colors ${
                  theme === 'blue' ? 'text-blue-600 hover:text-blue-800' :
                  theme === 'green' ? 'text-green-600 hover:text-green-800' :
                  theme === 'purple' ? 'text-purple-600 hover:text-purple-800' :
                  theme === 'red' ? 'text-red-600 hover:text-red-800' :
                  'text-gray-600 hover:text-gray-800'
                } ${darkMode ? 'hover:text-opacity-80' : ''}`}
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>
          </div>
        )}

        {/* MODO REGISTRO */}
        {authMode === 'register' && (
          <div className="space-y-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Nombre
              </label>
              <input
                type="text"
                value={registerForm.name}
                onChange={(e) => onRegisterFieldChange('name', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${currentTheme.focus} ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
                placeholder="Tu nombre completo"
              />
            </div>
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Email
              </label>
              <input
                type="email"
                value={registerForm.email}
                onChange={(e) => onRegisterFieldChange('email', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${currentTheme.focus} ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
                placeholder="tu@email.com"
              />
            </div>
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Contraseña
              </label>
              <input
                type="password"
                value={registerForm.password}
                onChange={(e) => onRegisterFieldChange('password', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${currentTheme.focus} ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
                placeholder="Contraseña"
              />
            </div>
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Confirmar Contraseña
              </label>
              <input
                type="password"
                value={registerForm.confirmPassword}
                onChange={(e) => onRegisterFieldChange('confirmPassword', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${currentTheme.focus} ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
                placeholder="Confirmar contraseña"
              />
            </div>
            <button
              onClick={onRegister}
              className={`w-full text-white py-2 rounded-lg transition-colors ${currentTheme.buttonBg} ${currentTheme.buttonHover}`}
            >
              Registrarse
            </button>
            <div className="text-center">
              <button
                onClick={() => onSwitchMode('login')}
                className={`text-sm transition-colors ${
                  theme === 'blue' ? 'text-blue-600 hover:text-blue-800' :
                  theme === 'green' ? 'text-green-600 hover:text-green-800' :
                  theme === 'purple' ? 'text-purple-600 hover:text-purple-800' :
                  theme === 'red' ? 'text-red-600 hover:text-red-800' :
                  'text-gray-600 hover:text-gray-800'
                } ${darkMode ? 'hover:text-opacity-80' : ''}`}
              >
                ¿Ya tienes cuenta? Inicia sesión
              </button>
            </div>
          </div>
        )}

        {/* MODO RECUPERAR CONTRASEÑA */}
        {authMode === 'forgot' && (
          <div className="space-y-4">
            <div className={`text-center mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              <h2 className={`text-xl font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Recuperar Contraseña
              </h2>
              <p className="text-sm">
                Ingresa tu email y te enviaremos instrucciones para recuperar tu contraseña.
              </p>
            </div>
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Email
              </label>
              <input
                type="email"
                value={forgotForm.email}
                onChange={onForgotEmailChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${currentTheme.focus} ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
                placeholder="tu@email.com"
              />
            </div>
            <button
              onClick={onForgotPassword}
              className={`w-full text-white py-2 rounded-lg transition-colors ${currentTheme.buttonBg} ${currentTheme.buttonHover}`}
            >
              Recuperar Contraseña
            </button>
            <div className="text-center">
              <button
                onClick={() => onSwitchMode('login')}
                className={`text-sm transition-colors ${
                  theme === 'blue' ? 'text-blue-600 hover:text-blue-800' :
                  theme === 'green' ? 'text-green-600 hover:text-green-800' :
                  theme === 'purple' ? 'text-purple-600 hover:text-purple-800' :
                  theme === 'red' ? 'text-red-600 hover:text-red-800' :
                  'text-gray-600 hover:text-gray-800'
                } ${darkMode ? 'hover:text-opacity-80' : ''}`}
              >
                Volver al login
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

export default AuthView;
