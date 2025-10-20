import React, { useState, useEffect } from 'react';
import { X, FileBarChart, User, Calendar, DollarSign, Download, Search } from 'lucide-react';
import { useClients } from '../hooks/useClients';
import { useQuotations } from '../hooks/useQuotations';
import { useCompany } from '../hooks/useCompany';
import { generatePaymentStatusPDF } from '../utils/paymentPDF';

const PaymentModal = ({ isOpen, onClose, theme, darkMode }) => {
  const { clients } = useClients();
  const { quotations } = useQuotations();
  const { company } = useCompany();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClientId, setSelectedClientId] = useState('');
  const [selectedClient, setSelectedClient] = useState(null);
  const [pendingQuotations, setPendingQuotations] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);

  // Clases de tema
  const getThemeClasses = (theme, darkMode) => {
    const themes = {
      blue: {
        primary: 'bg-blue-600 hover:bg-blue-700 border-blue-600',
        secondary: 'bg-blue-50 border-blue-200',
        text: 'text-blue-700',
        accent: 'text-blue-600'
      },
      green: {
        primary: 'bg-green-600 hover:bg-green-700 border-green-600',
        secondary: 'bg-green-50 border-green-200',
        text: 'text-green-700',
        accent: 'text-green-600'
      },
      purple: {
        primary: 'bg-purple-600 hover:bg-purple-700 border-purple-600',
        secondary: 'bg-purple-50 border-purple-200',
        text: 'text-purple-700',
        accent: 'text-purple-600'
      },
      red: {
        primary: 'bg-red-600 hover:bg-red-700 border-red-600',
        secondary: 'bg-red-50 border-red-200',
        text: 'text-red-700',
        accent: 'text-red-600'
      }
    };
    return themes[theme] || themes.blue;
  };

  const currentTheme = getThemeClasses(theme, darkMode);

  // Filtrar clientes basado en el término de búsqueda
  const filteredClients = clients?.filter(client =>
    [client.empresa, client.encargado, client.rut, client.email, client.telefono, client.ciudad]
      .filter(Boolean)
      .some(field => field.toLowerCase().includes(searchTerm.toLowerCase()))
  ) || [];

  // Efectos para filtrar cotizaciones pendientes cuando se selecciona un cliente
  useEffect(() => {
    if (selectedClientId && quotations && filteredClients) {
      const client = filteredClients.find(c => c.id === selectedClientId);
      setSelectedClient(client);

      const clientPendingQuotations = quotations.filter(quotation => 
        quotation.client === client?.empresa && quotation.status === 'Pendiente'
      );
      
      setPendingQuotations(clientPendingQuotations);
      
      const total = clientPendingQuotations.reduce((sum, quotation) => 
        sum + (quotation.total || 0), 0
      );
      setTotalAmount(total);
    } else {
      setSelectedClient(null);
      setPendingQuotations([]);
      setTotalAmount(0);
    }
  }, [selectedClientId, quotations, filteredClients]);

  const handleGenerateReport = async () => {
    if (!selectedClient || pendingQuotations.length === 0) return;
    
    setIsGenerating(true);
    try {
      await generatePaymentStatusPDF(selectedClient, pendingQuotations, company, totalAmount);
    } catch (error) {
      console.error('Error al generar el informe:', error);
      alert('Error al generar el informe de estado de pago');
    } finally {
      setIsGenerating(false);
    }
  };

  const resetModal = () => {
    setSearchTerm('');
    setSelectedClientId('');
    setSelectedClient(null);
    setPendingQuotations([]);
    setTotalAmount(0);
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} rounded-lg shadow-xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-hidden`}>
        {/* Header */}
        <div className={`flex items-center justify-between p-6 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex items-center space-x-3">
            <FileBarChart className={`w-6 h-6 ${currentTheme.accent}`} />
            <h2 className="text-xl font-semibold">Estado de Pago por Cliente</h2>
          </div>
          <button
            onClick={handleClose}
            className={`p-2 rounded-lg hover:bg-gray-100 ${darkMode ? 'hover:bg-gray-700' : ''} transition-colors`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* Buscador de Clientes */}
          <div className="mb-6">
            <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
              Buscar Cliente
            </label>
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por empresa, encargado, RUT, email..."
                className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                } ${currentTheme.primary.includes('blue') ? 'focus:ring-blue-500' :
                     currentTheme.primary.includes('green') ? 'focus:ring-green-500' :
                     currentTheme.primary.includes('purple') ? 'focus:ring-purple-500' :
                     'focus:ring-red-500'}`}
              />
            </div>
          </div>

          {/* Selector de Cliente */}
          <div className="mb-6">
            <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
              Seleccionar Cliente
            </label>
            <select
              value={selectedClientId}
              onChange={(e) => setSelectedClientId(e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-transparent ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              } ${currentTheme.primary.includes('blue') ? 'focus:ring-blue-500' :
                   currentTheme.primary.includes('green') ? 'focus:ring-green-500' :
                   currentTheme.primary.includes('purple') ? 'focus:ring-purple-500' :
                   'focus:ring-red-500'}`}
            >
              <option value="">
                {filteredClients?.length === 0 && searchTerm 
                  ? "No se encontraron clientes..." 
                  : "Seleccione un cliente..."
                }
              </option>
              {filteredClients?.map(client => (
                <option key={client.id} value={client.id}>
                  {client.empresa} - {client.rut}
                </option>
              ))}
            </select>
          </div>

          {/* Información del Cliente Seleccionado */}
          {selectedClient && (
            <div className={`mb-6 p-4 rounded-lg border ${
              darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
            }`}>
              <div className="flex items-center space-x-2 mb-3">
                <User className={`w-5 h-5 ${currentTheme.accent}`} />
                <h3 className="font-semibold">Información del Cliente</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    <strong>Empresa:</strong> {selectedClient.empresa}
                  </p>
                  <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    <strong>RUT:</strong> {selectedClient.rut}
                  </p>
                  <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    <strong>Contacto:</strong> {selectedClient.encargado}
                  </p>
                </div>
                <div>
                  <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    <strong>Teléfono:</strong> {selectedClient.telefono}
                  </p>
                  <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    <strong>Email:</strong> {selectedClient.email}
                  </p>
                  <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    <strong>Ciudad:</strong> {selectedClient.ciudad}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Cotizaciones Pendientes */}
          {selectedClient && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold flex items-center space-x-2">
                  <Calendar className={`w-5 h-5 ${currentTheme.accent}`} />
                  <span>Cotizaciones Pendientes ({pendingQuotations.length})</span>
                </h3>
                {pendingQuotations.length > 0 && (
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                    darkMode ? 'bg-orange-900 text-orange-200' : 'bg-orange-100 text-orange-800'
                  }`}>
                    Total: ${Math.round(totalAmount).toLocaleString()}
                  </div>
                )}
              </div>

              {pendingQuotations.length === 0 ? (
                <div className={`text-center py-8 rounded-lg border-2 border-dashed ${
                  darkMode ? 'border-gray-600 text-gray-400' : 'border-gray-300 text-gray-500'
                }`}>
                  <FileBarChart className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No hay cotizaciones pendientes para este cliente</p>
                </div>
              ) : (
                <div className={`border rounded-lg overflow-hidden ${
                  darkMode ? 'border-gray-600' : 'border-gray-200'
                }`}>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className={`${
                        darkMode ? 'bg-gray-700' : 'bg-gray-50'
                      }`}>
                        <tr>
                          <th className={`px-4 py-3 text-left text-sm font-medium ${
                            darkMode ? 'text-gray-300' : 'text-gray-700'
                          }`}>
                            N° Cotización
                          </th>
                          <th className={`px-4 py-3 text-left text-sm font-medium ${
                            darkMode ? 'text-gray-300' : 'text-gray-700'
                          }`}>
                            Fecha
                          </th>
                          <th className={`px-4 py-3 text-left text-sm font-medium ${
                            darkMode ? 'text-gray-300' : 'text-gray-700'
                          }`}>
                            Válida hasta
                          </th>
                          <th className={`px-4 py-3 text-right text-sm font-medium ${
                            darkMode ? 'text-gray-300' : 'text-gray-700'
                          }`}>
                            Valor
                          </th>
                        </tr>
                      </thead>
                      <tbody className={`divide-y ${
                        darkMode ? 'divide-gray-600' : 'divide-gray-200'
                      }`}>
                        {pendingQuotations.map((quotation) => (
                          <tr key={quotation.id} className={`${
                            darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                          } transition-colors`}>
                            <td className="px-4 py-3 font-medium">
                              {quotation.number}
                            </td>
                            <td className={`px-4 py-3 text-sm ${
                              darkMode ? 'text-gray-300' : 'text-gray-600'
                            }`}>
                              {quotation.date}
                            </td>
                            <td className={`px-4 py-3 text-sm ${
                              darkMode ? 'text-gray-300' : 'text-gray-600'
                            }`}>
                              {quotation.validUntil}
                            </td>
                            <td className="px-4 py-3 text-right font-medium">
                              ${Math.round(quotation.total || 0).toLocaleString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={`flex items-center justify-between p-6 border-t ${
          darkMode ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <button
            onClick={handleClose}
            className={`px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors ${
              darkMode 
                ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                : 'border-gray-300 text-gray-700'
            }`}
          >
            Cancelar
          </button>
          
          <button
            onClick={handleGenerateReport}
            disabled={!selectedClient || pendingQuotations.length === 0 || isGenerating}
            className={`px-6 py-2 rounded-lg text-white font-medium transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed ${
              currentTheme.primary
            }`}
          >
            {isGenerating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                <span>Generando...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Generar Informe</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
