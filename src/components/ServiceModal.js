import React, { memo } from 'react';
import { X, AlertCircle } from 'lucide-react';

const ServiceModal = memo(({
  isEditing,
  serviceData,
  onCancel,
  onSave,
  onFieldChange
}) => {
  const categoryColors = {
    'General': 'bg-gray-100 text-gray-800',
    'Elevadores': 'bg-blue-100 text-blue-800',
    'Transporte': 'bg-green-100 text-green-800',
    'Personal': 'bg-purple-100 text-purple-800',
    'Maquinaria': 'bg-orange-100 text-orange-800',
    'Otros': 'bg-pink-100 text-pink-800'
  };

  const handleInputChange = (field, value) => {
    onFieldChange(field, value);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-xl">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">
              {isEditing ? 'Editar Servicio' : 'Nuevo Servicio'}
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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nombre del Servicio *</label>
            <input
              type="text"
              value={serviceData?.name || ''}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ej: Elevador eléctrico 10 MT"
            />
            <p className="text-xs text-gray-500 mt-1">Nombre descriptivo del servicio</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Precio *</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
              <input
                type="number"
                value={serviceData?.price || ''}
                onChange={(e) => handleInputChange('price', Number(e.target.value))}
                className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0"
                min="0"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">Precio en pesos chilenos (CLP)</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Categoría</label>
            <select
              value={serviceData?.category || 'General'}
              onChange={(e) => handleInputChange('category', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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

          <div>
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={serviceData?.active ?? true}
                onChange={(e) => handleInputChange('active', e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">Servicio activo</span>
            </label>
            <p className="text-xs text-gray-500 mt-1 ml-7">
              Solo servicios activos aparecen en las cotizaciones
            </p>
          </div>

          {/* Vista previa del servicio */}
          {(serviceData?.name || (serviceData?.price && serviceData.price > 0)) && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-gray-800 mb-2">Vista Previa</h4>
              <div className="text-sm text-gray-600 space-y-2">
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

          {/* Información adicional */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-blue-800 mb-2">Información Importante</h4>
            <ul className="text-xs text-blue-700 space-y-1">
              <li>• Los campos marcados con (*) son obligatorios</li>
              <li>• Solo servicios activos aparecen en cotizaciones</li>
              <li>• El precio se puede modificar después</li>
              <li>• La categoría ayuda a organizar tus servicios</li>
              <li>• Los precios se muestran con IVA incluido en las cotizaciones</li>
            </ul>
          </div>

          {/* Validaciones en tiempo real */}
          {serviceData?.price && serviceData.price <= 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <div className="flex items-center">
                <AlertCircle className="w-4 h-4 text-red-500 mr-2" />
                <span className="text-sm text-red-700">El precio debe ser mayor a cero</span>
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
            disabled={!serviceData?.name || !serviceData?.price || serviceData.price <= 0}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isEditing ? 'Actualizar' : 'Guardar'} Servicio
          </button>
        </div>
      </div>
    </div>
  );
});

export default ServiceModal;