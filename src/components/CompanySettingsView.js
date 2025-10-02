import React, { useEffect, useCallback } from 'react';
import { 
  handleThemeChange, 
  toggleDarkMode, 
  handleLogoUpload, 
  removeLogo, 
  saveCompanySettings,
  getThemeClasses 
} from '../lib/utils';

// COMPONENTE CONFIGURACIÓN DE EMPRESA
const CompanySettingsView = () => {
  const currentTheme = getThemeClasses(theme, darkMode);
  
  // Inicializar editingCompany con los datos de la empresa
  useEffect(() => {
    if (data.company && !editingCompany) {
      setEditingCompany({ ...data.company });
    }
  }, []);

// Función para manejar cambios en los inputs con validación
const handleCompanyChange = useCallback((field, value) => {
  setEditingCompany(prev => {
    let processedValue = value;
    
    // Formatear RUT automáticamente
    if (field === 'rut') {
      processedValue = formatRut(value);
    }
    
    return { ...prev, [field]: processedValue };
  });
}, []);

  // Función para guardar - actualiza el estado y luego usa la función de utils
const handleSaveCompany = useCallback(() => {
  if (!editingCompany) return;
  
  // Validar RUT si existe
  if (editingCompany.rut && !validateRut(editingCompany.rut)) {
    showNotification('RUT inválido', 'error');
    return;
  }
  
  // Validar Email si existe
  if (editingCompany.email && !validateEmail(editingCompany.email)) {
    showNotification('Email inválido', 'error');
    return;
  }
  
  // Actualizar el estado local
  setData(prev => ({ ...prev, company: editingCompany }));
  
  // Guardar usando la función de utils
  saveCompanySettings({ ...data, company: editingCompany }, theme, darkMode);
}, [editingCompany, data, theme, darkMode]);
  
  return (
    <div className={`flex-1 p-8 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="mb-8">
        <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Configuración de Empresa
        </h1>
        <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} mt-2`}>
          Administra la información de tu empresa y personalización
        </p>
      </div>

      {/* INFORMACIÓN DE LA EMPRESA */}
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'} p-6 mb-6`}>
        <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
          Información de la Empresa
        </h2>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                Razón Social
              </label>
              <input
                type="text"
                value={editingCompany?.razonSocial || ''}
                onChange={(e) => handleCompanyChange('razonSocial', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${currentTheme.focus} ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                placeholder="Ingrese razón social"
              />
            </div>
            <div>
              <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                RUT
              </label>
              <input
                type="text"
                value={editingCompany?.rut || ''}
                onChange={(e) => handleCompanyChange('rut', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${currentTheme.focus} ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                placeholder="12.345.678-9"
              />
            </div>
          </div>

          <div>
            <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
              Dirección
            </label>
            <input
              type="text"
              value={editingCompany?.direccion || ''}
              onChange={(e) => handleCompanyChange('direccion', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${currentTheme.focus} ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
              placeholder="Ingrese dirección"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                Ciudad
              </label>
              <input
                type="text"
                value={editingCompany?.ciudad || ''}
                onChange={(e) => handleCompanyChange('ciudad', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${currentTheme.focus} ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                placeholder="Ingrese ciudad"
              />
            </div>
            <div>
              <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                Región
              </label>
              <input
                type="text"
                value={editingCompany?.region || ''}
                onChange={(e) => handleCompanyChange('region', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${currentTheme.focus} ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                placeholder="Ingrese región"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                Teléfono
              </label>
              <input
                type="tel"
                value={editingCompany?.telefono || ''}
                onChange={(e) => handleCompanyChange('telefono', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${currentTheme.focus} ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                placeholder="+56 9 1234 5678"
              />
            </div>
            <div>
              <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                Email
              </label>
              <input
                type="email"
                value={editingCompany?.email || ''}
                onChange={(e) => handleCompanyChange('email', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${currentTheme.focus} ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                placeholder="contacto@empresa.cl"
              />
            </div>
          </div>

          {/* BOTÓN GUARDAR */}
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={handleSaveCompany}
              className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${currentTheme.buttonBg} ${currentTheme.buttonHover} focus:outline-none focus:ring-2 focus:ring-offset-2 ${currentTheme.focus} transition-colors`}
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
              </svg>
              Guardar Configuración
            </button>
          </div>
        </div>
      </div>
    
      {/* PERSONALIZACIÓN Y BRANDING */}
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'} p-6`}>
        <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-6`}>
          Personalización y Branding
        </h2>
        
        <div className="space-y-6">
          {/* LOGO DE LA EMPRESA */}
          <div>
            <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-3`}>
              Logo de la Empresa
            </label>
            <div className="flex items-start space-x-4">
              {/* Preview del logo */}
              <div className={`w-24 h-24 border-2 border-dashed rounded-lg flex items-center justify-center ${darkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-300 bg-gray-50'}`}>
                {data.company?.logo || newCompanyLogo ? (
                  <img 
                    src={newCompanyLogo || data.company.logo} 
                    alt="Logo empresa" 
                    className="w-full h-full object-contain rounded-lg"
                  />
                ) : (
                  <div className={`text-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    <svg className="w-8 h-8 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-xs">Sin logo</span>
                  </div>
                )}
              </div>
              
              {/* Controles del logo */}
              <div className="flex-1">
                <div className="flex space-x-3">
                  <label className={`cursor-pointer inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white ${currentTheme.buttonBg} ${currentTheme.buttonHover} focus:outline-none focus:ring-2 focus:ring-offset-2 ${currentTheme.focus} transition-colors`}>
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    Subir Logo
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleLogoUpload(e, setNewCompanyLogo, setData)}
                      className="hidden"
                    />
                  </label>
                  
                  {(data.company?.logo || newCompanyLogo) && (
                    <button
                      onClick={() => removeLogo(setNewCompanyLogo, setData)}
                      className={`px-4 py-2 border text-sm font-medium rounded-md transition-colors ${darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                    >
                      Remover
                    </button>
                  )}
                </div>
                <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} mt-2`}>
                  Formatos soportados: JPG, PNG, GIF, WebP. Tamaño máximo: 5MB
                </p>
              </div>
            </div>
          </div>

          {/* SELECTOR DE TEMA */}
          <div>
            <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-3`}>
              Tema de Colores
            </label>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => handleThemeChange('blue', setTheme, setData)}
                className={`w-12 h-12 rounded-lg border-2 transition-all bg-blue-600 hover:scale-105 ${
                  theme === 'blue' 
                    ? 'border-blue-600 ring-2 ring-blue-500 ring-opacity-50' 
                    : darkMode ? 'border-gray-600' : 'border-gray-300'
                }`}
                title="Tema Azul"
              />
              <button
                onClick={() => handleThemeChange('green', setTheme, setData)}
                className={`w-12 h-12 rounded-lg border-2 transition-all bg-green-600 hover:scale-105 ${
                  theme === 'green' 
                    ? 'border-green-600 ring-2 ring-green-500 ring-opacity-50' 
                    : darkMode ? 'border-gray-600' : 'border-gray-300'
                }`}
                title="Tema Verde"
              />
              <button
                onClick={() => handleThemeChange('purple', setTheme, setData)}
                className={`w-12 h-12 rounded-lg border-2 transition-all bg-purple-600 hover:scale-105 ${
                  theme === 'purple' 
                    ? 'border-purple-600 ring-2 ring-purple-500 ring-opacity-50' 
                    : darkMode ? 'border-gray-600' : 'border-gray-300'
                }`}
                title="Tema Morado"
              />
              <button
                onClick={() => handleThemeChange('red', setTheme, setData)}
                className={`w-12 h-12 rounded-lg border-2 transition-all bg-red-600 hover:scale-105 ${
                  theme === 'red' 
                    ? 'border-red-600 ring-2 ring-red-500 ring-opacity-50' 
                    : darkMode ? 'border-gray-600' : 'border-gray-300'
                }`}
                title="Tema Rojo"
              />
              <button
                onClick={() => handleThemeChange('gray', setTheme, setData)}
                className={`w-12 h-12 rounded-lg border-2 transition-all bg-gray-600 hover:scale-105 ${
                  theme === 'gray' 
                    ? 'border-gray-600 ring-2 ring-gray-500 ring-opacity-50' 
                    : darkMode ? 'border-gray-600' : 'border-gray-300'
                }`}
                title="Tema Gris"
              />
            </div>
            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} mt-2`}>
              Tema actual: <span className="capitalize font-medium">{theme}</span>
            </p>
          </div>

          {/* MODO OSCURO */}
          <div className="flex items-center justify-between">
            <div>
              <label className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Modo Oscuro
              </label>
              <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} mt-1`}>
                Activa el tema oscuro para una experiencia visual más cómoda
              </p>
            </div>
            <button
              onClick={() => toggleDarkMode(darkMode, setDarkMode)}
              className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 ${currentTheme.focus} focus:ring-offset-2 ${
                darkMode ? currentTheme.buttonBg : 'bg-gray-200'
              }`}
            >
              <span className="sr-only">Activar modo oscuro</span>
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  darkMode ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* BOTÓN GUARDAR */}
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={() => saveCompanySettings(data, theme, darkMode)}
              className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${currentTheme.buttonBg} ${currentTheme.buttonHover} focus:outline-none focus:ring-2 focus:ring-offset-2 ${currentTheme.focus} transition-colors`}
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
              </svg>
              Guardar Configuración
            </button>
          </div>
          </div>
      </div>
    </div>
  );
};
export default CompanySettingsView;
