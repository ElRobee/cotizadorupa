import React, { memo } from 'react';
import { X, AlertCircle } from 'lucide-react';
import { getThemeClasses } from '../lib/utils.js';

const ServiceModal = memo(({
  isEditing,
  serviceData,
  onCancel,
  onSave,
  onFieldChange,
  // Nuevas props para tema
  theme = 'blue',
  darkMode = false
}) => {
  const currentTheme = getThemeClasses(theme, darkMode);

  const categoryColors = {
    'General': darkMode ? 'bg-gray-600 text-gray-200' : 'bg-gray-100 text-gray-800',
    'Elevadores': darkMode ? 'bg-blue-600 text-blue-200' : 'bg-blue-100 text-blue-800',
    'Transporte': darkMode ? 'bg-green-600 text-green-200' : 'bg-green-100 text-green-800',
    'Personal': darkMode ? 'bg-purple-600 text-purple-200' : 'bg-purple-100 text-purple-800',
    'Maquinaria': darkMode ? 'bg-orange-600 text-orange-200' : 'bg-orange-100 text-orange-800',
    'Otros': darkMode ? 'bg-pink-600 text-pink-200' : 'bg-pink-100 text-pink-800'
  };

  const handleInputChange = (field, value) => {
    onFieldChange(field, value);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto ${
        darkMode ? 'bg-gray-800' : 'bg-white'
      }`}>
        {/* HEADER DEL MODAL */}
        <div className={`sticky top-0 border-b px-6 py-4 rounded-t-xl ${
          darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <div className="flex justify-between items-center">
            <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              {isEditing ? 'Editar Servicio' : 'Nuevo Servicio'}
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
          {/* NOMBRE DEL SERVICIO */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Nombre del Servicio *
            </label>
            <input
              type="text"
              value={serviceData?.name || ''}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${currentTheme.focus} ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
              }`}
              placeholder="Ej: Elevador eléctrico 10 MT"
            />
            <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Nombre descriptivo del servicio
            </p>
          </div>

          {/* PRECIO */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Precio *
            </label>
            <div className="relative">
              <span className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                $
              </span>
              <input
                type="number"
                value={serviceData?.price || ''}
                onChange={(e) => handleInputChange('price', Number(e.target.value))}
                className={`w-full pl-8 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${currentTheme.focus} ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
                placeholder="0"
                min="0"
              />
            </div>
            <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Precio en pesos chilenos (CLP)
            </p>
          </div>

          {/* CATEGORÍA */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Categoría
            </label>
            <select
              value={serviceData?.category || 'General'}
              onChange={(e) => handleInputChange('category', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${currentTheme.focus} ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            >
              <option value="General">General</option>
              <option value="Elevadores">Elevadores</option>
              <option value="Transporte">Transporte</option>
              <option value="Personal">Personal</option>
              <option value="Maquinaria">Maquinaria</option>
              <option value="Otros">Otros</option>
            </select>

            {serviceData?.category && (
              <div className="mt-2">
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${categoryColors[serviceData.category] || categoryColors.General}`}>
                  {serviceData.category}
                </span>
              </div>
            )}
          </div>

          {/* SERVICIO ACTIVO */}
          <div>
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={serviceData?.active ?? true}
                onChange={(e) => handleInputChange('active', e.target.checked)}
                className={`w-4 h-4 border rounded focus:ring-2 ${
                  theme === 'blue' ? 'text-blue-600 focus:ring-blue-500' :
                  theme === 'green' ? 'text-green-600 focus:ring-green-500' :
                  theme === 'purple' ? 'text-purple-600 focus:ring-purple-500' :
                  theme === 'red' ? 'text-red-600 focus:ring-red-500' :
                  'text-gray-600 focus:ring-gray-500'
                } ${darkMode ? 'border-gray-600' : 'border-gray-300'}`}
              />
              <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Servicio activo
              </span>
            </label>
            <p className={`text-xs mt-1 ml-7 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Solo servicios activos aparecen en las cotizaciones
            </p>
          </div>

          {/* VISTA PREVIA DEL SERVICIO */}
          {(serviceData?.name || (serviceData?.price && serviceData.price > 0)) && (
            <div className={`border rounded-lg p-4 ${
              darkMode 
                ? 'bg-gray-700 border-gray-600' 
                : 'bg-gray-50 border-gray-200'
            }`}>
              <h4 className={`text-sm font-semibold mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                Vista Previa
              </h4>
              <div className={`text-sm space-y-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {serviceData?.name && (
                  <p><strong>Servicio:</strong> {serviceData.name}</p>
                )}
                {serviceData?.price && serviceData.price > 0 && (
                  <p><strong>Precio:</strong> ${Number(serviceData.price).toLocaleString()}</p>
                )}
                {serviceData?.category && (
                  <p><strong>Categoría:</strong> {serviceData.category}</p>
                )}
                <div className="flex items-center space-x-2">
                  <strong>Estado:</strong>
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                    serviceData?.active !== false
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {serviceData?.active !== false ? 'Activo' : 'Inactivo'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* INFORMACIÓN ADICIONAL */}
          <div className={`border rounded-lg p-4 ${
            darkMode 
              ? 'bg-gray-700 border-gray-600' 
              : `${
                  theme === 'blue' ? 'bg-blue-50 border-blue-200' :
                  theme === 'green' ? 'bg-green-50 border-green-200' :
                  theme === 'purple' ? 'bg-purple-50 border-purple-200' :
                  theme === 'red' ? 'bg-red-50 border-red-200' :
                  'bg-gray-50 border-gray-200'
                }`
          }`}>
            <h4 className={`text-sm font-semibold mb-2 ${
              darkMode ? 'text-gray-200' : 
              theme === 'blue' ? 'text-blue-800' :
              theme === 'green' ? 'text-green-800' :
              theme === 'purple' ? 'text-purple-800' :
              theme === 'red' ? 'text-red-800' :
              'text-gray-800'
            }`}>
              Información Importante
            </h4>
            <ul className={`text-xs space-y-1 ${
              darkMode ? 'text-gray-300' :
              theme === 'blue' ? 'text-blue-700' :
              theme === 'green' ? 'text-green-700' :
              theme === 'purple' ? 'text-purple-700' :
              theme === 'red' ? 'text-red-700' :
              'text-gray-700'
            }`}>
              <li>• Los campos marcados con (*) son obligatorios</li>
              <li>• Solo servicios activos aparecen en cotizaciones</li>
              <li>• El precio se puede modificar después</li>
              <li>• La categoría ayuda a organizar tus servicios</li>
              <li>• Los precios se muestran con IVA incluido en las cotizaciones</li>
            </ul>
          </div>

          {/* VALIDACIONES EN TIEMPO REAL */}
          {serviceData?.price && serviceData.price <= 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 dark:bg-red-900 dark:bg-opacity-20 dark:border-red-800">
              <div className="flex items-center">
                <AlertCircle className="w-4 h-4 text-red-500 mr-2" />
                <span className="text-sm text-red-700 dark:text-red-400">
                  El precio debe ser mayor a cero
                </span>
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
                ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                : `border-${theme === 'blue' ? 'blue' : theme === 'green' ? 'green' : theme === 'purple' ? 'purple' : theme === 'red' ? 'red' : 'gray'}-300 text-${theme === 'blue' ? 'blue' : theme === 'green' ? 'green' : theme === 'purple' ? 'purple' : theme === 'red' ? 'red' : 'gray'}-700 hover:bg-${theme === 'blue' ? 'blue' : theme === 'green' ? 'green' : theme === 'purple' ? 'purple' : theme === 'red' ? 'red' : 'gray'}-50`
            }`}
          >
            Cancelar
          </button>
          <button
            onClick={onSave}
            disabled={!serviceData?.name || !serviceData?.price || serviceData.price <= 0}
            className={`px-6 py-2 text-white rounded-lg transition-colors ${
              !serviceData?.name || !serviceData?.price || serviceData.price <= 0
                ? 'bg-gray-400 cursor-not-allowed' 
                : `${currentTheme.buttonBg} ${currentTheme.buttonHover}`
            }`}
          >
            {isEditing ? 'Actualizar' : 'Guardar'} Servicio
          </button>
        </div>
      </div>
    </div>
  );
});

export default ServiceModal;
