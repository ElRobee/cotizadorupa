import React from 'react';
import { 
  Search, 
  Plus, 
  Edit2, 
  Trash2, 
  MessageCircle,
  Users
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


  const clearFilters = () => {
    setFilters({
      dateFrom: '',
      dateTo: '',
      status: '',
      priority: '',
      minAmount: '',
      maxAmount: '',
      client: '',
      createdBy: ''
    });
    setSearchTerm('');
    showNotification('Filtros limpiados', 'info');
  };

  return (
const ClientsView = ({
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Clientes
          </h1>
          <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} mt-2`}>
            Gestiona tu base de clientes
          </p>
        </div>
        <button
          onClick={() => {
            setModalType('client');
            setShowModal(true);
          }}
          className={`flex items-center space-x-2 px-4 py-2 text-white rounded-lg transition-colors ${currentTheme.buttonBg} ${currentTheme.buttonHover}`}
        >
          <Plus className="w-4 h-4" />
          <span>Nuevo Cliente</span>
        </button>
      </div>

      {/* TABLA DE CLIENTES */}
      <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl shadow-sm border overflow-hidden`}>
        {/* BARRA DE BÚSQUEDA */}
        <div className={`p-6 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
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

const ClientsView = ({
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
                  {/* RUT */}
                  <td className={`py-4 px-6 font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {client.rut}
                  </td>
                  
                  {/* Empresa */}
                  <td className={`py-4 px-6 font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {client.empresa}
                  </td>
                  
                  {/* Encargado */}
                  <td className={`py-4 px-6 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {client.encargado}
                  </td>
                  
                  {/* Email */}
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
                  
                  {/* Teléfono */}
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
                  
                  {/* Ciudad */}
                  <td className={`py-4 px-6 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {client.ciudad}
                  </td>
                  
                  {/* Acciones */}
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      {/* Botón Editar */}
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
                      
                      {/* Botón WhatsApp (si tiene teléfono) */}
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
                      
                      {/* Botón Eliminar */}
                      <button
                        onClick={() => deleteItem('clients', client.id)}
                        className={`p-1 text-red-600 hover:text-red-800 rounded transition-colors ${
                          darkMode ? 'hover:bg-red-100 hover:bg-opacity-20' : 'hover:bg-red-100'
                        }`}
                        title="Eliminar cliente"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
const ClientsView = ({
              ))}
            </tbody>
          </table>

          {/* MENSAJE CUANDO NO HAY CLIENTES */}
          {getFilteredClients().length === 0 && (
            <div className={`text-center py-12 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
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
    </div>
  );
};

export default ClientsView;
