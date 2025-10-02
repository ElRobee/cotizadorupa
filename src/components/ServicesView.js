import React from 'react';
import { 
  Search, 
  Plus, 
  Edit2, 
  Trash2, 
  Copy,
  Settings
} from 'lucide-react';
import { getThemeClasses } from '../lib/utils';

const ServicesView = ({
  data,
  searchTerm,
  onSearchChange,
  getFilteredServices,
  toggleServiceStatus,
  startEdit,
  deleteItem,
  duplicateService,
  setModalType,
  setShowModal,
  theme,
  darkMode
}) => {
  const currentTheme = getThemeClasses(theme, darkMode);
  
  return (
    <div className={`flex-1 p-8 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* HEADER DE LA VISTA */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Servicios
          </h1>
          <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} mt-2`}>
            Gestiona tu catálogo de servicios
          </p>
        </div>
        <button
          onClick={() => {
            setModalType('service');
            setShowModal(true);
          }}
          className={`flex items-center space-x-2 px-4 py-2 text-white rounded-lg transition-colors ${currentTheme.buttonBg} ${currentTheme.buttonHover}`}
        >
          <Plus className="w-4 h-4" />
          <span>Nuevo Servicio</span>
        </button>
      </div>

      {/* TABLA DE SERVICIOS */}
      <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl shadow-sm border overflow-hidden`}>
        {/* BARRA DE BÚSQUEDA */}
        <div className={`p-6 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="relative">
            <Search className={`w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 ${darkMode ? 'text-gray-400' : 'text-gray-400'}`} />
            <input
              type="text"
              value={searchTerm}
              onChange={onSearchChange}
              placeholder="Buscar servicios..."
              className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${currentTheme.focus} ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
              }`}
            />
          </div>
        </div>

        {/* TABLA */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={darkMode ? 'bg-gray-700' : 'bg-gray-50'}>
              <tr>
                <th className={`text-left py-4 px-6 text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Nombre
                </th>
                <th className={`text-left py-4 px-6 text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Categoría
                </th>
                <th className={`text-left py-4 px-6 text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Precio
                </th>
                <th className={`text-left py-4 px-6 text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Estado
                </th>
                <th className={`text-left py-4 px-6 text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {getFilteredServices().map(service => (
                <tr 
                  key={service.id} 
                  className={`border-t transition-colors ${
                    darkMode 
                      ? 'border-gray-700 hover:bg-gray-700' 
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {/* Nombre del Servicio */}
                  <td className={`py-4 px-6 font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {service.name}
                    {service.description && (
                      <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {service.description.length > 60 
                          ? `${service.description.substring(0, 60)}...` 
                          : service.description
                        }
                      </p>
                    )}
                  </td>
                  
                  {/* Categoría */}
                  <td className="py-4 px-6">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      theme === 'blue' ? 'bg-blue-100 text-blue-800' :
                      theme === 'green' ? 'bg-green-100 text-green-800' :
                      theme === 'purple' ? 'bg-purple-100 text-purple-800' :
                      theme === 'red' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    } ${darkMode ? 'bg-opacity-20' : ''}`}>
                      {service.category}
                    </span>
                  </td>
                  
                  {/* Precio */}
                  <td className={`py-4 px-6 font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    <span className={`${
                      theme === 'blue' ? 'text-blue-600' :
                      theme === 'green' ? 'text-green-600' :
                      theme === 'purple' ? 'text-purple-600' :
                      theme === 'red' ? 'text-red-600' :
                      'text-gray-600'
                    } ${darkMode ? 'text-opacity-90' : ''}`}>
                      ${service.price.toLocaleString()}
                    </span>
                    {service.unit && (
                      <span className={`text-sm ml-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        /{service.unit}
                      </span>
                    )}
                  </td>
                  
                  {/* Estado (Clickeable) */}
                  <td className="py-4 px-6">
                    <button
                      onClick={() => toggleServiceStatus(service.id, service.active)}
                      className={`inline-flex px-2 py-1 text-xs font-medium rounded-full transition-all hover:scale-105 cursor-pointer ${
                        service.active 
                          ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                          : 'bg-red-100 text-red-800 hover:bg-red-200'
                      }`}
                      title={`Click para ${service.active ? 'desactivar' : 'activar'} servicio`}
                    >
                      {service.active ? 'Activo' : 'Inactivo'}
                    </button>
                  </td>
                  
                  {/* Acciones */}
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      {/* Botón Editar */}
                      <button
                        onClick={() => startEdit('service', service)}
                        className={`p-1 rounded transition-colors ${
                          theme === 'blue' ? 'text-blue-600 hover:text-blue-800 hover:bg-blue-100' :
                          theme === 'green' ? 'text-green-600 hover:text-green-800 hover:bg-green-100' :
                          theme === 'purple' ? 'text-purple-600 hover:text-purple-800 hover:bg-purple-100' :
                          theme === 'red' ? 'text-red-600 hover:text-red-800 hover:bg-red-100' :
                          'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                        } ${darkMode ? 'hover:bg-opacity-20' : ''}`}
                        title="Editar servicio"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      
                      {/* Botón Duplicar */}
                      <button
                        onClick={() => duplicateService(service)}
                        className={`p-1 rounded transition-colors ${
                          theme === 'blue' ? 'text-blue-600 hover:text-blue-800 hover:bg-blue-100' :
                          theme === 'green' ? 'text-green-600 hover:text-green-800 hover:bg-green-100' :
                          theme === 'purple' ? 'text-purple-600 hover:text-purple-800 hover:bg-purple-100' :
                          theme === 'red' ? 'text-red-600 hover:text-red-800 hover:bg-red-100' :
                          'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                        } ${darkMode ? 'hover:bg-opacity-20' : ''}`}
                        title="Duplicar servicio"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      
                      {/* Botón Eliminar */}
                      <button
                        onClick={() => deleteItem('services', service.id)}
                        className={`p-1 text-red-600 hover:text-red-800 rounded transition-colors ${
                          darkMode ? 'hover:bg-red-100 hover:bg-opacity-20' : 'hover:bg-red-100'
                        }`}
                        title="Eliminar servicio"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* MENSAJE CUANDO NO HAY SERVICIOS */}
          {getFilteredServices().length === 0 && (
            <div className={`text-center py-12 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              <Settings className="w-12 h-12 mx-auto mb-4 opacity-20" />
              <p className="text-lg font-medium mb-2">No hay servicios registrados</p>
              <p className="text-sm">
                {searchTerm ? 'No se encontraron servicios con ese criterio de búsqueda.' : 'Comienza agregando tu primer servicio.'}
              </p>
              {!searchTerm && (
                <button
                  onClick={() => {
                    setModalType('service');
                    setShowModal(true);
                  }}
                  className={`mt-4 inline-flex items-center space-x-2 px-4 py-2 text-white rounded-lg transition-colors ${currentTheme.buttonBg} ${currentTheme.buttonHover}`}
                >
                  <Plus className="w-4 h-4" />
                  <span>Agregar Servicio</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* RESUMEN DE ESTADÍSTICAS */}
        <div className={`px-6 py-4 border-t ${darkMode ? 'border-gray-700 bg-gray-750' : 'border-gray-200 bg-gray-50'}`}>
          <div className="flex items-center justify-between text-sm">
            <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
              Total de servicios: {getFilteredServices().length}
            </span>
            <div className="flex space-x-4">
              <span className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Activos: <span className="text-green-600 font-medium">
                  {getFilteredServices().filter(s => s.active).length}
                </span>
              </span>
              <span className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Inactivos: <span className="text-red-600 font-medium">
                  {getFilteredServices().filter(s => !s.active).length}
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicesView;
