import React from 'react';
import { 
  Search, 
  Plus, 
  Edit2, 
  Trash2, 
  MessageCircle,
  Users,
  Mail,
  Phone,
  MapPin
} from 'lucide-react';
import { getThemeClasses } from '../lib/utils';

const ClientsView = ({
  data,
  searchTerm,
  onSearchChange,
  getFilteredClients,
  startEdit,
  deleteItem,
  setModalType,
  setShowModal,
  theme,
  darkMode
}) => {
  const currentTheme = getThemeClasses(theme, darkMode);
  
  return (
    <div className={`flex-1 p-4 md:p-8 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* HEADER DE LA VISTA */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 md:mb-8 space-y-4 md:space-y-0">
        <div>
          <h1 className={`text-2xl md:text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Clientes
          </h1>
          <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} mt-2 text-sm md:text-base`}>
            Gestiona tu base de clientes
          </p>
        </div>
        <button
          onClick={() => {
            setModalType('client');
            setShowModal(true);
          }}
          className={`flex items-center justify-center space-x-2 px-4 py-2 text-white rounded-lg transition-colors ${currentTheme.buttonBg} ${currentTheme.buttonHover} w-full md:w-auto`}
        >
          <Plus className="w-4 h-4" />
          <span>Nuevo Cliente</span>
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
              onChange={onSearchChange}
              placeholder="Buscar clientes..."
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
                  RUT
                </th>
                <th className={`text-left py-4 px-6 text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Empresa
                </th>
                <th className={`text-left py-4 px-6 text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Encargado
                </th>
                <th className={`text-left py-4 px-6 text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Email
                </th>
                <th className={`text-left py-4 px-6 text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Teléfono
                </th>
                <th className={`text-left py-4 px-6 text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Ciudad
                </th>
                <th className={`text-left py-4 px-6 text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {getFilteredClients().map(client => (
                <tr 
                  key={client.id} 
                  className={`border-t transition-colors ${
                    darkMode 
                      ? 'border-gray-700 hover:bg-gray-700' 
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <td className={`py-4 px-6 font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {client.rut}
                  </td>
                  <td className={`py-4 px-6 font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {client.empresa}
                  </td>
                  <td className={`py-4 px-6 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {client.encargado}
                  </td>
                  <td className={`py-4 px-6 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    <a 
                      href={`mailto:${client.email}`}
                      className={`transition-colors ${
                        theme === 'blue' ? 'text-blue-600 hover:text-blue-800' :
                        theme === 'green' ? 'text-green-600 hover:text-green-800' :
                        theme === 'purple' ? 'text-purple-600 hover:text-purple-800' :
                        theme === 'red' ? 'text-red-600 hover:text-red-800' :
                        'text-gray-600 hover:text-gray-800'
                      } ${darkMode ? 'hover:text-opacity-80' : ''}`}
                      title={`Enviar email a ${client.email}`}
                    >
                      {client.email}
                    </a>
                  </td>
                  <td className={`py-4 px-6 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    <a 
                      href={`tel:${client.telefono}`}
                      className={`transition-colors ${
                        theme === 'blue' ? 'text-blue-600 hover:text-blue-800' :
                        theme === 'green' ? 'text-green-600 hover:text-green-800' :
                        theme === 'purple' ? 'text-purple-600 hover:text-purple-800' :
                        theme === 'red' ? 'text-red-600 hover:text-red-800' :
                        'text-gray-600 hover:text-gray-800'
                      } ${darkMode ? 'hover:text-opacity-80' : ''}`}
                      title={`Llamar a ${client.telefono}`}
                    >
                      {client.telefono}
                    </a>
                  </td>
                  <td className={`py-4 px-6 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {client.ciudad}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => startEdit('client', client)}
                        className={`p-1 rounded transition-colors ${
                          theme === 'blue' ? 'text-blue-600 hover:text-blue-800 hover:bg-blue-100' :
                          theme === 'green' ? 'text-green-600 hover:text-green-800 hover:bg-green-100' :
                          theme === 'purple' ? 'text-purple-600 hover:text-purple-800 hover:bg-purple-100' :
                          theme === 'red' ? 'text-red-600 hover:text-red-800 hover:bg-red-100' :
                          'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                        } ${darkMode ? 'hover:bg-opacity-20' : ''}`}
                        title="Editar cliente"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      {client.telefono && (
                        <button
                          onClick={() => {
                            const phoneNumber = client.telefono.replace(/\D/g, '');
                            const message = `¡Hola ${client.encargado}! Te saludo desde ${data.company?.razonSocial || 'nuestra empresa'}. ¿Cómo estás?`;
                            const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
                            window.open(whatsappUrl, '_blank');
                          }}
                          className={`p-1 text-green-600 hover:text-green-800 rounded transition-colors ${
                            darkMode ? 'hover:bg-green-100 hover:bg-opacity-20' : 'hover:bg-green-100'
                          }`}
                          title="Enviar WhatsApp"
                        >
                          <MessageCircle className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => deleteItem('clients', client.id)}
                        className={`p-1 text-red-600 hover:text-red-800 rounded transition-colors ${
                          darkMode ? 'hover:bg-red-100 hover:bg-opacity-20' : 'hover:bg-red-100'
                        }`}
                        title="Eliminar cliente"
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
          {getFilteredClients().map(client => (
            <div 
              key={client.id}
              className={`p-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} last:border-b-0`}
            >
              {/* Header del Card */}
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h3 className={`font-semibold text-lg ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {client.empresa}
                  </h3>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {client.rut}
                  </p>
                </div>
              </div>

              {/* Información del Cliente */}
              <div className="space-y-2 mb-4">
                {client.encargado && (
                  <div className="flex items-center space-x-2">
                    <Users className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                    <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {client.encargado}
                    </span>
                  </div>
                )}
                {client.email && (
                  <div className="flex items-center space-x-2">
                    <Mail className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                    <a 
                      href={`mailto:${client.email}`}
                      className={`text-sm transition-colors ${
                        theme === 'blue' ? 'text-blue-600' :
                        theme === 'green' ? 'text-green-600' :
                        theme === 'purple' ? 'text-purple-600' :
                        theme === 'red' ? 'text-red-600' :
                        'text-gray-600'
                      }`}
                    >
                      {client.email}
                    </a>
                  </div>
                )}
                {client.telefono && (
                  <div className="flex items-center space-x-2">
                    <Phone className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                    <a 
                      href={`tel:${client.telefono}`}
                      className={`text-sm transition-colors ${
                        theme === 'blue' ? 'text-blue-600' :
                        theme === 'green' ? 'text-green-600' :
                        theme === 'purple' ? 'text-purple-600' :
                        theme === 'red' ? 'text-red-600' :
                        'text-gray-600'
                      }`}
                    >
                      {client.telefono}
                    </a>
                  </div>
                )}
                {client.ciudad && (
                  <div className="flex items-center space-x-2">
                    <MapPin className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                    <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {client.ciudad}, {client.region}
                    </span>
                  </div>
                )}
              </div>

              {/* Botones de Acción */}
              <div className="flex space-x-2">
                <button
                  onClick={() => startEdit('client', client)}
                  className={`flex-1 flex items-center justify-center space-x-2 py-2 rounded-lg transition-colors ${currentTheme.buttonBg} ${currentTheme.buttonHover} text-white`}
                >
                  <Edit2 className="w-4 h-4" />
                  <span className="text-sm font-medium">Editar</span>
                </button>
                {client.telefono && (
                  <button
                    onClick={() => {
                      const phoneNumber = client.telefono.replace(/\D/g, '');
                      const message = `¡Hola ${client.encargado}! Te saludo desde ${data.company?.razonSocial || 'nuestra empresa'}. ¿Cómo estás?`;
                      const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
                      window.open(whatsappUrl, '_blank');
                    }}
                    className="flex items-center justify-center px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => deleteItem('clients', client.id)}
                  className="flex items-center justify-center px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* MENSAJE CUANDO NO HAY CLIENTES */}
        {getFilteredClients().length === 0 && (
          <div className={`text-center py-12 px-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            <Users className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p className="text-lg font-medium mb-2">No hay clientes registrados</p>
            <p className="text-sm">
              {searchTerm ? 'No se encontraron clientes con ese criterio de búsqueda.' : 'Comienza agregando tu primer cliente.'}
            </p>
            {!searchTerm && (
              <button
                onClick={() => {
                  setModalType('client');
                  setShowModal(true);
                }}
                className={`mt-4 inline-flex items-center space-x-2 px-4 py-2 text-white rounded-lg transition-colors ${currentTheme.buttonBg} ${currentTheme.buttonHover}`}
              >
                <Plus className="w-4 h-4" />
                <span>Agregar Cliente</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientsView;
