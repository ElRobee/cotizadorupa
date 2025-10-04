import React, { memo, useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { getThemeClasses } from '../lib/utils.js';

const SpecModal = memo(({
  isOpen,
  onClose,
  service,
  onSave,
  theme = 'blue',
  darkMode = false
}) => {
  const currentTheme = getThemeClasses(theme, darkMode);
  
  const [formData, setFormData] = useState({
    brand: '',
    maxHeight: '',
    verticalReach: '',
    loadCapacity: '',
    engineType: '',
    dimensions: '',
    functionality: ''
  });

  useEffect(() => {
    if (service && service.technicalInfo) {
      setFormData(service.technicalInfo);
    } else {
      setFormData({
        brand: '',
        maxHeight: '',
        verticalReach: '',
        loadCapacity: '',
        engineType: '',
        dimensions: '',
        functionality: ''
      });
    }
  }, [service]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    if (!service) return;
    
    const updatedService = {
      ...service,
      technicalInfo: formData
    };
    
    onSave(updatedService);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto ${
        darkMode ? 'bg-gray-800' : 'bg-white'
      }`}>
        {/* HEADER */}
        <div className={`sticky top-0 border-b px-6 py-4 rounded-t-xl ${
          darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <div className="flex justify-between items-center">
            <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              Especificaciones Técnicas
            </h2>
            <button
              onClick={onClose}
              className={`p-2 rounded-lg transition-colors ${
                darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
              }`}
            >
              <X className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
            </button>
          </div>
          <p className={`mt-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Servicio: <span className="font-semibold">{service?.name}</span>
          </p>
        </div>

        {/* CONTENT */}
        <div className="p-6 space-y-6">
          {/* Grid de campos técnicos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Marca
              </label>
              <input
                type="text"
                value={formData.brand}
                onChange={(e) => handleInputChange('brand', e.target.value)}
                placeholder="Ej: JLG, Genie, Haulotte"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${currentTheme.focus} ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Altura Máxima
              </label>
              <input
                type="text"
                value={formData.maxHeight}
                onChange={(e) => handleInputChange('maxHeight', e.target.value)}
                placeholder="Ej: 16 metros"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${currentTheme.focus} ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Alcance Vertical
              </label>
              <input
                type="text"
                value={formData.verticalReach}
                onChange={(e) => handleInputChange('verticalReach', e.target.value)}
                placeholder="Ej: 18 metros"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${currentTheme.focus} ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Capacidad de Carga
              </label>
              <input
                type="text"
                value={formData.loadCapacity}
                onChange={(e) => handleInputChange('loadCapacity', e.target.value)}
                placeholder="Ej: 230 kg"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${currentTheme.focus} ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Tipo de Motor
              </label>
              <input
                type="text"
                value={formData.engineType}
                onChange={(e) => handleInputChange('engineType', e.target.value)}
                placeholder="Ej: Diésel, Eléctrico, Híbrido"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${currentTheme.focus} ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Dimensiones
              </label>
              <input
                type="text"
                value={formData.dimensions}
                onChange={(e) => handleInputChange('dimensions', e.target.value)}
                placeholder="Ej: 2.5m x 1.2m x 2.0m"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${currentTheme.focus} ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
              />
            </div>
          </div>

          {/* Funcionalidad */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              darkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Funcionalidad
            </label>
            <textarea
              value={formData.functionality}
              onChange={(e) => handleInputChange('functionality', e.target.value)}
              placeholder="Describe la funcionalidad y características especiales del equipo..."
              rows={4}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${currentTheme.focus} ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
              }`}
            />
          </div>
        </div>

        {/* FOOTER */}
        <div className={`sticky bottom-0 border-t px-6 py-4 flex justify-end space-x-3 ${
          darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <button
            onClick={onClose}
            className={`px-6 py-2 border rounded-lg transition-colors ${
              darkMode 
                ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className={`px-6 py-2 text-white rounded-lg transition-colors flex items-center space-x-2 ${currentTheme.buttonBg} ${currentTheme.buttonHover}`}
          >
            <Save className="w-4 h-4" />
            <span>Guardar Especificaciones</span>
          </button>
        </div>
      </div>
    </div>
  );
});

SpecModal.displayName = 'SpecModal';

export default SpecModal;