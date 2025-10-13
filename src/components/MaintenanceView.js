import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  Edit2, 
  Trash2, 
  Download,
  Wrench,
  AlertTriangle,
  CheckCircle,
  Clock,
  Car,
  Settings,
  FileText,
  Eye,
  X,
  Clipboard
} from 'lucide-react';
import { getThemeClasses } from '../lib/utils';
import { useMaintenance, useMaintenanceRecords } from '../hooks/useMaintenance';
import { useCompany } from '../hooks/useCompany';
import { generateMaintenancePDF } from '../utils/MaintenancePDF';
import ChecklistModal from './ChecklistModal';

const MaintenanceView = ({
  setModalType,
  setShowModal,
  setSelectedEquipment,
  theme,
  darkMode,
  currentUser,
  userProfile
}) => {
  const currentTheme = getThemeClasses(theme, darkMode);
  
  // Hooks para datos
  const { equipments, loading, deleteEquipment } = useMaintenance();
  const { records } = useMaintenanceRecords();
  const { company } = useCompany();
  
  // Estados locales
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [selectedEquipmentHistory, setSelectedEquipmentHistory] = useState(null);
  const [showChecklistModal, setShowChecklistModal] = useState(false);

  // Tipos de equipos
  const equipmentTypes = [
    'vehículo', 'grúa', 'plataforma elevadora', 'retroexcavadora', 
    'generador', 'compresor', 'soldadora', 'montacargas', 'otro'
  ];

  // Función para calcular estado de documentos
  const getDocumentStatus = (date) => {
    if (!date) return { status: 'sin_fecha', color: 'gray', days: null };
    
    const today = new Date();
    const docDate = new Date(date);
    const diffTime = docDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return { status: 'vencida', color: 'red', days: Math.abs(diffDays) };
    } else if (diffDays <= 60) {
      return { status: 'por_vencer', color: 'yellow', days: diffDays };
    } else {
      return { status: 'vigente', color: 'green', days: diffDays };
    }
  };

  // Función para calcular próximo mantenimiento
  const getNextMaintenanceStatus = (equipment) => {
    if (!equipment.prox_mantencion_km && !equipment.prox_mantencion_horas) {
      return { status: 'sin_programar', color: 'gray', remaining: null };
    }

    let kmRemaining = null;
    let hoursRemaining = null;

    if (equipment.prox_mantencion_km && equipment.kilometraje_actual) {
      kmRemaining = equipment.prox_mantencion_km - equipment.kilometraje_actual;
    }

    if (equipment.prox_mantencion_horas && equipment.horas_uso) {
      hoursRemaining = equipment.prox_mantencion_horas - equipment.horas_uso;
    }

    // Determinar cuál está más próximo
    let remaining = null;
    let type = '';
    
    if (kmRemaining !== null && hoursRemaining !== null) {
      if (kmRemaining < 500 || hoursRemaining < 50) {
        remaining = Math.min(kmRemaining, hoursRemaining);
        type = kmRemaining < hoursRemaining ? 'km' : 'horas';
      } else {
        remaining = Math.min(kmRemaining, hoursRemaining);
        type = kmRemaining < hoursRemaining ? 'km' : 'horas';
      }
    } else if (kmRemaining !== null) {
      remaining = kmRemaining;
      type = 'km';
    } else if (hoursRemaining !== null) {
      remaining = hoursRemaining;
      type = 'horas';
    }

    if (remaining === null) {
      return { status: 'sin_programar', color: 'gray', remaining: null, type: '' };
    }

    if ((type === 'km' && remaining < 500) || (type === 'horas' && remaining < 50)) {
      return { status: 'urgente', color: 'red', remaining, type };
    } else if ((type === 'km' && remaining < 1000) || (type === 'horas' && remaining < 100)) {
      return { status: 'próximo', color: 'yellow', remaining, type };
    } else {
      return { status: 'programado', color: 'green', remaining, type };
    }
  };

  // Equipos filtrados
  const filteredEquipments = useMemo(() => {
    if (!equipments) return [];
    
    return equipments.filter(equipment => {
      const matchesSearch = equipment.nombre_equipo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           equipment.patente?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           equipment.marca?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesType = filterType === 'all' || equipment.tipo_equipo === filterType;
      const matchesStatus = filterStatus === 'all' || equipment.estado_equipo === filterStatus;
      
      return matchesSearch && matchesType && matchesStatus;
    });
  }, [equipments, searchTerm, filterType, filterStatus]);

  // Manejar eliminación
  const handleDelete = async (id, name) => {
    if (window.confirm(`¿Estás seguro de eliminar el equipo "${name}"?`)) {
      try {
        await deleteEquipment(id);
        alert('Equipo eliminado correctamente ✅');
      } catch (error) {
        console.error('Error al eliminar:', error);
        alert('Error al eliminar equipo ❌');
      }
    }
  };

  // Generar PDF del equipo
  const handleGeneratePDF = async (equipment) => {
    try {
      // Obtener registros de mantenimiento para este equipo
      const equipmentRecords = records?.filter(record => record.equipment_id === equipment.id) || [];
      
      const result = generateMaintenancePDF(equipment, equipmentRecords, company, userProfile);
      
      if (result.success) {
        alert('PDF generado exitosamente ✅');
      } else {
        alert('Error al generar PDF ❌');
      }
    } catch (error) {
      console.error('Error al generar PDF:', error);
      alert('Error al generar PDF ❌');
    }
  };

  // Ver historial de mantenimiento
  const handleViewHistory = (equipment) => {
    setSelectedEquipmentHistory(equipment);
    setShowHistoryModal(true);
  };

  if (loading) {
    return (
      <div className={`flex-1 p-4 md:p-8 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="flex items-center justify-center py-20">
          <p className={`${darkMode ? "text-gray-400" : "text-gray-600"}`}>
            Cargando equipos...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex-1 p-4 md:p-8 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 md:mb-8 space-y-4 md:space-y-0">
        <div>
          <h1 className={`text-2xl md:text-3xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>
            Gestión de Mantenimiento
          </h1>
          <p className={`mt-2 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
            Control técnico y documental de equipos y vehículos
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => setShowChecklistModal(true)}
            className={`flex items-center space-x-2 px-4 md:px-6 py-2 md:py-3 text-white rounded-lg transition-colors ${
              darkMode ? 'bg-gray-600 hover:bg-gray-700' : 'bg-gray-600 hover:bg-gray-700'
            }`}
          >
            <Clipboard className="w-4 h-4 md:w-5 md:h-5" />
            <span className="text-sm md:text-base font-medium">Checklist de Vehículo</span>
          </button>

          <button
            onClick={() => {
              setSelectedEquipment(null);
              setModalType('maintenance');
              setShowModal(true);
            }}
            className={`flex items-center space-x-2 px-4 md:px-6 py-2 md:py-3 text-white rounded-lg transition-colors ${currentTheme.buttonBg} ${currentTheme.buttonHover}`}
          >
            <Plus className="w-4 h-4 md:w-5 md:h-5" />
            <span className="text-sm md:text-base font-medium">Nuevo Equipo</span>
          </button>
        </div>
      </div>

      {/* FILTROS Y BÚSQUEDA */}
      <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl shadow-sm border p-4 md:p-6 mb-6`}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Búsqueda */}
          <div className="relative">
            <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
            <input
              type="text"
              placeholder="Buscar equipos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 rounded-lg border transition-colors ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500' 
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500'
              }`}
            />
          </div>

          {/* Filtro por tipo */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className={`px-3 py-2 rounded-lg border transition-colors ${
              darkMode 
                ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500' 
                : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
            }`}
          >
            <option value="all">Todos los tipos</option>
            {equipmentTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>

          {/* Filtro por estado */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className={`px-3 py-2 rounded-lg border transition-colors ${
              darkMode 
                ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500' 
                : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
            }`}
          >
            <option value="all">Todos los estados</option>
            <option value="operativo">Operativo</option>
            <option value="en mantenimiento">En Mantenimiento</option>
            <option value="fuera de servicio">Fuera de Servicio</option>
          </select>

          {/* Botón de filtros avanzados */}
          <button
            className={`flex items-center justify-center space-x-2 px-4 py-2 border rounded-lg transition-colors ${
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

      {/* ESTADÍSTICAS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl shadow-sm border p-4`}>
          <div className="flex items-center">
            <div className={`p-2 rounded-lg ${currentTheme.bg}`}>
              <Car className={`w-6 h-6 ${currentTheme.text}`} />
            </div>
            <div className="ml-4">
              <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {filteredEquipments.length}
              </p>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Total Equipos
              </p>
            </div>
          </div>
        </div>

        <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl shadow-sm border p-4`}>
          <div className="flex items-center">
            <div className="p-2 rounded-lg bg-green-100">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {filteredEquipments.filter(eq => eq.estado_equipo === 'operativo').length}
              </p>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Operativos
              </p>
            </div>
          </div>
        </div>

        <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl shadow-sm border p-4`}>
          <div className="flex items-center">
            <div className="p-2 rounded-lg bg-yellow-100">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {filteredEquipments.filter(eq => eq.estado_equipo === 'en mantenimiento').length}
              </p>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                En Mantención
              </p>
            </div>
          </div>
        </div>

        <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl shadow-sm border p-4`}>
          <div className="flex items-center">
            <div className="p-2 rounded-lg bg-red-100">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {filteredEquipments.filter(eq => {
                  const nextMaintenance = getNextMaintenanceStatus(eq);
                  return nextMaintenance.status === 'urgente';
                }).length}
              </p>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Mantención Urgente
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* VISTA DESKTOP */}
      <div className="hidden md:block">
        <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl shadow-sm border overflow-hidden`}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} border-b ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                <tr>
                  <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                    Equipo
                  </th>
                  <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                    Tipo
                  </th>
                  <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                    Estado
                  </th>
                  <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                    Km/Horas
                  </th>
                  <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                    Documentos
                  </th>
                  <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                    Próximo Mant.
                  </th>
                  <th className={`px-6 py-3 text-right text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className={`divide-y ${darkMode ? 'divide-gray-600' : 'divide-gray-200'}`}>
                {filteredEquipments.map((equipment) => {
                  const nextMaintenance = getNextMaintenanceStatus(equipment);
                  const revisionTecnica = getDocumentStatus(equipment.revision_tecnica_fecha);
                  const soap = getDocumentStatus(equipment.soap_fecha);
                  const permisoCirculacion = getDocumentStatus(equipment.permiso_circulacion_fecha);
                  
                  return (
                    <tr key={equipment.id} className={`hover:${darkMode ? 'bg-gray-700' : 'bg-gray-50'} transition-colors`}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {equipment.nombre_equipo}
                          </div>
                          <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            {equipment.patente && `${equipment.patente} • `}{equipment.marca} {equipment.modelo}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          darkMode ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {equipment.tipo_equipo}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          equipment.estado_equipo === 'operativo' 
                            ? 'bg-green-100 text-green-800' 
                            : equipment.estado_equipo === 'en mantenimiento'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {equipment.estado_equipo}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {equipment.kilometraje_actual ? `${equipment.kilometraje_actual.toLocaleString()} km` : '-'}
                        </div>
                        <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          {equipment.horas_uso ? `${equipment.horas_uso} hrs` : '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex space-x-1">
                          <span className={`inline-block w-3 h-3 rounded-full ${
                            revisionTecnica.color === 'green' ? 'bg-green-500' :
                            revisionTecnica.color === 'yellow' ? 'bg-yellow-500' : 'bg-red-500'
                          }`} title={`Rev. Técnica: ${revisionTecnica.status}`}></span>
                          <span className={`inline-block w-3 h-3 rounded-full ${
                            soap.color === 'green' ? 'bg-green-500' :
                            soap.color === 'yellow' ? 'bg-yellow-500' : 'bg-red-500'
                          }`} title={`SOAP: ${soap.status}`}></span>
                          <span className={`inline-block w-3 h-3 rounded-full ${
                            permisoCirculacion.color === 'green' ? 'bg-green-500' :
                            permisoCirculacion.color === 'yellow' ? 'bg-yellow-500' : 'bg-red-500'
                          }`} title={`Permiso Circulación: ${permisoCirculacion.status}`}></span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          nextMaintenance.color === 'green' ? 'bg-green-100 text-green-800' :
                          nextMaintenance.color === 'yellow' ? 'bg-yellow-100 text-yellow-800' :
                          nextMaintenance.color === 'red' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {nextMaintenance.remaining ? 
                            `${nextMaintenance.remaining} ${nextMaintenance.type}` : 
                            nextMaintenance.status
                          }
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                        <button
                          onClick={() => handleViewHistory(equipment)}
                          className={`inline-flex items-center p-2 rounded-lg transition-colors ${
                            darkMode 
                              ? 'text-gray-400 hover:text-blue-400 hover:bg-gray-700' 
                              : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                          }`}
                          title="Ver historial"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedEquipment(equipment);
                            setModalType('maintenance-record');
                            setShowModal(true);
                          }}
                          className={`inline-flex items-center p-2 rounded-lg transition-colors ${
                            darkMode 
                              ? 'text-gray-400 hover:text-green-400 hover:bg-gray-700' 
                              : 'text-gray-600 hover:text-green-600 hover:bg-green-50'
                          }`}
                          title="Nueva mantención"
                        >
                          <Wrench className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedEquipment(equipment);
                            setModalType('maintenance');
                            setShowModal(true);
                          }}
                          className={`inline-flex items-center p-2 rounded-lg transition-colors ${
                            darkMode 
                              ? 'text-gray-400 hover:text-blue-400 hover:bg-gray-700' 
                              : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                          }`}
                          title="Editar equipo"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleGeneratePDF(equipment)}
                          className={`inline-flex items-center p-2 rounded-lg transition-colors ${
                            darkMode 
                              ? 'text-gray-400 hover:text-purple-400 hover:bg-gray-700' 
                              : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
                          }`}
                          title="Generar PDF"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(equipment.id, equipment.nombre_equipo)}
                          className={`inline-flex items-center p-2 rounded-lg transition-colors ${
                            darkMode 
                              ? 'text-gray-400 hover:text-red-400 hover:bg-gray-700' 
                              : 'text-gray-600 hover:text-red-600 hover:bg-red-50'
                          }`}
                          title="Eliminar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            
            {filteredEquipments.length === 0 && (
              <div className="text-center py-12">
                <Car className={`mx-auto h-12 w-12 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`} />
                <h3 className={`mt-2 text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                  No hay equipos registrados
                </h3>
                <p className={`mt-1 text-sm ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                  Comienza agregando un nuevo equipo al sistema.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* VISTA MÓVIL */}
      <div className="md:hidden space-y-4">
        {filteredEquipments.map((equipment) => {
          const nextMaintenance = getNextMaintenanceStatus(equipment);
          const revisionTecnica = getDocumentStatus(equipment.revision_tecnica_fecha);
          const soap = getDocumentStatus(equipment.soap_fecha);
          const permisoCirculacion = getDocumentStatus(equipment.permiso_circulacion_fecha);
          
          return (
            <div key={equipment.id} className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl shadow-sm border p-4`}>
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {equipment.nombre_equipo}
                  </h3>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {equipment.patente && `${equipment.patente} • `}{equipment.marca} {equipment.modelo}
                  </p>
                </div>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  equipment.estado_equipo === 'operativo' 
                    ? 'bg-green-100 text-green-800' 
                    : equipment.estado_equipo === 'en mantenimiento'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {equipment.estado_equipo}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div>
                  <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>Tipo</p>
                  <p className={`text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>{equipment.tipo_equipo}</p>
                </div>
                <div>
                  <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>Kilometraje</p>
                  <p className={`text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {equipment.kilometraje_actual ? `${equipment.kilometraje_actual.toLocaleString()} km` : '-'}
                  </p>
                </div>
              </div>

              {/* Documentos */}
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center space-x-1">
                  <span className={`w-3 h-3 rounded-full ${
                    revisionTecnica.color === 'green' ? 'bg-green-500' :
                    revisionTecnica.color === 'yellow' ? 'bg-yellow-500' : 'bg-red-500'
                  }`}></span>
                  <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Rev. Técnica</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span className={`w-3 h-3 rounded-full ${
                    soap.color === 'green' ? 'bg-green-500' :
                    soap.color === 'yellow' ? 'bg-yellow-500' : 'bg-red-500'
                  }`}></span>
                  <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>SOAP</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span className={`w-3 h-3 rounded-full ${
                    permisoCirculacion.color === 'green' ? 'bg-green-500' :
                    permisoCirculacion.color === 'yellow' ? 'bg-yellow-500' : 'bg-red-500'
                  }`}></span>
                  <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Permiso Circ.</span>
                </div>
              </div>

              {/* Próximo mantenimiento */}
              {nextMaintenance.remaining && (
                <div className="mb-4">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    nextMaintenance.color === 'green' ? 'bg-green-100 text-green-800' :
                    nextMaintenance.color === 'yellow' ? 'bg-yellow-100 text-yellow-800' :
                    nextMaintenance.color === 'red' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    Próx. mant.: {nextMaintenance.remaining} {nextMaintenance.type}
                  </span>
                </div>
              )}

              {/* Botones de acción */}
              <div className="grid grid-cols-5 gap-2">
                <button
                  onClick={() => handleViewHistory(equipment)}
                  className={`flex items-center justify-center p-2 rounded-lg transition-colors ${
                    darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-100 hover:bg-blue-200'
                  }`}
                  title="Ver historial"
                >
                  <Eye className={`w-4 h-4 ${darkMode ? 'text-white' : 'text-blue-600'}`} />
                </button>
                <button
                  onClick={() => {
                    setSelectedEquipment(equipment);
                    setModalType('maintenance-record');
                    setShowModal(true);
                  }}
                  className={`flex items-center justify-center p-2 rounded-lg transition-colors ${
                    darkMode ? 'bg-green-600 hover:bg-green-700' : 'bg-green-100 hover:bg-green-200'
                  }`}
                  title="Nueva mantención"
                >
                  <Wrench className={`w-4 h-4 ${darkMode ? 'text-white' : 'text-green-600'}`} />
                </button>
                <button
                  onClick={() => {
                    setSelectedEquipment(equipment);
                    setModalType('maintenance');
                    setShowModal(true);
                  }}
                  className={`flex items-center justify-center p-2 rounded-lg transition-colors ${
                    darkMode ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-yellow-100 hover:bg-yellow-200'
                  }`}
                  title="Editar"
                >
                  <Edit2 className={`w-4 h-4 ${darkMode ? 'text-white' : 'text-yellow-600'}`} />
                </button>
                <button
                  onClick={() => handleGeneratePDF(equipment)}
                  className={`flex items-center justify-center p-2 rounded-lg transition-colors ${
                    darkMode ? 'bg-purple-600 hover:bg-purple-700' : 'bg-purple-100 hover:bg-purple-200'
                  }`}
                  title="PDF"
                >
                  <Download className={`w-4 h-4 ${darkMode ? 'text-white' : 'text-purple-600'}`} />
                </button>
                <button
                  onClick={() => handleDelete(equipment.id, equipment.nombre_equipo)}
                  className={`flex items-center justify-center p-2 rounded-lg transition-colors ${
                    darkMode ? 'bg-red-600 hover:bg-red-700' : 'bg-red-100 hover:bg-red-200'
                  }`}
                  title="Eliminar"
                >
                  <Trash2 className={`w-4 h-4 ${darkMode ? 'text-white' : 'text-red-600'}`} />
                </button>
              </div>
            </div>
          );
        })}

        {filteredEquipments.length === 0 && (
          <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl shadow-sm border p-8 text-center`}>
            <Car className={`mx-auto h-12 w-12 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`} />
            <h3 className={`mt-2 text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>
              No hay equipos registrados
            </h3>
            <p className={`mt-1 text-sm ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
              Comienza agregando un nuevo equipo al sistema.
            </p>
          </div>
        )}
      </div>

      {/* MODAL DE HISTORIAL DE MANTENIMIENTO */}
      {showHistoryModal && selectedEquipmentHistory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className={`w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-xl shadow-2xl ${
            darkMode ? 'bg-gray-800' : 'bg-white'
          }`}>
            {/* Header */}
            <div className={`flex justify-between items-center p-6 border-b ${
              darkMode ? 'border-gray-700' : 'border-gray-200'
            }`}>
              <div>
                <h2 className={`text-xl md:text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Historial de Mantenimiento
                </h2>
                <p className={`mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {selectedEquipmentHistory.nombre_equipo} - {selectedEquipmentHistory.patente}
                </p>
              </div>
              <button
                onClick={() => setShowHistoryModal(false)}
                className={`p-2 rounded-lg transition-colors ${
                  darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-600'
                }`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="overflow-y-auto max-h-[calc(90vh-140px)] p-6">
              {(() => {
                const equipmentRecords = records?.filter(record => record.equipment_id === selectedEquipmentHistory.id) || [];
                
                if (equipmentRecords.length === 0) {
                  return (
                    <div className="text-center py-12">
                      <FileText className={`mx-auto h-12 w-12 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`} />
                      <h3 className={`mt-2 text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                        Sin registros de mantenimiento
                      </h3>
                      <p className={`mt-1 text-sm ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                        Este equipo no tiene registros de mantenimiento aún.
                      </p>
                    </div>
                  );
                }

                return (
                  <div className="space-y-4">
                    {equipmentRecords
                      .sort((a, b) => new Date(b.fecha_mantencion) - new Date(a.fecha_mantencion))
                      .map((record, index) => (
                      <div key={record.id || index} className={`${
                        darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
                      } rounded-lg border p-4`}>
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                              {record.tipo_mantencion || 'Mantenimiento'}
                            </h4>
                            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                              {new Date(record.fecha_mantencion).toLocaleDateString('es-CL')}
                              {record.kilometraje_mantencion && ` • ${record.kilometraje_mantencion.toLocaleString()} km`}
                              {record.horas_mantencion && ` • ${record.horas_mantencion} hrs`}
                            </p>
                          </div>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            record.estado_equipo_post === 'operativo' 
                              ? 'bg-green-100 text-green-800' 
                              : record.estado_equipo_post === 'en mantenimiento'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {record.estado_equipo_post || 'Sin estado'}
                          </span>
                        </div>

                        {record.descripcion_trabajo && (
                          <div className="mb-3">
                            <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                              <strong>Trabajo realizado:</strong> {record.descripcion_trabajo}
                            </p>
                          </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                          {record.taller_responsable && (
                            <div className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                              <strong>Taller:</strong> {record.taller_responsable}
                            </div>
                          )}
                          {record.tecnico_responsable && (
                            <div className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                              <strong>Técnico:</strong> {record.tecnico_responsable}
                            </div>
                          )}
                          {record.createdBy && (
                            <div className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                              <strong>Registrado por:</strong> {record.createdBy}
                            </div>
                          )}
                        </div>

                        {record.observaciones && (
                          <div className="mt-3 pt-3 border-t border-gray-300">
                            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                              <strong>Observaciones:</strong> {record.observaciones}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>

            {/* Footer */}
            <div className={`flex justify-end space-x-3 p-6 border-t ${
              darkMode ? 'border-gray-700' : 'border-gray-200'
            }`}>
              <button
                onClick={() => setShowHistoryModal(false)}
                className={`px-6 py-2 rounded-lg border transition-colors ${
                  darkMode 
                    ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                Cerrar
              </button>
              <button
                onClick={() => handleGeneratePDF(selectedEquipmentHistory)}
                className={`px-6 py-2 text-white rounded-lg transition-colors ${
                  currentTheme.buttonBg
                } ${currentTheme.buttonHover}`}
              >
                Generar PDF
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Checklist */}
      <ChecklistModal 
        isOpen={showChecklistModal}
        onClose={() => setShowChecklistModal(false)}
        theme={theme}
        darkMode={darkMode}
      />
    </div>
  );
};

export default MaintenanceView;