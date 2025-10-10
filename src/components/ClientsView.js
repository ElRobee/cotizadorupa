import React, { useState, useMemo } from "react";
import { 
  Search, 
  Plus, 
  Edit2, 
  Trash2, 
  MessageCircle,
  Users,
  Mail,
  Phone,
  MapPin,
  Upload
} from "lucide-react";
import { getThemeClasses } from "../lib/utils";
import { useClients } from "../hooks/useClients";
import { useCompany } from "../hooks/useCompany";
import ClientImportModal from "./ClientImportModal";

const ClientsView = ({ setModalType, setShowModal, theme, darkMode, startEdit, userRole, isAdmin }) => {
  const currentTheme = getThemeClasses(theme, darkMode);

  // 🔥 Cargar clientes desde Firestore
  const { clients, loading, deleteClient, addClient } = useClients();
  const { company } = useCompany();

  // 🔍 Estado de búsqueda
  const [searchTerm, setSearchTerm] = useState("");
  
  // Estado para modal de importación
  const [showImportModal, setShowImportModal] = useState(false);

  // Función para importar clientes masivamente
  const handleImportClients = async (clientsData) => {
    try {
      const promises = clientsData.map(clientData => addClient(clientData));
      await Promise.all(promises);
      console.log(`${clientsData.length} clientes importados exitosamente`);
    } catch (error) {
      console.error('Error importando clientes:', error);
      throw error; // Para que el modal pueda manejar el error
    }
  };

  // Filtrar clientes
  const filteredClients = useMemo(() => {
    if (!clients) return [];
    const filtered = clients.filter((c) =>
      [c.empresa, c.encargado, c.rut, c.email, c.telefono, c.ciudad]
        .filter(Boolean)
        .some((field) => field.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    // Ordenar alfabéticamente por empresa
    filtered.sort((a, b) => {
      const empresaA = a.empresa || '';
      const empresaB = b.empresa || '';
      return empresaA.toLowerCase().localeCompare(empresaB.toLowerCase());
    });
    return filtered;
  }, [clients, searchTerm]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className={`${darkMode ? "text-gray-400" : "text-gray-600"}`}>Cargando clientes...</p>
      </div>
    );
  }

  return (
    <div className={`flex-1 p-4 md:p-8 ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}>
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 md:mb-8 space-y-4 md:space-y-0">
        <div>
          <h1 className={`text-2xl md:text-3xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>
            Clientes
          </h1>
          <p className={`${darkMode ? "text-gray-300" : "text-gray-600"} mt-2 text-sm md:text-base`}>
            Gestiona tu base de clientes
          </p>
        </div>
        <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
          {/* Botón de importación solo para administradores */}
          {isAdmin && (
            <button
              onClick={() => setShowImportModal(true)}
              className={`flex items-center justify-center space-x-2 px-4 py-2 rounded-lg border transition-colors
                ${darkMode 
                  ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                } w-full md:w-auto`}
            >
              <Upload className="w-4 h-4" />
              <span>Importar Excel</span>
            </button>
          )}
          <button
            onClick={() => {
              setModalType("client");
              setShowModal(true);
            }}
            className={`flex items-center justify-center space-x-2 px-4 py-2 text-white rounded-lg transition-colors ${currentTheme.buttonBg} ${currentTheme.buttonHover} w-full md:w-auto`}
          >
            <Plus className="w-4 h-4" />
            <span>Nuevo Cliente</span>
          </button>
        </div>
      </div>

      {/* TABLA */}
      <div className={`${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} rounded-xl shadow-sm border overflow-hidden`}>
        {/* BUSCADOR */}
        <div className={`p-4 md:p-6 border-b ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
          <div className="relative">
            <Search className={`w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400`} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar clientes..."
              className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${currentTheme.focus} ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
              }`}
            />
          </div>
        </div>

        {/* LISTADO */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full table-fixed">
            <thead className={darkMode ? "bg-gray-700" : "bg-gray-50"}>
              <tr>
                <th className={`text-left py-4 px-6 text-sm font-medium w-32 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                  RUT
                </th>
                <th className={`text-left py-4 px-6 text-sm font-medium w-48 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                  Empresa
                </th>
                <th className={`text-left py-4 px-6 text-sm font-medium w-40 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                  Encargado
                </th>
                <th className={`text-left py-4 px-6 text-sm font-medium w-48 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                  Email
                </th>
                <th className={`text-left py-4 px-6 text-sm font-medium w-32 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                  Teléfono
                </th>
                <th className={`text-left py-4 px-6 text-sm font-medium w-32 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                  Ciudad
                </th>
                <th className={`text-left py-4 px-6 text-sm font-medium w-32 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredClients.map((client) => (
                <tr
                  key={client.id}
                  className={`border-t transition-colors ${
                    darkMode ? "border-gray-700 hover:bg-gray-700" : "border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <td className={`py-4 px-6 font-medium truncate ${darkMode ? "text-white" : "text-gray-900"}`} title={client.rut}>
                    {client.rut}
                  </td>
                  <td className={`py-4 px-6 font-medium truncate ${darkMode ? "text-white" : "text-gray-900"}`} title={client.empresa}>
                    {client.empresa}
                  </td>
                  <td className={`py-4 px-6 truncate ${darkMode ? "text-gray-300" : "text-gray-700"}`} title={client.encargado}>
                    {client.encargado}
                  </td>
                  <td className={`py-4 px-6 truncate ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                    <a href={`mailto:${client.email}`} className="text-blue-600 hover:text-blue-800 truncate block" title={`Enviar email a ${client.email}`}>
                      {client.email}
                    </a>
                  </td>
                  <td className={`py-4 px-6 truncate ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                    <a href={`tel:${client.telefono}`} className="text-blue-600 hover:text-blue-800 truncate block" title={client.telefono}>
                      {client.telefono}
                    </a>
                  </td>
                  <td className={`py-4 px-6 truncate ${darkMode ? "text-gray-300" : "text-gray-700"}`} title={client.ciudad}>
                    {client.ciudad}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      <button onClick={() => startEdit("client", client)} className="p-1 text-blue-600 hover:text-blue-800" title="Editar cliente">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      {client.telefono && (
                        <button
                          onClick={() => {
                            const phoneNumber = client.telefono.replace(/\D/g, "");
                            const message = `¡Hola ${client.encargado}! Te saludo desde ${company?.razonSocial || "nuestra empresa"}. ¿Cómo estás?`;
                            const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
                            window.open(whatsappUrl, "_blank");
                          }}
                          className="p-1 text-green-600 hover:text-green-800"
                          title="Enviar WhatsApp"
                        >
                          <MessageCircle className="w-4 h-4" />
                        </button>
                      )}
                      <button onClick={() => deleteClient(client.id)} className="p-1 text-red-600 hover:text-red-800" title="Eliminar cliente">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* VERSIÓN MÓVIL */}
        <div className="md:hidden">
          {filteredClients.map((client) => (
            <div key={client.id} className={`p-4 border-b ${darkMode ? "border-gray-700" : "border-gray-200"} last:border-b-0`}>
              <h3 className={`font-semibold text-lg ${darkMode ? "text-white" : "text-gray-900"}`}>{client.empresa}</h3>
              <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>{client.rut}</p>
              <div className="flex space-x-2 mt-3">
                <button onClick={() => startEdit("client", client)} className="flex-1 bg-blue-600 text-white rounded-lg px-3 py-2">
                  <Edit2 className="w-4 h-4 inline mr-1" /> Editar
                </button>
                <button onClick={() => deleteClient(client.id)} className="bg-red-600 text-white rounded-lg px-3 py-2">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* VACÍO */}
        {filteredClients.length === 0 && (
          <div className={`text-center py-12 px-4 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
            <Users className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p className="text-lg font-medium mb-2">No hay clientes registrados</p>
            <p className="text-sm">
              {searchTerm ? "No se encontraron clientes con ese criterio de búsqueda." : "Comienza agregando tu primer cliente."}
            </p>
            {!searchTerm && (
              <button
                onClick={() => {
                  setModalType("client");
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

      {/* Modal de importación */}
      <ClientImportModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        onImportClients={handleImportClients}
        darkMode={darkMode}
      />
    </div>
  );
};

export default ClientsView;
