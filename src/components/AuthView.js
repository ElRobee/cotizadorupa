import React, { memo } from 'react';
import { Building2 } from 'lucide-react';

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
  onSwitchMode
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <Building2 className="w-16 h-16 text-blue-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900">CotizApp</h1>
          <p className="text-gray-600 mt-2">Sistema de Cotizaciones</p>
        </div>

        {authMode === 'login' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={loginForm.email}
                onChange={onEmailChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="admin@empresa.com"
                autoComplete="email"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Contraseña</label>
              <input
                type="password"
                value={loginForm.password}
                onChange={onPasswordChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="123456"
                autoComplete="current-password"
              />
            </div>
            <button
              onClick={onLogin}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Iniciar Sesión
            </button>
            <div className="text-center text-sm text-gray-600">
              <p>Usuarios de prueba:</p>
              <p>admin@empresa.com / 123456</p>
              <p>usuario@empresa.com / 123456</p>
            </div>
          </div>
        )}

        {authMode === 'register' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nombre</label>
              <input
                type="text"
                value={registerForm.name}
                onChange={(e) => onRegisterFieldChange('name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Tu nombre completo"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={registerForm.email}
                onChange={(e) => onRegisterFieldChange('email', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="tu@email.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Contraseña</label>
              <input
                type="password"
                value={registerForm.password}
                onChange={(e) => onRegisterFieldChange('password', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Contraseña"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Confirmar Contraseña</label>
              <input
                type="password"
                value={registerForm.confirmPassword}
                onChange={(e) => onRegisterFieldChange('confirmPassword', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Confirmar contraseña"
              />
            </div>
            <button
              onClick={onRegister}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Registrarse
            </button>
            <div className="text-center">
              <button
                onClick={() => onSwitchMode('login')}
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                ¿Ya tienes cuenta? Inicia sesión
              </button>
            </div>
          </div>
        )}

        {authMode === 'forgot' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={forgotForm.email}
                onChange={onForgotEmailChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="tu@email.com"
              />
            </div>
            <button
              onClick={onForgotPassword}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Recuperar Contraseña
            </button>
            <div className="text-center">
              <button
                onClick={() => onSwitchMode('login')}
                className="text-blue-600 hover:text-blue-800 text-sm"
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