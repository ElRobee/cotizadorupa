import React, { memo, useState, useEffect } from 'react';
import { Plus, Trash2, X } from 'lucide-react';
import { getThemeClasses } from '../lib/utils.js';
import { useQuotations } from '../hooks/useQuotations';
import { useServices } from '../hooks/useServices';
import { useClients } from '../hooks/useClients';
import { useFichasTecnicas } from '../hooks/useFichasTecnicas';

const QuotationModal = memo(({
  isEditing,
  quotationData,
  onCancel,
  // Nuevas props para tema
  theme = 'blue',
  darkMode = false,
  currentUser,
  userProfile
}) => {
  const currentTheme = getThemeClasses(theme, darkMode);
  const { quotations, addQuotation, updateQuotation } = useQuotations();
  const { services } = useServices();
  const { clients } = useClients();
  const { fichas } = useFichasTecnicas();

  // Debug: Monitorear fichas técnicas
  useEffect(() => {
    console.log('📋 Fichas técnicas disponibles:', fichas?.length || 0, fichas);
  }, [fichas]);

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
    const discountAmount = subtotal * (discount / 100);
    const subtotalWithDiscount = subtotal - discountAmount;
    const iva = subtotalWithDiscount * 0.19;
    const total = subtotalWithDiscount + iva;
    return { subtotal, discountAmount, subtotalWithDiscount, iva, total };
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
    setFormData(prev => ({
      ...prev,
      items: (prev.items || []).map(item => {
        if (item.id === itemId) {
          let updatedItem = { ...item, [field]: value };
          
          // Si se cambia el servicio, actualizar el precio automáticamente
          if (field === 'service' && value) {
            const selectedService = services?.find(s => s.name === value);
            if (selectedService) {
              updatedItem.unitPrice = selectedService.price || 0;
            }
          }
          
          // Recalcular el total siempre que cambie cantidad o precio
          if (field === 'quantity' || field === 'service') {
            updatedItem.total = (updatedItem.quantity || 1) * (updatedItem.unitPrice || 0);
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

      if (!formData.items || formData.items.length === 0) {
        alert('Por favor agrega al menos un servicio');
        return;
      }

      // Calcular totales antes de guardar
      const totals = calculateQuotationTotals(formData.items, formData.discount);
      
      // Generar número de cotización si es nueva
      let quotationNumber = formData.number;
      if (!isEditing || !formData.number) {
        const currentYear = new Date().getFullYear();
        
        // Buscar el último número de cotización del año actual
        const currentYearQuotations = quotations?.filter(q => 
          q.number && q.number.startsWith(`COT-${currentYear}-`)
        ) || [];
        
        // Obtener el siguiente número correlativo
        let nextNumber = 1;
        if (currentYearQuotations.length > 0) {
          const lastNumbers = currentYearQuotations
            .map(q => {
              const match = q.number.match(/COT-\d{4}-(\d{3})/);
              return match ? parseInt(match[1]) : 0;
            })
            .filter(num => !isNaN(num));
          
          if (lastNumbers.length > 0) {
            nextNumber = Math.max(...lastNumbers) + 1;
          }
        }
        
        // Formatear el número con 3 dígitos (001, 002, etc.)
        const correlativo = nextNumber.toString().padStart(3, '0');
        quotationNumber = `COT-${currentYear}-${correlativo}`;
      }
      
      // Calcular fecha válida hasta (30 días desde hoy)
      const validUntilDate = new Date();
      validUntilDate.setDate(validUntilDate.getDate() + 30);
      
      // Crear objeto de cotización con todos los datos necesarios
      const quotationToSave = {
        ...formData,
        // Generar número de cotización
        number: quotationNumber,
        // Calcular fecha válida hasta
        validUntil: validUntilDate.toISOString().split('T')[0],
        // Mapear clientName a client para compatibilidad con QuotationsView
        client: formData.clientName,
        // Agregar totales calculados
        subtotal: Math.round(totals.subtotal),
        subtotalWithDiscount: Math.round(totals.subtotalWithDiscount),
        iva: Math.round(totals.iva),
        discountAmount: Math.round(totals.discountAmount),
        total: Math.round(totals.total),
        // Agregar información del usuario
        createdBy: userProfile?.username || currentUser?.displayName || 'Usuario',
        // Agregar timestamp
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      if (isEditing && formData.id) {
        await updateQuotation(formData.id, quotationToSave);
      } else {
        await addQuotation(quotationToSave);
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
                        Ficha Técnica
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
                                {service.name}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="py-3 px-4">
                          <select
                            value={item.fichaUrl || ''}
                            onChange={(e) => handleUpdateItem(item.id, 'fichaUrl', e.target.value)}
                            className={`w-full px-2 py-1 border rounded focus:outline-none focus:ring-1 ${currentTheme.focus} ${
                              darkMode 
                                ? 'bg-gray-800 border-gray-500 text-white' 
                                : 'bg-white border-gray-300 text-gray-900'
                            }`}
                          >
                            <option value="">Sin ficha técnica</option>
                            {(fichas || []).map(ficha => (
                              <option key={ficha.id} value={ficha.urlPDF}>
                                {ficha.nombre}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className={`py-3 px-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          ${Math.round(item.unitPrice || 0).toLocaleString()}
                        </td>
                        <td className={`py-3 px-4 font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          ${Math.round(item.total || 0).toLocaleString()}
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
                    ${Math.round(totals.subtotal).toLocaleString()}
                  </span>
                </div>
                {totals.discountAmount > 0 && (
                  <div className="flex justify-between text-red-600 dark:text-red-400">
                    <span>Descuento ({formData?.discount || 0}%):</span>
                    <span className="font-semibold">-${Math.round(totals.discountAmount).toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Subtotal con Desc.:</span>
                  <span className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    ${Math.round(totals.subtotalWithDiscount).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>IVA (19%):</span>
                  <span className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    ${Math.round(totals.iva).toLocaleString()}
                  </span>
                </div>
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
                  <span>${Math.round(totals.total).toLocaleString()}</span>
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
            disabled={!formData?.clientName || !formData?.items?.length}
            className={`px-6 py-2 text-white rounded-lg transition-colors ${
              !formData?.clientName || !formData?.items?.length
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
