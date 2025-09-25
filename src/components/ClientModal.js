import React, { memo } from 'react';
import { X, AlertCircle } from 'lucide-react';

const ClientModal = memo(({
  isEditing,
  clientData,
  onCancel,
  onSave,
  onFieldChange,
  formatRut,
  validateRut,
  validateEmail
}) => {
  const handleInputChange = (field, value) => {
    onFieldChange(field, value);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-xl">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">
              {isEditing ? 'Editar Cliente' : 'Nuevo Cliente'}
            </h2>
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">RUT *</label>
              <input
                type="text"
                value={clientData?.rut || ''}
                onChange={(e) => handleInputChange('rut', formatRut(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="12.345.678-9"
              />
              <p className="text-xs text-gray-500 mt-1">Formato: 12.345.678-9</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Empresa *</label>
              <input
                type="text"
                value={clientData?.empresa || ''}
                onChange={(e) => handleInputChange('empresa', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nombre de la empresa"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Encargado</label>
              <input
                type="text"
                value={clientData?.encargado || ''}
                onChange={(e) => handleInputChange('encargado', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Persona de contacto"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={clientData?.email || ''}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="email@empresa.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Dirección</label>
            <input
              type="text"
              value={clientData?.direccion || ''}
              onChange={(e) => handleInputChange('direccion', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Dirección completa"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Ciudad</label>
              <input
                type="text"
                value={clientData?.ciudad || ''}
                onChange={(e) => handleInputChange('ciudad', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ciudad"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Región</label>
              <select
                value={clientData?.region || ''}
                onChange={(e) => handleInputChange('region', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Teléfono</label>
              <input
                type="tel"
                value={clientData?.telefono || ''}
                onChange={(e) => handleInputChange('telefono', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="+56 9 1234 5678"
              />
              <p className="text-xs text-gray-500 mt-1">Para WhatsApp</p>
            </div>
          </div>

          {/* Vista previa de datos */}
          {(clientData?.empresa || clientData?.rut) && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-gray-800 mb-2">Vista Previa</h4>
              <div className="text-sm text-gray-600 space-y-1">
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

          {/* Validaciones en tiempo real */}
          {clientData?.rut && !validateRut(clientData.rut) && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <div className="flex items-center">
                <AlertCircle className="w-4 h-4 text-red-500 mr-2" />
                <span className="text-sm text-red-700">El RUT ingresado no es válido</span>
              </div>
            </div>
          )}

          {clientData?.email && !validateEmail(clientData.email) && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <div className="flex items-center">
                <AlertCircle className="w-4 h-4 text-red-500 mr-2" />
                <span className="text-sm text-red-700">El email ingresado no es válido</span>
              </div>
            </div>
          )}
        </div>

        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onSave}
            disabled={!clientData?.rut || !clientData?.empresa}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isEditing ? 'Actualizar' : 'Guardar'} Cliente
          </button>
        </div>
      </div>
    </div>
  );
});

export default ClientModal;