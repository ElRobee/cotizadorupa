import React from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  Edit2, 
  Trash2, 
  MessageCircle, 
  Mail, 
  Download,
  NotepadText,
  Calendar,
  DollarSign,
  AlertCircle
} from 'lucide-react';
import { getThemeClasses } from '../lib/utils';
import Filters from "./Filtrosdebusqueda";
import { services as allServices } from '../utils/ServicesData';
import { generateTechnicalReportPDF } from '../utils/InformePDF';

const QuotationsView = ({
  data,
  searchTerm,
  onSearchChange,
  filters,
  setFilters,
  showFilters,
  setShowFilters,
  getFilteredQuotations,
  formatDate,
  handleStatusClick,
  startEdit,
  sendViaWhatsApp,
  sendViaEmail,
  exportToPDF,
  deleteItem,
  setModalType,
  setShowModal,
  theme,
  darkMode
}) => {
  const currentTheme = getThemeClasses(theme, darkMode);
  
  const clearFilters = () => {
    setFilters({
      dateFrom: '',
      dateTo: '',
      status: '',
      priority: '',
    });
    onSearchChange({ target: { value: '' } });
  };

  const handleDownloadTechnicalReport = (quotation) => {
    generateTechnicalReportPDF(quotation, allServices);
  };

  return (
    <div className={`flex-1 p-4 md:p-8 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* HEADER DE LA VISTA */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 md:mb-8 space-y-4 md:space-y-0">
        <div>
          <h1 className={`text-2xl md:text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Cotizaciones
          </h1>
          <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} mt-2 text-sm md:text-base`}>
            Gestiona tus cotizaciones
          </p>
        </div>
        <button
          onClick={() => {
            setModalType('quotation');
            setShowModal(true);
          }}
          className={`flex items-center justify-center space-x-2 px-4 py-2 text-white rounded-lg transition-colors ${currentTheme.buttonBg} ${currentTheme.buttonHover} w-full md:w-auto`}
        >
          <Plus className="w-4 h-4" />
          <span>Nueva Cotización</span>
        </button>
      </div>

      {/* CONTENEDOR DE TABLA/CARDS */}
      <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl shadow-sm border overflow-hidden`}>
        {/* BARRA DE BÚSQUEDA Y FILTROS */}
        <div className={`p-4 md:p-6 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex flex-col md:flex-row items-stretch md:items-center space-y-3 md:space-y-0 md:space-x-4">
            <div className="flex-1 relative">
              <Search className={`w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 ${darkMode ? 'text-gray-400' : 'text-gray-400'}`} />
              <input
                type="text"
                value={searchTerm}
                onChange={onSearchChange}
                placeholder="Buscar cotizaciones..."
                className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${currentTheme.focus} ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
              />
            </div>
            <button
              onClick={() => setShowFilters(true)}
              className={`flex items-center justify-center space-x-2 px-3 py-2 border rounded-lg transition-colors ${
                darkMode 
                  ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Filter className="w-4 h-4" />
              <span>Filtros</span>
            </button>
          </div>
        </div>

        {/* TABLA - SOLO DESKTOP */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead className={darkMode ? 'bg-gray-700' : 'bg-gray-50'}>
              <tr>
                <th className={`text-left py-4 px-6 text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Número
                </th>
                <th className={`text-left py-4 px-6 text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Cliente
                </th>
                <th className={`text-left py-4 px-6 text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Fecha
                </th>
                <th className={`text-left py-4 px-6 text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Total
                </th>
                <th className={`text-left py-4 px-6 text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Estado
                </th>
                <th className={`text-left py-4 px-6 text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Prioridad
                </th>
                <th className={`text-left py-4 px-6 text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {getFilteredQuotations().map(quotation => (
                <tr 
                  key={quotation.id} 
                  className={`border-t transition-colors ${
                    darkMode 
                      ? 'border-gray-700 hover:bg-gray-700' 
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <td className={`py-4 px-6 font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {quotation.number}
                  </td>
                  <td className={`py-4 px-6 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {quotation.client}
                  </td>
                  <td className={`py-4 px-6 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {formatDate(quotation.date)}
                  </td>
                  <td className={`py-4 px-6 font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    ${quotation.total.toLocaleString()}
                  </td>
                  <td className="py-4 px-6">
                    <button
                      onClick={() => handleStatusClick(quotation)}
                      className={`inline-flex px-2 py-1 text-xs font-medium rounded-full transition-all hover:scale-105 cursor-pointer ${
                        quotation.status === 'Pendiente' ? 'bg-orange-100 text-orange-800 hover:bg-orange-200' :
                        quotation.status === 'Facturada' ? 'bg-green-100 text-green-800 hover:bg-green-200' :
                        'bg-red-100 text-red-800 hover:bg-red-200'
                      }`}
                      title={`Click para cambiar estado (Actual: ${quotation.status})`}
                    >
                      {quotation.status}
                    </button>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      quotation.priority === 'Alta' ? 'bg-red-100 text-red-800' :
                      quotation.priority === 'Media' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {quotation.priority}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => startEdit('quotation', quotation)}
                        className={`p-1 rounded transition-colors ${
                          theme === 'blue' ? 'text-blue-600 hover:text-blue-800 hover:bg-blue-100' :
                          theme === 'green' ? 'text-green-600 hover:text-green-800 hover:bg-green-100' :
                          theme === 'purple' ? 'text-purple-600 hover:text-purple-800 hover:bg-purple-100' :
                          theme === 'red' ? 'text-red-600 hover:text-red-800 hover:bg-red-100' :
                          'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                        } ${darkMode ? 'hover:bg-opacity-20' : ''}`}
                        title="Editar"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => sendViaWhatsApp(quotation)}
                        className={`p-1 text-green-600 hover:text-green-800 rounded transition-colors ${
                          darkMode ? 'hover:bg-green-100 hover:bg-opacity-20' : 'hover:bg-green-100'
                        }`}
                        title="Enviar por WhatsApp"
                      >
                        <MessageCircle className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => sendViaEmail(quotation, data)}
                        className={`p-1 text-blue-600 hover:text-blue-800 rounded transition-colors ${
                          darkMode ? 'hover:bg-blue-100 hover:bg-opacity-20' : 'hover:bg-blue-100'
                        }`}
                        title="Enviar por Email"
                      >
                        <Mail className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => exportToPDF(quotation)}
                        className={`p-1 text-purple-600 hover:text-purple-800 rounded transition-colors ${
                          darkMode ? 'hover:bg-purple-100 hover:bg-opacity-20' : 'hover:bg-purple-100'
                        }`}
                        title="Exportar a PDF"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDownloadTechnicalReport(quotation)}
                        className={`p-1 text-gray-600 hover:text-gray-800 rounded transition-colors ${
                          darkMode ? 'hover:bg-gray-100 hover:bg-opacity-20' : 'hover:bg-gray-100'
                        }`}
                        title="Descargar Informe Técnico"
                      >
                        <NotepadText className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteItem('quotations', quotation.id)}
                        className={`p-1 text-red-600 hover:text-red-800 rounded transition-colors ${
                          darkMode ? 'hover:bg-red-100 hover:bg-opacity-20' : 'hover:bg-red-100'
                        }`}
                        title="Eliminar"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* CARDS - SOLO MÓVIL */}
        <div className="md:hidden">
          {getFilteredQuotations().map(quotation => (
            <div 
              key={quotation.id}
              className={`p-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} last:border-b-0`}
            >
              {/* Header del Card */}
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h3 className={`font-semibold text-base ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {quotation.number}
                  </h3>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {quotation.client}
                  </p>
                </div>
                <button
                  onClick={() => handleStatusClick(quotation)}
                  className={`inline-flex px-2 py-1 text-xs font-medium rounded-full transition-all hover:scale-105 cursor-pointer ${
                    quotation.status === 'Pendiente' ? 'bg-orange-100 text-orange-800' :
                    quotation.status === 'Facturada' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  }`}
                >
                  {quotation.status}
                </button>
              </div>

              {/* Información de la Cotización */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Calendar className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                    <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {formatDate(quotation.date)}
                    </span>
                  </div>
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                    quotation.priority === 'Alta' ? 'bg-red-100 text-red-800' :
                    quotation.priority === 'Media' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {quotation.priority}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <DollarSign className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                  <span className={`text-lg font-bold ${
                    theme === 'blue' ? 'text-blue-600' :
                    theme === 'green' ? 'text-green-600' :
                    theme === 'purple' ? 'text-purple-600' :
                    theme === 'red' ? 'text-red-600' :
                    'text-gray-600'
                  }`}>
                    ${quotation.total.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Botones de Acción - Grid 2 filas */}
              <div className="space-y-2">
                {/* Primera fila: Editar y WhatsApp */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => startEdit('quotation', quotation)}
                    className={`flex items-center justify-center space-x-2 py-2 rounded-lg transition-colors ${currentTheme.buttonBg} ${currentTheme.buttonHover} text-white`}
                  >
                    <Edit2 className="w-4 h-4" />
                    <span className="text-sm font-medium">Editar</span>
                  </button>
                  <button
                    onClick={() => sendViaWhatsApp(quotation)}
                    className="flex items-center justify-center space-x-2 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span className="text-sm font-medium">WhatsApp</span>
                  </button>
                </div>
                
                {/* Segunda fila: Email, PDF, Informe, Eliminar */}
                <div className="grid grid-cols-4 gap-2">
                  <button
                    onClick={() => sendViaEmail(quotation, data)}
                    className={`flex items-center justify-center p-2 rounded-lg transition-colors ${
                      darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-100 hover:bg-blue-200'
                    }`}
                    title="Email"
                  >
                    <Mail className={`w-4 h-4 ${darkMode ? 'text-white' : 'text-blue-600'}`} />
                  </button>
                  <button
                    onClick={() => exportToPDF(quotation)}
                    className={`flex items-center justify-center p-2 rounded-lg transition-colors ${
                      darkMode ? 'bg-purple-600 hover:bg-purple-700' : 'bg-purple-100 hover:bg-purple-200'
                    }`}
                    title="PDF"
                  >
                    <Download className={`w-4 h-4 ${darkMode ? 'text-white' : 'text-purple-600'}`} />
                  </button>
                  <button
                    onClick={() => handleDownloadTechnicalReport(quotation)}
                    className={`flex items-center justify-center p-2 rounded-lg transition-colors ${
                      darkMode ? 'bg-gray-600 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                    title="Informe"
                  >
                    <NotepadText className={`w-4 h-4 ${darkMode ? 'text-white' : 'text-gray-600'}`} />
                  </button>
                  <button
                    onClick={() => deleteItem('quotations', quotation.id)}
                    className="flex items-center justify-center p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                    title="Eliminar"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* MENSAJE CUANDO NO HAY COTIZACIONES */}
          {getFilteredQuotations().length === 0 && (
            <div className={`text-center py-12 px-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              <AlertCircle className="w-12 h-12 mx-auto mb-4 opacity-20" />
              <p className="text-lg font-medium mb-2">No hay cotizaciones</p>
              <p className="text-sm">
                {searchTerm ? 'No se encontraron cotizaciones con ese criterio.' : 'Comienza creando tu primera cotización.'}
              </p>
            </div>
          )}
        </div>
      </div>
      
      {/* FILTROS AVANZADOS MODAL */}
      <Filters
        filters={filters}
        setFilters={setFilters}
        showFilters={showFilters}
        setShowFilters={setShowFilters}
        clearFilters={clearFilters}
        theme={theme}
        darkMode={darkMode}
      />
    </div>
  );
};

export default QuotationsView;
