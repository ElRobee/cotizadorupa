import React, { memo } from 'react';
import { X, AlertCircle } from 'lucide-react';
import { getThemeClasses } from '../lib/utils.js';

const ClientModal = memo(({
  isEditing,
  clientData,
  onCancel,
  onSave,
  onFieldChange,
  formatRut,
  validateRut,
  validateEmail,
  // Nuevas props para tema
  theme = 'blue',
  darkMode = false
}) => {
  const currentTheme = getThemeClasses(theme, darkMode);

  const handleInputChange = (field, value) => {
    onFieldChange(field, value);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto ${
        darkMode ? 'bg-gray-800' : 'bg-white'
      }`}>
        {/* HEADER DEL MODAL */}
        <div className={`sticky top-0 border-b px-6 py-4 rounded-t-xl ${
          darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <div className="flex justify-between items-center">
            <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              {isEditing ? 'Editar Cliente' : 'Nuevo Cliente'}
            </h2>
            <button
              onClick={onCancel}
              className={`transition-colors ${
                darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* CONTENIDO DEL MODAL */}
        <div className="p-6 space-y-6">
          {/* RUT Y EMPRESA */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                RUT *
              </label>
              <input
                type="text"
                value={clientData?.rut || ''}
                onChange={(e) => handleInputChange('rut', formatRut(e.target.value))}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${currentTheme.focus} ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
                placeholder="12.345.678-9"
              />
              <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Formato: 12.345.678-9
              </p>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Empresa *
              </label>
              <input
                type="text"
                value={clientData?.empresa || ''}
                onChange={(e) => handleInputChange('empresa', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${currentTheme.focus} ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
                placeholder="Nombre de la empresa"
              />
            </div>
          </div>

          {/* ENCARGADO Y EMAIL */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Encargado
              </label>
              <input
                type="text"
                value={clientData?.encargado || ''}
                onChange={(e) => handleInputChange('encargado', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${currentTheme.focus} ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
                placeholder="Persona de contacto"
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Email
              </label>
              <input
                type="email"
                value={clientData?.email || ''}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${currentTheme.focus} ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
                placeholder="email@empresa.com"
              />
            </div>
          </div>

          {/* DIRECCIÓN */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Dirección
            </label>
            <input
              type="text"
              value={clientData?.direccion || ''}
              onChange={(e) => handleInputChange('direccion', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${currentTheme.focus} ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
              }`}
              placeholder="Dirección completa"
            />
          </div>

          {/* CIUDAD, REGIÓN Y TELÉFONO */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Ciudad
              </label>
              <input
                type="text"
                value={clientData?.ciudad || ''}
                onChange={(e) => handleInputChange('ciudad', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${currentTheme.focus} ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
                placeholder="Ciudad"
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Región
              </label>
              <select
                value={clientData?.region || ''}
                onChange={(e) => handleInputChange('region', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${currentTheme.focus} ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              >
                <option value="">Seleccionar región</option>
                <option value="Arica y Parinacota">Arica y Parinacota</option>
                <option value="Tarapacá">Tarapacá</option>
                <option value="Antofagasta">Antofagasta</option>
                <option value="Atacama">Atacama</option>
                <option value="Coquimbo">Coquimbo</option>
                <option value="Valparaíso">Valparaíso</option>
                <option value="Metropolitana de Santiago">Metropolitana de Santiago</option>
                <option value="O'Higgins">O'Higgins</option>
                <option value="Maule">Maule</option>
                <option value="Ñuble">Ñuble</option>
                <option value="Biobío">Biobío</option>
                <option value="Araucanía">Araucanía</option>
                <option value="Los Ríos">Los Ríos</option>
                <option value="Los Lagos">Los Lagos</option>
                <option value="Aysén">Aysén</option>
                <option value="Magallanes">Magallanes</option>  
              </select>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Teléfono
              </label>
              <input
                type="tel"
                value={clientData?.telefono || ''}
                onChange={(e) => handleInputChange('telefono', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${currentTheme.focus} ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
                placeholder="+56 9 1234 5678"
              />
              <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Para WhatsApp
              </p>
            </div>
          </div>

          {/* VISTA PREVIA DE DATOS */}
          {(clientData?.empresa || clientData?.rut) && (
            <div className={`border rounded-lg p-4 ${
              darkMode 
                ? 'bg-gray-700 border-gray-600' 
                : 'bg-gray-50 border-gray-200'
            }`}>
              <h4 className={`text-sm font-semibold mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                Vista Previa
              </h4>
              <div className={`text-sm space-y-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {clientData?.empresa && <p><strong>Empresa:</strong> {clientData.empresa}</p>}
                {clientData?.rut && <p><strong>RUT:</strong> {clientData.rut}</p>}
                {clientData?.encargado && <p><strong>Contacto:</strong> {clientData.encargado}</p>}
                {clientData?.email && <p><strong>Email:</strong> {clientData.email}</p>}
                {clientData?.telefono && <p><strong>Teléfono:</strong> {clientData.telefono}</p>}
                {(clientData?.ciudad || clientData?.region) && (
                  <p><strong>Ubicación:</strong> {[clientData.ciudad, clientData.region].filter(Boolean).join(', ')}</p>
                )}
                {clientData?.direccion && <p><strong>Dirección:</strong> {clientData.direccion}</p>}
              </div>
            </div>
          )}

          {/* VALIDACIONES EN TIEMPO REAL */}
          {clientData?.rut && !validateRut(clientData.rut) && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 dark:bg-red-900 dark:bg-opacity-20 dark:border-red-800">
              <div className="flex items-center">
                <AlertCircle className="w-4 h-4 text-red-500 mr-2" />
                <span className="text-sm text-red-700 dark:text-red-400">El RUT ingresado no es válido</span>
              </div>
            </div>
          )}

          {clientData?.email && !validateEmail(clientData.email) && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 dark:bg-red-900 dark:bg-opacity-20 dark:border-red-800">
              <div className="flex items-center">
                <AlertCircle className="w-4 h-4 text-red-500 mr-2" />
                <span className="text-sm text-red-700 dark:text-red-400">El email ingresado no es válido</span>
              </div>
            </div>
          )}
        </div>

        {/* BOTONES DE ACCIÓN */}
        <div className={`sticky bottom-0 border-t px-6 py-4 flex justify-end space-x-3 ${
          darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <button
            onClick={onCancel}
            className={`px-6 py-2 border rounded-lg transition-colors ${
              darkMode 
                ? `border-gray-600 text-gray-300 hover:bg-gray-700` 
                : `border-${theme === 'blue' ? 'blue' : theme === 'green' ? 'green' : theme === 'purple' ? 'purple' : theme === 'red' ? 'red' : 'gray'}-300 text-${theme === 'blue' ? 'blue' : theme === 'green' ? 'green' : theme === 'purple' ? 'purple' : theme === 'red' ? 'red' : 'gray'}-700 hover:bg-${theme === 'blue' ? 'blue' : theme === 'green' ? 'green' : theme === 'purple' ? 'purple' : theme === 'red' ? 'red' : 'gray'}-50`
            }`}
          >
            Cancelar
          </button>
          <button
            onClick={onSave}
            disabled={!clientData?.rut || !clientData?.empresa}
            className={`px-6 py-2 text-white rounded-lg transition-colors ${
              !clientData?.rut || !clientData?.empresa 
                ? 'bg-gray-400 cursor-not-allowed' 
                : `${currentTheme.buttonBg} ${currentTheme.buttonHover}`
            }`}
          >
            {isEditing ? 'Actualizar' : 'Guardar'} Cliente
          </button>
        </div>
      </div>
    </div>
  );
});

export default ClientModal;
