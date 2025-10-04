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
    type: '',
    maxPlatformHeight_m: '',
    workingHeight_m: '',
    capacity_kg: '',
    power: '',
    weight_kg: '',
    driveType: '',
    dimensions_m: {
      length: '',
      width: '',
      stowedHeight: ''
    }
  });

  useEffect(() => {
    if (service && service.specs) {
      setFormData({
        type: service.specs.type || '',
        maxPlatformHeight_m: service.specs.maxPlatformHeight_m || '',
        workingHeight_m: service.specs.workingHeight_m || '',
        capacity_kg: service.specs.capacity_kg || '',
        power: service.specs.power || '',
        weight_kg: service.specs.weight_kg || '',
        driveType: service.specs.driveType || '',
        dimensions_m: {
          length: service.specs.dimensions_m?.length || '',
          width: service.specs.dimensions_m?.width || '',
          stowedHeight: service.specs.dimensions_m?.stowedHeight || ''
        }
      });
    } else {
      setFormData({
        type: '',
        maxPlatformHeight_m: '',
        workingHeight_m: '',
        capacity_kg: '',
        power: '',
        weight_kg: '',
        driveType: '',
        dimensions_m: {
          length: '',
          width: '',
          stowedHeight: ''
        }
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
      specs: formData
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
                Tipo de Equipo
              </label>
              <input
                type="text"
                value={formData.type}
                onChange={(e) => handleInputChange('type', e.target.value)}
                placeholder="Ej: scissor lift / plataforma tijera"
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
                Altura de Plataforma (metros)
              </label>
              <input
                type="number"
                value={formData.maxPlatformHeight_m}
                onChange={(e) => handleInputChange('maxPlatformHeight_m', Number(e.target.value))}
                placeholder="Ej: 12"
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
                Altura de Trabajo (metros)
              </label>
              <input
                type="number"
                value={formData.workingHeight_m}
                onChange={(e) => handleInputChange('workingHeight_m', Number(e.target.value))}
                placeholder="Ej: 14"
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
                Capacidad de Carga (kg)
              </label>
              <input
                type="number"
                value={formData.capacity_kg}
                onChange={(e) => handleInputChange('capacity_kg', Number(e.target.value))}
                placeholder="Ej: 500"
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
                Tipo de Motor/Energía
              </label>
              <input
                type="text"
                value={formData.power}
                onChange={(e) => handleInputChange('power', e.target.value)}
                placeholder="Ej: eléctrica / hidráulica"
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
                Peso del Equipo (kg)
              </label>
              <input
                type="number"
                value={formData.weight_kg}
                onChange={(e) => handleInputChange('weight_kg', Number(e.target.value))}
                placeholder="Ej: 2000"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${currentTheme.focus} ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
              />
            </div>
          </div>

          {/* Tipo de Tracción */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              darkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Tipo de Tracción
            </label>
            <input
              type="text"
              value={formData.driveType}
              onChange={(e) => handleInputChange('driveType', e.target.value)}
              placeholder="Ej: todoterreno / ruedas sólidas"
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${currentTheme.focus} ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
              }`}
            />
          </div>

          {/* Dimensiones */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              darkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Dimensiones (metros)
            </label>
            <div className="grid grid-cols-3 gap-2">
              <input
                type="number"
                step="0.1"
                value={formData.dimensions_m.length}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  dimensions_m: { ...prev.dimensions_m, length: Number(e.target.value) }
                }))}
                placeholder="Largo"
                className={`px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${currentTheme.focus} ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
              />
              <input
                type="number"
                step="0.1"
                value={formData.dimensions_m.width}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  dimensions_m: { ...prev.dimensions_m, width: Number(e.target.value) }
                }))}
                placeholder="Ancho"
                className={`px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${currentTheme.focus} ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
              />
              <input
                type="number"
                step="0.1"
                value={formData.dimensions_m.stowedHeight}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  dimensions_m: { ...prev.dimensions_m, stowedHeight: Number(e.target.value) }
                }))}
                placeholder="Altura"
                className={`px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${currentTheme.focus} ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
              />
            </div>
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