import React, { memo, useState, useEffect } from 'react';
import { Plus, Trash2, X } from 'lucide-react';
import { getThemeClasses } from '../lib/utils.js';
import { useQuotations } from '../hooks/useQuotations';
import { useServices } from '../hooks/useServices';
import { useClients } from '../hooks/useClients';

const QuotationModal = memo(({
  isEditing,
  quotationData,
  onCancel,
  // Nuevas props para tema
  theme = 'blue',
  darkMode = false
}) => {
  const currentTheme = getThemeClasses(theme, darkMode);
  const { addQuotation, updateQuotation } = useQuotations();
  const { services } = useServices();
  const { clients } = useClients();

  // Estado local para el formulario
  const [formData, setFormData] = useState(quotationData || {
    clientName: '',
    date: new Date().toISOString().split('T')[0],
    status: 'Pendiente',
    priority: 'Media',
    items: [],
    discount: 0
  });

  // Si cambian los datos (ej: editar), los cargamos al estado
  useEffect(() => {
    setFormData(quotationData || {
      clientName: '',
      date: new Date().toISOString().split('T')[0],
      status: 'Pendiente',
      priority: 'Media',
      items: [],
      discount: 0
    });
  }, [quotationData]);

  // Calcular totales
  const calculateQuotationTotals = (items = [], discount = 0) => {
    const subtotal = items.reduce((sum, item) => sum + (item.total || 0), 0);
    const iva = subtotal * 0.19;
    const totalBruto = subtotal + iva;
    const discountAmount = totalBruto * (discount / 100);
    const total = totalBruto - discountAmount;
    return { subtotal, iva, totalBruto, discountAmount, total };
  };

  const totals = calculateQuotationTotals(formData?.items || [], formData?.discount || 0);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Agregar item
  const handleAddItem = () => {
    const newItem = {
      id: Date.now(),
      service: '',
      quantity: 1,
      unitPrice: 0,
      total: 0
    };
    setFormData(prev => ({
      ...prev,
      items: [...(prev.items || []), newItem]
    }));
  };

  // Actualizar item
  const handleUpdateItem = (itemId, field, value) => {
    console.log('handleUpdateItem called:', { itemId, field, value });
    console.log('Available services:', services);
    
    setFormData(prev => ({
      ...prev,
      items: (prev.items || []).map(item => {
        if (item.id === itemId) {
          let updatedItem = { ...item, [field]: value };
          
          // Si se cambia el servicio, actualizar el precio automáticamente
          if (field === 'service' && value) {
            const selectedService = services?.find(s => s.name === value);
            console.log('Selected service:', selectedService);
            if (selectedService) {
              updatedItem.unitPrice = selectedService.price || 0;
              console.log('Setting unitPrice to:', selectedService.price);
            }
          }
          
          // Recalcular el total siempre que cambie cantidad o precio
          if (field === 'quantity' || field === 'service') {
            updatedItem.total = (updatedItem.quantity || 1) * (updatedItem.unitPrice || 0);
            console.log('Calculated total:', updatedItem.total);
          }
          
          return updatedItem;
        }
        return item;
      })
    }));
  };

  // Remover item
  const handleRemoveItem = (itemId) => {
    setFormData(prev => ({
      ...prev,
      items: (prev.items || []).filter(item => item.id !== itemId)
    }));
  };

  // Guardar cotización en Firebase
  const handleSave = async () => {
    try {
      if (!formData.clientName) {
        alert('Por favor selecciona un cliente');
        return;
      }

      if (isEditing && formData.id) {
        await updateQuotation(formData.id, formData);
      } else {
        await addQuotation(formData);
      }
      onCancel(); // cerrar modal al terminar
    } catch (error) {
      console.error("Error al guardar cotización:", error);
      alert("Hubo un error al guardar la cotización. Inténtalo nuevamente.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto ${
        darkMode ? 'bg-gray-800' : 'bg-white'
      }`}>
        {/* HEADER DEL MODAL */}
        <div className={`sticky top-0 border-b px-6 py-4 rounded-t-xl ${
          darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <div className="flex justify-between items-center">
            <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              {isEditing ? 'Editar Cotización' : 'Nueva Cotización'}
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
          {/* CLIENTE */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Cliente *
            </label>
            <select
              value={formData?.clientName || ''}
              onChange={(e) => handleInputChange('clientName', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${currentTheme.focus} ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            >
              <option value="">Seleccionar cliente</option>
              {clients?.map(client => (
                <option key={client.id} value={client.empresa}>
                  {client.empresa}
                </option>
              ))}
            </select>
          </div>

          {/* FECHA Y ESTADO */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Fecha
              </label>
              <input
                type="date"
                value={formData?.date || ''}
                onChange={(e) => handleInputChange('date', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${currentTheme.focus} ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Estado
              </label>
              <select
                value={formData?.status || 'Pendiente'}
                onChange={(e) => handleInputChange('status', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${currentTheme.focus} ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              >
                <option value="Pendiente">Pendiente</option>
                <option value="Facturada">Facturada</option>
              </select>
            </div>
          </div>

          {/* PRIORIDAD Y DESCUENTO */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Prioridad
              </label>
              <select
                value={formData?.priority || 'Media'}
                onChange={(e) => handleInputChange('priority', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${currentTheme.focus} ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              >
                <option value="Baja">Baja</option>
                <option value="Media">Media</option>
                <option value="Alta">Alta</option>
              </select>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Descuento (%)
              </label>
              <select
                value={formData?.discount || 0}
                onChange={(e) => handleInputChange('discount', Number(e.target.value))}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${currentTheme.focus} ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
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

          {/* NOTAS */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Notas
            </label>
            <textarea
              value={formData?.notes || ''}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              rows={3}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${currentTheme.focus} ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
              }`}
              placeholder="Notas adicionales para la cotización..."
            />
          </div>

          {/* SERVICIOS */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                Servicios
              </h3>
              <button
                onClick={handleAddItem}
                className="flex items-center space-x-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Agregar</span>
              </button>
            </div>

            <div className={`rounded-lg overflow-hidden ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className={darkMode ? 'bg-gray-600' : 'bg-gray-100'}>
                    <tr>
                      <th className={`text-left py-3 px-4 text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-600'}`}>
                        Cantidad
                      </th>
                      <th className={`text-left py-3 px-4 text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-600'}`}>
                        Servicio
                      </th>
                      <th className={`text-left py-3 px-4 text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-600'}`}>
                        Precio Unit.
                      </th>
                      <th className={`text-left py-3 px-4 text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-600'}`}>
                        Total
                      </th>
                      <th className={`text-left py-3 px-4 text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-600'}`}>
                        Acción
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {(formData?.items || []).map((item, index) => (
                      <tr key={item.id || index} className={`border-t ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                        <td className="py-3 px-4">
                          <input
                            type="number"
                            value={item.quantity || 1}
                            onChange={(e) => handleUpdateItem(item.id, 'quantity', Number(e.target.value))}
                            className={`w-20 px-2 py-1 border rounded focus:outline-none focus:ring-1 ${currentTheme.focus} ${
                              darkMode 
                                ? 'bg-gray-800 border-gray-500 text-white' 
                                : 'bg-white border-gray-300 text-gray-900'
                            }`}
                            min="1"
                          />
                        </td>
                        <td className="py-3 px-4">
                          <select
                            value={item.service || ''}
                            onChange={(e) => handleUpdateItem(item.id, 'service', e.target.value)}
                            className={`w-full px-2 py-1 border rounded focus:outline-none focus:ring-1 ${currentTheme.focus} ${
                              darkMode 
                                ? 'bg-gray-800 border-gray-500 text-white' 
                                : 'bg-white border-gray-300 text-gray-900'
                            }`}
                          >
                            <option value="">Seleccionar servicio</option>
                            {(services || []).map(service => (
                              <option key={service.id} value={service.name}>
                                {service.name} - ${(service.price || 0).toLocaleString()}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className={`py-3 px-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          ${(item.unitPrice || 0).toLocaleString()}
                        </td>
                        <td className={`py-3 px-4 font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          ${(item.total || 0).toLocaleString()}
                        </td>
                        <td className="py-3 px-4">
                          <button
                            onClick={() => handleRemoveItem(item.id)}
                            className={`p-1 text-red-600 hover:text-red-800 rounded transition-colors ${
                              darkMode ? 'hover:bg-red-100 hover:bg-opacity-20' : 'hover:bg-red-100'
                            }`}
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

          {/* RESUMEN FINANCIERO */}
          <div className={`border rounded-lg p-6 ${
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
            <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              Resumen Financiero
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Subtotal:</span>
                  <span className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    ${totals.subtotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>IVA (19%):</span>
                  <span className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    ${totals.iva.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Total Bruto:</span>
                  <span className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    ${totals.totalBruto.toLocaleString()}
                  </span>
                </div>
                {totals.discountAmount > 0 && (
                  <div className="flex justify-between text-red-600 dark:text-red-400">
                    <span>Descuento ({formData?.discount || 0}%):</span>
                    <span className="font-semibold">-${totals.discountAmount.toLocaleString()}</span>
                  </div>
                )}
                <div className={`flex justify-between border-t pt-3 text-xl font-bold ${
                  darkMode ? 'border-gray-600' : 'border-gray-200'
                } ${
                  theme === 'blue' ? 'text-blue-700' :
                  theme === 'green' ? 'text-green-700' :
                  theme === 'purple' ? 'text-purple-700' :
                  theme === 'red' ? 'text-red-700' :
                  'text-gray-700'
                } ${darkMode ? 'dark:text-opacity-90' : ''}`}>
                  <span>TOTAL FINAL:</span>
                  <span>${totals.total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
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
            onClick={handleSave}
            disabled={!formData?.clientName || !formData?.projectName}
            className={`px-6 py-2 text-white rounded-lg transition-colors ${
              !formData?.clientName || !formData?.projectName
                ? 'bg-gray-400 cursor-not-allowed'
                : `${currentTheme.buttonBg} ${currentTheme.buttonHover}`
            }`}
          >
            {isEditing ? 'Actualizar' : 'Guardar'} Cotización
          </button>
        </div>
      </div>
    </div>
  );
});

export default QuotationModal;
