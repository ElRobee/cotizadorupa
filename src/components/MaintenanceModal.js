import React, { useState, useEffect } from 'react';
import { X, Upload, Calendar, Clock, FileText, AlertTriangle } from 'lucide-react';
import { getThemeClasses } from '../lib/utils';
import { useMaintenance, useMaintenanceRecords } from '../hooks/useMaintenance';

const MaintenanceModal = ({
  showModal,
  setShowModal,
  modalType,
  theme,
  darkMode,
  selectedEquipment,
  currentUser,
  userProfile
}) => {
  const currentTheme = getThemeClasses(theme, darkMode);
  
  // Hooks
  const { addEquipment, updateEquipment } = useMaintenance();
  const { addMaintenanceRecord } = useMaintenanceRecords();

  // Estados para equipo
  const [equipmentData, setEquipmentData] = useState({
    nombre_equipo: '',
    tipo_equipo: 'Vehículo',
    marca: '',
    modelo: '',
    año: new Date().getFullYear(),
    patente: '',
    numero_chasis: '',
    numero_motor: '',
    kilometraje_actual: '',
    horas_uso: '',
    estado_equipo: 'Operativo',
    prox_mantencion_km: '',
    prox_mantencion_horas: '',
    revision_tecnica_fecha: '',
    revision_tecnica_numero: '',
    soap_fecha: '',
    soap_numero: '',
    permiso_circulacion_fecha: '',
    permiso_circulacion_numero: '',
    propietario: '',
    conductor_habitual: '',
    ubicacion_actual: '',
    observaciones: ''
  });

  // Estados para registro de mantenimiento
  const [maintenanceRecord, setMaintenanceRecord] = useState({
    tipo_mantencion: 'preventiva',
    fecha_mantencion: new Date().toISOString().split('T')[0],
    kilometraje_mantencion: '',
    horas_mantencion: '',
    descripcion_trabajo: '',
    repuestos_utilizados: '',
    costo_repuestos: '',
    costo_mano_obra: '',
    taller_responsable: '',
    tecnico_responsable: '',
    prox_mantencion_km: '',
    prox_mantencion_horas: '',
    prox_mantencion_fecha: '',
    observaciones: '',
    estado_equipo_post: 'operativo'
  });

  const [loading, setLoading] = useState(false);

  const equipmentTypes = [
    'Vehículo', 'Grúa', 'Plataforma Elevadora', 'Retroexcavadora', 
    'Generador', 'Compresor', 'Soldadora', 'Montacargas', 'Otro'
  ];

  const maintenanceTypes = [
    'Preventiva',
    'Correctiva',
    'Predictiva',
    'Emergencia',
    'Revisión técnica',
    'Cambio de aceite',
    'Cambio de filtros',
    'Revisión de frenos',
    'Alineación y balanceo',
    'Reparación de motor',
    'Reparación eléctrica',
    'Pintura y carrocería',
    'Otra'
  ];

  // Cargar datos del equipo seleccionado
  useEffect(() => {
    if (selectedEquipment && modalType === 'maintenance') {
      setEquipmentData({ ...selectedEquipment });
    } else if (modalType === 'maintenance') {
      // Reset para nuevo equipo
      setEquipmentData({
        nombre_equipo: '',
        tipo_equipo: 'Vehículo',
        marca: '',
        modelo: '',
        año: new Date().getFullYear(),
        patente: '',
        numero_chasis: '',
        numero_motor: '',
        kilometraje_actual: '',
        horas_uso: '',
        estado_equipo: 'Operativo',
        prox_mantencion_km: '',
        prox_mantencion_horas: '',
        revision_tecnica_fecha: '',
        revision_tecnica_numero: '',
        soap_fecha: '',
        soap_numero: '',
        seguro_fecha: '',
        seguro_numero: '',
        propietario: '',
        conductor_habitual: '',
        ubicacion_actual: '',
        observaciones: ''
      });
    }

    if (selectedEquipment && modalType === 'maintenance-record') {
      setMaintenanceRecord(prev => ({
        ...prev,
        kilometraje_mantencion: selectedEquipment.kilometraje_actual || '',
        horas_mantencion: selectedEquipment.horas_uso || ''
      }));
    }
  }, [selectedEquipment, modalType, showModal]);

  const handleSaveEquipment = async () => {
    if (!equipmentData.nombre_equipo.trim()) {
      alert('El nombre del equipo es obligatorio');
      return;
    }

    setLoading(true);
    try {
      const equipmentToSave = {
        ...equipmentData,
        kilometraje_actual: equipmentData.kilometraje_actual ? parseInt(equipmentData.kilometraje_actual) : null,
        horas_uso: equipmentData.horas_uso ? parseInt(equipmentData.horas_uso) : null,
        prox_mantencion_km: equipmentData.prox_mantencion_km ? parseInt(equipmentData.prox_mantencion_km) : null,
        prox_mantencion_horas: equipmentData.prox_mantencion_horas ? parseInt(equipmentData.prox_mantencion_horas) : null,
        año: parseInt(equipmentData.año),
        createdBy: userProfile?.username || currentUser?.email || 'Usuario',
        updatedBy: userProfile?.username || currentUser?.email || 'Usuario',
        updatedAt: new Date().toISOString()
      };

      if (selectedEquipment && selectedEquipment.id) {
        await updateEquipment(selectedEquipment.id, equipmentToSave);
        alert('Equipo actualizado correctamente ✅');
      } else {
        await addEquipment(equipmentToSave);
        alert('Equipo agregado correctamente ✅');
      }

      setShowModal(false);
    } catch (error) {
      console.error('Error al guardar equipo:', error);
      alert('Error al guardar equipo ❌');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveMaintenanceRecord = async () => {
    if (!maintenanceRecord.descripcion_trabajo.trim()) {
      alert('La descripción del trabajo es obligatoria');
      return;
    }

    setLoading(true);
    try {
      const recordToSave = {
        ...maintenanceRecord,
        equipment_id: selectedEquipment.id,
        equipment_name: selectedEquipment.nombre_equipo,
        kilometraje_mantencion: maintenanceRecord.kilometraje_mantencion ? parseInt(maintenanceRecord.kilometraje_mantencion) : null,
        horas_mantencion: maintenanceRecord.horas_mantencion ? parseInt(maintenanceRecord.horas_mantencion) : null,
        prox_mantencion_km: maintenanceRecord.prox_mantencion_km ? parseInt(maintenanceRecord.prox_mantencion_km) : null,
        prox_mantencion_horas: maintenanceRecord.prox_mantencion_horas ? parseInt(maintenanceRecord.prox_mantencion_horas) : null,
        costo_repuestos: maintenanceRecord.costo_repuestos ? parseFloat(maintenanceRecord.costo_repuestos) : 0,
        costo_mano_obra: maintenanceRecord.costo_mano_obra ? parseFloat(maintenanceRecord.costo_mano_obra) : 0,
        createdBy: userProfile?.username || currentUser?.email || 'Usuario',
        createdAt: new Date().toISOString()
      };

      await addMaintenanceRecord(recordToSave);

      // Actualizar el equipo con los nuevos datos
      const equipmentUpdate = {
        kilometraje_actual: recordToSave.kilometraje_mantencion || selectedEquipment.kilometraje_actual,
        horas_uso: recordToSave.horas_mantencion || selectedEquipment.horas_uso,
        estado_equipo: recordToSave.estado_equipo_post,
        prox_mantencion_km: recordToSave.prox_mantencion_km || selectedEquipment.prox_mantencion_km,
        prox_mantencion_horas: recordToSave.prox_mantencion_horas || selectedEquipment.prox_mantencion_horas,
        updatedBy: userProfile?.username || currentUser?.email || 'Usuario',
        updatedAt: new Date().toISOString()
      };

      await updateEquipment(selectedEquipment.id, equipmentUpdate);

      alert('Registro de mantenimiento guardado correctamente ✅');
      setShowModal(false);
    } catch (error) {
      console.error('Error al guardar registro:', error);
      alert('Error al guardar registro ❌');
    } finally {
      setLoading(false);
    }
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className={`w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-xl shadow-2xl ${
        darkMode ? 'bg-gray-800' : 'bg-white'
      }`}>
        {/* Header */}
        <div className={`flex justify-between items-center p-6 border-b ${
          darkMode ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <h2 className={`text-xl md:text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {modalType === 'maintenance' 
              ? (selectedEquipment ? 'Editar Equipo' : 'Nuevo Equipo')
              : 'Nuevo Registro de Mantenimiento'
            }
          </h2>
          <button
            onClick={() => setShowModal(false)}
            className={`p-2 rounded-lg transition-colors ${
              darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-600'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
          {modalType === 'maintenance' ? (
            // FORMULARIO DE EQUIPO
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Información básica */}
                <div className="space-y-4">
                  <h3 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Información Básica
                  </h3>
                  
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Nombre del Equipo *
                    </label>
                    <input
                      type="text"
                      value={equipmentData.nombre_equipo}
                      onChange={(e) => setEquipmentData(prev => ({ ...prev, nombre_equipo: e.target.value }))}
                      className={`w-full px-3 py-2 border rounded-lg transition-colors ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                      placeholder="Ej: Camión Chevrolet NPR"
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Tipo de Equipo
                    </label>
                    <select
                      value={equipmentData.tipo_equipo}
                      onChange={(e) => setEquipmentData(prev => ({ ...prev, tipo_equipo: e.target.value }))}
                      className={`w-full px-3 py-2 border rounded-lg transition-colors ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    >
                      {equipmentTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Marca
                      </label>
                      <input
                        type="text"
                        value={equipmentData.marca}
                        onChange={(e) => setEquipmentData(prev => ({ ...prev, marca: e.target.value }))}
                        className={`w-full px-3 py-2 border rounded-lg transition-colors ${
                          darkMode 
                            ? 'bg-gray-700 border-gray-600 text-white' 
                            : 'bg-white border-gray-300 text-gray-900'
                        }`}
                        placeholder="Ej: Chevrolet"
                      />
                    </div>
                    
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Modelo
                      </label>
                      <input
                        type="text"
                        value={equipmentData.modelo}
                        onChange={(e) => setEquipmentData(prev => ({ ...prev, modelo: e.target.value }))}
                        className={`w-full px-3 py-2 border rounded-lg transition-colors ${
                          darkMode 
                            ? 'bg-gray-700 border-gray-600 text-white' 
                            : 'bg-white border-gray-300 text-gray-900'
                        }`}
                        placeholder="Ej: NPR"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Año
                      </label>
                      <input
                        type="number"
                        value={equipmentData.año}
                        onChange={(e) => setEquipmentData(prev => ({ ...prev, año: e.target.value }))}
                        className={`w-full px-3 py-2 border rounded-lg transition-colors ${
                          darkMode 
                            ? 'bg-gray-700 border-gray-600 text-white' 
                            : 'bg-white border-gray-300 text-gray-900'
                        }`}
                        min="1990"
                        max={new Date().getFullYear() + 1}
                      />
                    </div>
                    
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Patente
                      </label>
                      <input
                        type="text"
                        value={equipmentData.patente}
                        onChange={(e) => setEquipmentData(prev => ({ ...prev, patente: e.target.value.toUpperCase() }))}
                        className={`w-full px-3 py-2 border rounded-lg transition-colors ${
                          darkMode 
                            ? 'bg-gray-700 border-gray-600 text-white' 
                            : 'bg-white border-gray-300 text-gray-900'
                        }`}
                        placeholder="Ej: ABCD12"
                      />
                    </div>
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Estado del Equipo
                    </label>
                    <select
                      value={equipmentData.estado_equipo}
                      onChange={(e) => setEquipmentData(prev => ({ ...prev, estado_equipo: e.target.value }))}
                      className={`w-full px-3 py-2 border rounded-lg transition-colors ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    >
                      <option value="operativo">Operativo</option>
                      <option value="en mantenimiento">En Mantenimiento</option>
                      <option value="fuera de servicio">Fuera de Servicio</option>
                    </select>
                  </div>
                </div>

                {/* Datos técnicos */}
                <div className="space-y-4">
                  <h3 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Datos Técnicos
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Número de Chasis
                      </label>
                      <input
                        type="text"
                        value={equipmentData.numero_chasis}
                        onChange={(e) => setEquipmentData(prev => ({ ...prev, numero_chasis: e.target.value }))}
                        className={`w-full px-3 py-2 border rounded-lg transition-colors ${
                          darkMode 
                            ? 'bg-gray-700 border-gray-600 text-white' 
                            : 'bg-white border-gray-300 text-gray-900'
                        }`}
                      />
                    </div>
                    
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Número de Motor
                      </label>
                      <input
                        type="text"
                        value={equipmentData.numero_motor}
                        onChange={(e) => setEquipmentData(prev => ({ ...prev, numero_motor: e.target.value }))}
                        className={`w-full px-3 py-2 border rounded-lg transition-colors ${
                          darkMode 
                            ? 'bg-gray-700 border-gray-600 text-white' 
                            : 'bg-white border-gray-300 text-gray-900'
                        }`}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Kilometraje Actual
                      </label>
                      <input
                        type="number"
                        value={equipmentData.kilometraje_actual}
                        onChange={(e) => setEquipmentData(prev => ({ ...prev, kilometraje_actual: e.target.value }))}
                        className={`w-full px-3 py-2 border rounded-lg transition-colors ${
                          darkMode 
                            ? 'bg-gray-700 border-gray-600 text-white' 
                            : 'bg-white border-gray-300 text-gray-900'
                        }`}
                        min="0"
                      />
                    </div>
                    
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Horas de Uso
                      </label>
                      <input
                        type="number"
                        value={equipmentData.horas_uso}
                        onChange={(e) => setEquipmentData(prev => ({ ...prev, horas_uso: e.target.value }))}
                        className={`w-full px-3 py-2 border rounded-lg transition-colors ${
                          darkMode 
                            ? 'bg-gray-700 border-gray-600 text-white' 
                            : 'bg-white border-gray-300 text-gray-900'
                        }`}
                        min="0"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Próx. Mantención (km)
                      </label>
                      <input
                        type="number"
                        value={equipmentData.prox_mantencion_km}
                        onChange={(e) => setEquipmentData(prev => ({ ...prev, prox_mantencion_km: e.target.value }))}
                        className={`w-full px-3 py-2 border rounded-lg transition-colors ${
                          darkMode 
                            ? 'bg-gray-700 border-gray-600 text-white' 
                            : 'bg-white border-gray-300 text-gray-900'
                        }`}
                        min="0"
                      />
                    </div>
                    
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Próx. Mantención (horas)
                      </label>
                      <input
                        type="number"
                        value={equipmentData.prox_mantencion_horas}
                        onChange={(e) => setEquipmentData(prev => ({ ...prev, prox_mantencion_horas: e.target.value }))}
                        className={`w-full px-3 py-2 border rounded-lg transition-colors ${
                          darkMode 
                            ? 'bg-gray-700 border-gray-600 text-white' 
                            : 'bg-white border-gray-300 text-gray-900'
                        }`}
                        min="0"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Documentos */}
              <div className="mt-6">
                <h3 className={`text-lg font-medium mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Documentos y Certificaciones
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Revisión Técnica
                    </label>
                    <input
                      type="date"
                      value={equipmentData.revision_tecnica_fecha}
                      onChange={(e) => setEquipmentData(prev => ({ ...prev, revision_tecnica_fecha: e.target.value }))}
                      className={`w-full px-3 py-2 border rounded-lg transition-colors ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    />
                  </div>
                  
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      SOAP
                    </label>
                    <input
                      type="date"
                      value={equipmentData.soap_fecha}
                      onChange={(e) => setEquipmentData(prev => ({ ...prev, soap_fecha: e.target.value }))}
                      className={`w-full px-3 py-2 border rounded-lg transition-colors ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    />
                  </div>
                  
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Permiso de Circulación
                    </label>
                    <input
                      type="date"
                      value={equipmentData.permiso_circulacion_fecha}
                      onChange={(e) => setEquipmentData(prev => ({ ...prev, permiso_circulacion_fecha: e.target.value }))}
                      className={`w-full px-3 py-2 border rounded-lg transition-colors ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* Información adicional */}
              <div className="mt-6">
                <h3 className={`text-lg font-medium mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Información Adicional
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Propietario
                    </label>
                    <input
                      type="text"
                      value={equipmentData.propietario}
                      onChange={(e) => setEquipmentData(prev => ({ ...prev, propietario: e.target.value }))}
                      className={`w-full px-3 py-2 border rounded-lg transition-colors ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    />
                  </div>
                  
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Conductor Habitual
                    </label>
                    <input
                      type="text"
                      value={equipmentData.conductor_habitual}
                      onChange={(e) => setEquipmentData(prev => ({ ...prev, conductor_habitual: e.target.value }))}
                      className={`w-full px-3 py-2 border rounded-lg transition-colors ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Observaciones
                  </label>
                  <textarea
                    value={equipmentData.observaciones}
                    onChange={(e) => setEquipmentData(prev => ({ ...prev, observaciones: e.target.value }))}
                    rows={3}
                    className={`w-full px-3 py-2 border rounded-lg transition-colors ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                    placeholder="Observaciones adicionales sobre el equipo..."
                  />
                </div>
              </div>
            </div>
          ) : (
            // FORMULARIO DE REGISTRO DE MANTENIMIENTO
            <div className="p-6">
              <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center">
                  <FileText className="w-5 h-5 text-blue-600 mr-2" />
                  <div>
                    <p className="font-medium text-blue-900">
                      {selectedEquipment?.nombre_equipo}
                    </p>
                    <p className="text-sm text-blue-700">
                      {selectedEquipment?.patente && `${selectedEquipment.patente} • `}
                      {selectedEquipment?.marca} {selectedEquipment?.modelo}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Información del mantenimiento */}
                <div className="space-y-4">
                  <h3 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Información del Mantenimiento
                  </h3>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Tipo de Mantenimiento
                    </label>
                    <select
                      value={maintenanceRecord.tipo_mantencion}
                      onChange={(e) => setMaintenanceRecord(prev => ({ ...prev, tipo_mantencion: e.target.value }))}
                      className={`w-full px-3 py-2 border rounded-lg transition-colors ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    >
                      {maintenanceTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Fecha de Mantenimiento *
                    </label>
                    <input
                      type="date"
                      value={maintenanceRecord.fecha_mantencion}
                      onChange={(e) => setMaintenanceRecord(prev => ({ ...prev, fecha_mantencion: e.target.value }))}
                      className={`w-full px-3 py-2 border rounded-lg transition-colors ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Kilometraje
                      </label>
                      <input
                        type="number"
                        value={maintenanceRecord.kilometraje_mantencion}
                        onChange={(e) => setMaintenanceRecord(prev => ({ ...prev, kilometraje_mantencion: e.target.value }))}
                        className={`w-full px-3 py-2 border rounded-lg transition-colors ${
                          darkMode 
                            ? 'bg-gray-700 border-gray-600 text-white' 
                            : 'bg-white border-gray-300 text-gray-900'
                        }`}
                        min="0"
                      />
                    </div>
                    
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Horas de Uso
                      </label>
                      <input
                        type="number"
                        value={maintenanceRecord.horas_mantencion}
                        onChange={(e) => setMaintenanceRecord(prev => ({ ...prev, horas_mantencion: e.target.value }))}
                        className={`w-full px-3 py-2 border rounded-lg transition-colors ${
                          darkMode 
                            ? 'bg-gray-700 border-gray-600 text-white' 
                            : 'bg-white border-gray-300 text-gray-900'
                        }`}
                        min="0"
                      />
                    </div>
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Descripción del Trabajo Realizado *
                    </label>
                    <textarea
                      value={maintenanceRecord.descripcion_trabajo}
                      onChange={(e) => setMaintenanceRecord(prev => ({ ...prev, descripcion_trabajo: e.target.value }))}
                      rows={4}
                      className={`w-full px-3 py-2 border rounded-lg transition-colors ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                      placeholder="Describe el trabajo realizado, problemas encontrados, soluciones aplicadas..."
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Estado del Equipo Post-Mantenimiento
                    </label>
                    <select
                      value={maintenanceRecord.estado_equipo_post}
                      onChange={(e) => setMaintenanceRecord(prev => ({ ...prev, estado_equipo_post: e.target.value }))}
                      className={`w-full px-3 py-2 border rounded-lg transition-colors ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    >
                      <option value="operativo">Operativo</option>
                      <option value="en mantenimiento">En Mantenimiento</option>
                      <option value="fuera de servicio">Fuera de Servicio</option>
                    </select>
                  </div>
                </div>

                {/* Costos y responsables */}
                <div className="space-y-4">
                  <h3 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Costos y Responsables
                  </h3>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Repuestos Utilizados
                    </label>
                    <textarea
                      value={maintenanceRecord.repuestos_utilizados}
                      onChange={(e) => setMaintenanceRecord(prev => ({ ...prev, repuestos_utilizados: e.target.value }))}
                      rows={3}
                      className={`w-full px-3 py-2 border rounded-lg transition-colors ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                      placeholder="Lista de repuestos utilizados..."
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Costo Repuestos
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={maintenanceRecord.costo_repuestos}
                        onChange={(e) => setMaintenanceRecord(prev => ({ ...prev, costo_repuestos: e.target.value }))}
                        className={`w-full px-3 py-2 border rounded-lg transition-colors ${
                          darkMode 
                            ? 'bg-gray-700 border-gray-600 text-white' 
                            : 'bg-white border-gray-300 text-gray-900'
                        }`}
                        min="0"
                      />
                    </div>
                    
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Costo Mano de Obra
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={maintenanceRecord.costo_mano_obra}
                        onChange={(e) => setMaintenanceRecord(prev => ({ ...prev, costo_mano_obra: e.target.value }))}
                        className={`w-full px-3 py-2 border rounded-lg transition-colors ${
                          darkMode 
                            ? 'bg-gray-700 border-gray-600 text-white' 
                            : 'bg-white border-gray-300 text-gray-900'
                        }`}
                        min="0"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Taller Responsable
                      </label>
                      <input
                        type="text"
                        value={maintenanceRecord.taller_responsable}
                        onChange={(e) => setMaintenanceRecord(prev => ({ ...prev, taller_responsable: e.target.value }))}
                        className={`w-full px-3 py-2 border rounded-lg transition-colors ${
                          darkMode 
                            ? 'bg-gray-700 border-gray-600 text-white' 
                            : 'bg-white border-gray-300 text-gray-900'
                        }`}
                        placeholder="Nombre del taller"
                      />
                    </div>
                    
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Técnico Responsable
                      </label>
                      <input
                        type="text"
                        value={maintenanceRecord.tecnico_responsable}
                        onChange={(e) => setMaintenanceRecord(prev => ({ ...prev, tecnico_responsable: e.target.value }))}
                        className={`w-full px-3 py-2 border rounded-lg transition-colors ${
                          darkMode 
                            ? 'bg-gray-700 border-gray-600 text-white' 
                            : 'bg-white border-gray-300 text-gray-900'
                        }`}
                        placeholder="Nombre del técnico"
                      />
                    </div>
                  </div>

                  <div className="mt-6">
                    <h4 className={`text-md font-medium mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      Programación de Próximo Mantenimiento
                    </h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          Próx. Mant. (km)
                        </label>
                        <input
                          type="number"
                          value={maintenanceRecord.prox_mantencion_km}
                          onChange={(e) => setMaintenanceRecord(prev => ({ ...prev, prox_mantencion_km: e.target.value }))}
                          className={`w-full px-3 py-2 border rounded-lg transition-colors ${
                            darkMode 
                              ? 'bg-gray-700 border-gray-600 text-white' 
                              : 'bg-white border-gray-300 text-gray-900'
                          }`}
                          min="0"
                        />
                      </div>
                      
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          Próx. Mant. (horas)
                        </label>
                        <input
                          type="number"
                          value={maintenanceRecord.prox_mantencion_horas}
                          onChange={(e) => setMaintenanceRecord(prev => ({ ...prev, prox_mantencion_horas: e.target.value }))}
                          className={`w-full px-3 py-2 border rounded-lg transition-colors ${
                            darkMode 
                              ? 'bg-gray-700 border-gray-600 text-white' 
                              : 'bg-white border-gray-300 text-gray-900'
                          }`}
                          min="0"
                        />
                      </div>
                      
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          Fecha Programada
                        </label>
                        <input
                          type="date"
                          value={maintenanceRecord.prox_mantencion_fecha}
                          onChange={(e) => setMaintenanceRecord(prev => ({ ...prev, prox_mantencion_fecha: e.target.value }))}
                          className={`w-full px-3 py-2 border rounded-lg transition-colors ${
                            darkMode 
                              ? 'bg-gray-700 border-gray-600 text-white' 
                              : 'bg-white border-gray-300 text-gray-900'
                          }`}
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Observaciones Adicionales
                    </label>
                    <textarea
                      value={maintenanceRecord.observaciones}
                      onChange={(e) => setMaintenanceRecord(prev => ({ ...prev, observaciones: e.target.value }))}
                      rows={3}
                      className={`w-full px-3 py-2 border rounded-lg transition-colors ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                      placeholder="Observaciones adicionales sobre el mantenimiento..."
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={`flex justify-end space-x-3 p-6 border-t ${
          darkMode ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <button
            onClick={() => setShowModal(false)}
            className={`px-6 py-2 rounded-lg border transition-colors ${
              darkMode 
                ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            Cancelar
          </button>
          <button
            onClick={modalType === 'maintenance' ? handleSaveEquipment : handleSaveMaintenanceRecord}
            disabled={loading}
            className={`px-6 py-2 text-white rounded-lg transition-colors ${
              loading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : `${currentTheme.buttonBg} ${currentTheme.buttonHover}`
            }`}
          >
            {loading ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MaintenanceModal;