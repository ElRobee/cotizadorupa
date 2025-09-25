import React, { memo } from 'react';
import { Plus, Trash2, X } from 'lucide-react';

const QuotationModal = memo(({
  isEditing,
  quotationData,
  data,
  onCancel,
  onSave,
  onAddItem,
  onUpdateItem,
  onRemoveItem,
  onFieldChange,
  calculateQuotationTotals
}) => {
  const totals = calculateQuotationTotals(quotationData?.items || [], quotationData?.discount || 0);

  const handleInputChange = (field, value) => {
    onFieldChange(field, value);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-xl">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">
              {isEditing ? 'Editar Cotización' : 'Nueva Cotización'}
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Cliente *</label>
              <select
                value={quotationData?.client || ''}
                onChange={(e) => handleInputChange('client', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Seleccionar cliente</option>
                {data?.clients?.map(client => (
                  <option key={client.id} value={client.empresa}>
                    {client.empresa}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Fecha</label>
              <input
                type="date"
                value={quotationData?.date || ''}
                onChange={(e) => handleInputChange('date', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Prioridad</label>
              <select
                value={quotationData?.priority || 'Media'}
                onChange={(e) => handleInputChange('priority', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Baja">Baja</option>
                <option value="Media">Media</option>
                <option value="Alta">Alta</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Descuento (%)</label>
              <select
                value={quotationData?.discount || 0}
                onChange={(e) => handleInputChange('discount', Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={0}>0%</option>
                <option value={3}>3%</option>
                <option value={5}>5%</option>
                <option value={8}>8%</option>
                <option value={10}>10%</option>
                <option value={15}>15%</option>
                <option value={20}>20%</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Notas</label>
            <textarea
              value={quotationData?.notes || ''}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Notas adicionales para la cotización..."
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Servicios</h3>
              <button
                onClick={onAddItem}
                className="flex items-center space-x-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Agregar</span>
              </button>
            </div>

            <div className="bg-gray-50 rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Cantidad</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Servicio</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Precio Unit.</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Total</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(quotationData?.items || []).map((item, index) => (
                      <tr key={item.id || index} className="border-t border-gray-200">
                        <td className="py-3 px-4">
                          <input
                            type="number"
                            value={item.quantity || 1}
                            onChange={(e) => onUpdateItem(index, 'quantity', Number(e.target.value))}
                            className="w-20 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                            min="1"
                          />
                        </td>
                        <td className="py-3 px-4">
                          <select
                            value={item.service || ''}
                            onChange={(e) => onUpdateItem(index, 'service', e.target.value)}
                            className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                          >
                            <option value="">Seleccionar servicio</option>
                            {(data?.services || []).filter(s => s.active).map(service => (
                              <option key={service.id} value={service.name}>
                                {service.name}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="py-3 px-4 text-gray-700">
                          ${(item.unitPrice || 0).toLocaleString()}
                        </td>
                        <td className="py-3 px-4 font-semibold text-gray-900">
                          ${(item.total || 0).toLocaleString()}
                        </td>
                        <td className="py-3 px-4">
                          <button
                            onClick={() => onRemoveItem(index)}
                            className="p-1 text-red-600 hover:text-red-800 hover:bg-red-100 rounded transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Resumen Financiero</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-semibold">${totals.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">IVA (19%):</span>
                  <span className="font-semibold">${totals.iva.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Bruto:</span>
                  <span className="font-semibold">${totals.totalBruto.toLocaleString()}</span>
                </div>
                {totals.discountAmount > 0 && (
                  <div className="flex justify-between text-red-600">
                    <span>Descuento ({quotationData?.discount || 0}%):</span>
                    <span className="font-semibold">-${totals.discountAmount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between border-t pt-3 text-xl font-bold text-blue-700">
                  <span>TOTAL FINAL:</span>
                  <span>${totals.total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
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
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {isEditing ? 'Actualizar' : 'Guardar'} Cotización
          </button>
        </div>
      </div>
    </div>
  );
});

export default QuotationModal;