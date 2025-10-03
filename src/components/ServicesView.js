import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Plus, 
  Edit2, 
  Trash2, 
  Copy,
  Settings,
  DollarSign,
  Tag
} from 'lucide-react';
import { getThemeClasses } from '../lib/utils';
import { useServices } from '../hooks/useServices';

const ServicesView = ({
  startEdit,
  setModalType,
  setShowModal,
  theme,
  darkMode
}) => {
  const currentTheme = getThemeClasses(theme, darkMode);
  
  // 🔥 Cargar servicios desde Firebase
  const { services, loading, deleteService, updateService } = useServices();
  
  // 🔍 Estado de búsqueda
  const [searchTerm, setSearchTerm] = useState("");

  // Filtrar servicios
  const filteredServices = useMemo(() => {
    if (!services) return [];
    return services.filter((service) =>
      [service.name, service.category, service.price?.toString()]
        .filter(Boolean)
        .some((field) => field.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [services, searchTerm]);

  // Alternar estado activo/inactivo del servicio
  const toggleServiceStatus = async (serviceId, currentStatus) => {
    try {
      await updateService(serviceId, { active: !currentStatus });
    } catch (error) {
      console.error("Error al cambiar estado del servicio:", error);
      alert("Error al cambiar el estado del servicio");
    }
  };

  // Duplicar servicio
  const duplicateService = (service) => {
    const newService = {
      ...service,
      name: `${service.name} (Copia)`,
      id: undefined // Que Firebase genere un nuevo ID
    };
    startEdit('service', newService);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className={`${darkMode ? "text-gray-400" : "text-gray-600"}`}>Cargando servicios...</p>
      </div>
    );
  }
  
  return (
    <div className={`flex-1 p-4 md:p-8 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* HEADER DE LA VISTA */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 md:mb-8 space-y-4 md:space-y-0">
        <div>
          <h1 className={`text-2xl md:text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Servicios
          </h1>
          <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} mt-2 text-sm md:text-base`}>
            Gestiona tu catálogo de servicios
          </p>
        </div>
        <button
          onClick={() => {
            setModalType('service');
            setShowModal(true);
          }}
          className={`flex items-center justify-center space-x-2 px-4 py-2 text-white rounded-lg transition-colors ${currentTheme.buttonBg} ${currentTheme.buttonHover} w-full md:w-auto`}
        >
          <Plus className="w-4 h-4" />
          <span>Nuevo Servicio</span>
        </button>
      </div>

      {/* CONTENEDOR DE TABLA/CARDS */}
      <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl shadow-sm border overflow-hidden`}>
        {/* BARRA DE BÚSQUEDA */}
        <div className={`p-4 md:p-6 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="relative">
            <Search className={`w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 ${darkMode ? 'text-gray-400' : 'text-gray-400'}`} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar servicios..."
              className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${currentTheme.focus} ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
              }`}
            />
          </div>
        </div>

        {/* TABLA - SOLO DESKTOP */}
        <div className="hidden md:block overflow-x-auto">
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
              {filteredServices.map(service => (
                <tr 
                  key={service.id} 
                  className={`border-t transition-colors ${
                    darkMode 
                      ? 'border-gray-700 hover:bg-gray-700' 
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
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
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
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
                      <button
                        onClick={() => deleteService(service.id)}
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
        </div>

        {/* CARDS - SOLO MÓVIL */}
        <div className="md:hidden">
          {filteredServices.map(service => (
            <div 
              key={service.id}
              className={`p-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} last:border-b-0`}
            >
              {/* Header del Card */}
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1 pr-2">
                  <h3 className={`font-semibold text-base ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {service.name}
                  </h3>
                  {service.description && (
                    <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {service.description.length > 80 
                        ? `${service.description.substring(0, 80)}...` 
                        : service.description
                      }
                    </p>
                  )}
                </div>
                <button
                  onClick={() => toggleServiceStatus(service.id, service.active)}
                  className={`inline-flex px-2 py-1 text-xs font-medium rounded-full transition-all hover:scale-105 cursor-pointer ${
                    service.active 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {service.active ? 'Activo' : 'Inactivo'}
                </button>
              </div>

              {/* Información del Servicio */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center space-x-2">
                  <Tag className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                    theme === 'blue' ? 'bg-blue-100 text-blue-800' :
                    theme === 'green' ? 'bg-green-100 text-green-800' :
                    theme === 'purple' ? 'bg-purple-100 text-purple-800' :
                    theme === 'red' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  } ${darkMode ? 'bg-opacity-20' : ''}`}>
                    {service.category}
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
                    ${service.price.toLocaleString()}
                  </span>
                  {service.unit && (
                    <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      /{service.unit}
                    </span>
                  )}
                </div>
              </div>

              {/* Botones de Acción */}
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => startEdit('service', service)}
                  className={`flex items-center justify-center space-x-1 py-2 rounded-lg transition-colors ${currentTheme.buttonBg} ${currentTheme.buttonHover} text-white`}
                >
                  <Edit2 className="w-4 h-4" />
                  <span className="text-sm font-medium">Editar</span>
                </button>
                <button
                  onClick={() => duplicateService(service)}
                  className={`flex items-center justify-center space-x-1 py-2 rounded-lg transition-colors ${
                    darkMode ? 'bg-gray-600 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  <Copy className={`w-4 h-4 ${darkMode ? 'text-white' : 'text-gray-700'}`} />
                  <span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-700'}`}>
                    Duplicar
                  </span>
                </button>
                <button
                  onClick={() => deleteService(service.id)}
                  className="flex items-center justify-center space-x-1 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  <span className="text-sm font-medium">Eliminar</span>
                </button>
              </div>
            </div>
          ))}

          {/* MENSAJE CUANDO NO HAY SERVICIOS */}
          {filteredServices.length === 0 && (
            <div className={`text-center py-12 px-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
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
        <div className={`px-4 md:px-6 py-4 border-t ${darkMode ? 'border-gray-700 bg-gray-750' : 'border-gray-200 bg-gray-50'}`}>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between text-sm space-y-2 md:space-y-0">
            <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
              Total de servicios: <span className="font-medium">{filteredServices.length}</span>
            </span>
            <div className="flex space-x-4">
              <span className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Activos: <span className="text-green-600 font-medium">
                  {filteredServices.filter(s => s.active).length}
                </span>
              </span>
              <span className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Inactivos: <span className="text-red-600 font-medium">
                  {filteredServices.filter(s => !s.active).length}
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
