import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, Save, FileText, Zap, CheckCircle } from 'lucide-react';
import { getThemeClasses } from '../lib/utils';
import { useFichasTecnicas } from '../hooks/useFichasTecnicas';
import { initializeFichasTecnicas } from '../utils/fichasInitializer';

const FichasAdminModal = ({ isOpen, onClose, theme = 'blue', darkMode = false, canEditCompany }) => {
  const currentTheme = getThemeClasses(theme, darkMode);
  const { fichas, loading, addFicha, updateFicha, deleteFicha } = useFichasTecnicas();
  
  // Helper para verificar permisos de edición
  const userCanEdit = typeof canEditCompany === 'function' ? canEditCompany() : canEditCompany;
  
  const [editingFicha, setEditingFicha] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    urlPDF: ''
  });
  const [saving, setSaving] = useState(false);
  const [initializing, setInitializing] = useState(false);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setEditingFicha(null);
      setShowForm(false);
      setFormData({ nombre: '', urlPDF: '' });
    }
  }, [isOpen]);

  const handleStartEdit = (ficha) => {
    setEditingFicha(ficha);
    setFormData({
      nombre: ficha.nombre,
      urlPDF: ficha.urlPDF
    });
    setShowForm(true);
  };

  const handleStartNew = () => {
    setEditingFicha(null);
    setFormData({ nombre: '', urlPDF: '' });
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!formData.nombre || !formData.urlPDF) {
      alert('Por favor completa todos los campos');
      return;
    }

    setSaving(true);
    try {
      let result;
      if (editingFicha) {
        result = await updateFicha(editingFicha.id, formData);
      } else {
        result = await addFicha(formData);
      }

      if (result.success) {
        setShowForm(false);
        setEditingFicha(null);
        setFormData({ nombre: '', urlPDF: '' });
        alert(editingFicha ? 'Ficha actualizada correctamente' : 'Ficha creada correctamente');
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error('Error al guardar ficha:', error);
      alert('Error al guardar la ficha');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (ficha) => {
    if (!confirm(`¿Estás seguro de que deseas eliminar la ficha "${ficha.nombre}"?`)) {
      return;
    }

    try {
      const result = await deleteFicha(ficha.id);
      if (result.success) {
        alert('Ficha eliminada correctamente');
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error('Error al eliminar ficha:', error);
      alert('Error al eliminar la ficha');
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingFicha(null);
    setFormData({ nombre: '', urlPDF: '' });
  };

  const handleAutoInitialize = async () => {
    if (!confirm('¿Estás seguro de que deseas crear automáticamente todas las fichas técnicas desde el catálogo predefinido?\n\nEsto no duplicará fichas existentes.')) {
      return;
    }

    setInitializing(true);
    try {
      const result = await initializeFichasTecnicas();
      
      if (result.success) {
        alert(`✅ Proceso completado exitosamente!\n\n📝 Fichas creadas: ${result.created}\n⏭️ Fichas ya existentes: ${result.skipped}\n📋 Total procesadas: ${result.total}`);
      } else {
        alert(`❌ Error durante el proceso: ${result.error}`);
      }
    } catch (error) {
      console.error('Error al inicializar fichas:', error);
      alert('❌ Error inesperado al crear las fichas técnicas');
    } finally {
      setInitializing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-lg shadow-xl ${
        darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
      }`}>
        {/* Header */}
        <div className={`flex justify-between items-center p-6 border-b ${
          darkMode ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <div className="flex items-center space-x-3">
            <FileText className={`w-6 h-6 ${
              theme === 'blue' ? 'text-blue-600' :
              theme === 'green' ? 'text-green-600' :
              theme === 'purple' ? 'text-purple-600' :
              theme === 'red' ? 'text-red-600' :
              'text-gray-600'
            }`} />
            <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Administrar Fichas Técnicas
            </h2>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors ${
              darkMode 
                ? 'text-gray-400 hover:text-white hover:bg-gray-700' 
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
            }`}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {!showForm ? (
            <>
              {/* Info and Action Buttons */}
              <div className="mb-6">
                <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-4`}>
                  Gestiona las fichas técnicas disponibles para asociar a los servicios.
                </p>
                
                {/* Warning for non-admin users */}
                {!userCanEdit && (
                  <div className={`p-3 rounded-lg mb-4 ${darkMode ? 'bg-yellow-900 border-yellow-700' : 'bg-yellow-50 border-yellow-200'} border`}>
                    <div className="flex items-start space-x-2">
                      <span className="text-yellow-500 mt-0.5 flex-shrink-0">⚠️</span>
                      <div className={`text-sm ${darkMode ? 'text-yellow-200' : 'text-yellow-700'}`}>
                        <strong>Solo lectura:</strong> No tienes permisos para editar las fichas técnicas. Contacta con un administrador si necesitas realizar cambios.
                      </div>
                    </div>
                  </div>
                )}
                
                <div className={`p-3 rounded-lg mb-4 ${darkMode ? 'bg-blue-900 border-blue-700' : 'bg-blue-50 border-blue-200'} border`}>
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                    <div className={`text-sm ${darkMode ? 'text-blue-200' : 'text-blue-700'}`}>
                      <strong>Auto-Crear:</strong> Detecta automáticamente los PDFs subidos al repositorio y crea las fichas técnicas correspondientes según el catálogo predefinido.
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div></div>
                  <div className="flex space-x-3">
                    <button
                      onClick={handleAutoInitialize}
                      disabled={!userCanEdit || initializing}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                        !userCanEdit || initializing 
                          ? 'bg-gray-400 cursor-not-allowed text-white'
                          : 'bg-green-600 hover:bg-green-700 text-white'
                      }`}
                      title="Crear automáticamente todas las fichas del catálogo"
                    >
                      {initializing ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                          <span>Creando...</span>
                        </>
                      ) : (
                        <>
                          <Zap className="w-4 h-4" />
                          <span>Auto-Crear</span>
                        </>
                      )}
                    </button>
                    <button
                      onClick={handleStartNew}
                      disabled={!userCanEdit}
                      className={`flex items-center space-x-2 px-4 py-2 text-white rounded-lg transition-colors ${
                        !userCanEdit
                          ? 'bg-gray-400 cursor-not-allowed'
                          : `${currentTheme.buttonBg} ${currentTheme.buttonHover}`
                      }`}
                    >
                      <Plus className="w-4 h-4" />
                      <span>Nueva Ficha</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Fichas List */}
              {loading ? (
                <div className="text-center py-8">
                  <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Cargando fichas técnicas...
                  </p>
                </div>
              ) : fichas.length === 0 ? (
                <div className={`text-center py-12 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  <FileText className="w-16 h-16 mx-auto mb-4 opacity-20" />
                  <p className="text-lg font-medium mb-2">No hay fichas técnicas</p>
                  <p className="text-sm">Usa "Auto-Crear" para generar fichas desde el catálogo o crea una nueva manualmente.</p>
                </div>
              ) : (
                <div className={`rounded-lg overflow-hidden ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className={darkMode ? 'bg-gray-600' : 'bg-gray-100'}>
                        <tr>
                          <th className={`text-left py-3 px-4 text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-600'}`}>
                            Nombre
                          </th>
                          <th className={`text-left py-3 px-4 text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-600'}`}>
                            URL del PDF
                          </th>
                          <th className={`text-left py-3 px-4 text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-600'}`}>
                            Acciones
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {fichas
                          .sort((a, b) => a.nombre.localeCompare(b.nombre, 'es', { sensitivity: 'base' }))
                          .map((ficha) => (
                          <tr 
                            key={ficha.id}
                            className={`border-t transition-colors ${
                              darkMode 
                                ? 'border-gray-600 hover:bg-gray-600' 
                                : 'border-gray-200 hover:bg-white'
                            }`}
                          >
                            <td className={`py-3 px-4 font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                              {ficha.nombre}
                            </td>
                            <td className={`py-3 px-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                              <a 
                                href={ficha.urlPDF} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className={`${
                                  theme === 'blue' ? 'text-blue-600 hover:text-blue-800' :
                                  theme === 'green' ? 'text-green-600 hover:text-green-800' :
                                  theme === 'purple' ? 'text-purple-600 hover:text-purple-800' :
                                  theme === 'red' ? 'text-red-600 hover:text-red-800' :
                                  'text-gray-600 hover:text-gray-800'
                                } hover:underline`}
                              >
                                {ficha.urlPDF}
                              </a>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => handleStartEdit(ficha)}
                                  disabled={!userCanEdit}
                                  className={`p-1 rounded transition-colors ${
                                    !userCanEdit
                                      ? 'text-gray-400 cursor-not-allowed'
                                      : theme === 'blue' ? 'text-blue-600 hover:text-blue-800 hover:bg-blue-100' :
                                        theme === 'green' ? 'text-green-600 hover:text-green-800 hover:bg-green-100' :
                                        theme === 'purple' ? 'text-purple-600 hover:text-purple-800 hover:bg-purple-100' :
                                        theme === 'red' ? 'text-red-600 hover:text-red-800 hover:bg-red-100' :
                                        'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                                  } ${darkMode && userCanEdit ? 'hover:bg-opacity-20' : ''}`}
                                  title={!userCanEdit ? 'No tienes permisos para editar' : 'Editar'}
                                >
                                  <Edit2 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDelete(ficha)}
                                  disabled={!userCanEdit}
                                  className={`p-1 rounded transition-colors ${
                                    !userCanEdit
                                      ? 'text-gray-400 cursor-not-allowed'
                                      : `text-red-600 hover:text-red-800 ${
                                          darkMode ? 'hover:bg-red-100 hover:bg-opacity-20' : 'hover:bg-red-100'
                                        }`
                                  }`}
                                  title={!userCanEdit ? 'No tienes permisos para eliminar' : 'Eliminar'}
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
                </div>
              )}
            </>
          ) : (
            /* Form */
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {editingFicha ? 'Editar Ficha Técnica' : 'Nueva Ficha Técnica'}
                </h3>
                <button
                  onClick={handleCancel}
                  className={`text-sm px-3 py-1 rounded ${
                    darkMode 
                      ? 'text-gray-400 hover:text-white hover:bg-gray-700' 
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Cancelar
                </button>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Nombre de la Ficha Técnica
                  </label>
                  <input
                    type="text"
                    value={formData.nombre}
                    onChange={(e) => setFormData(prev => ({ ...prev, nombre: e.target.value }))}
                    placeholder="Ej: Plataforma Tijera Eléctrica 8m"
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${currentTheme.focus} ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    }`}
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    URL del PDF
                  </label>
                  <input
                    type="text"
                    value={formData.urlPDF}
                    onChange={(e) => setFormData(prev => ({ ...prev, urlPDF: e.target.value }))}
                    placeholder="Ej: /fichas/plataforma-tijera.pdf"
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${currentTheme.focus} ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    }`}
                  />
                  <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Los archivos PDF deben estar en la carpeta /public/fichas/ del proyecto
                  </p>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={handleCancel}
                  className={`px-4 py-2 border rounded-lg transition-colors ${
                    darkMode 
                      ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving || !formData.nombre || !formData.urlPDF}
                  className={`flex items-center space-x-2 px-4 py-2 text-white rounded-lg transition-colors ${
                    saving || !formData.nombre || !formData.urlPDF
                      ? 'bg-gray-400 cursor-not-allowed'
                      : `${currentTheme.buttonBg} ${currentTheme.buttonHover}`
                  }`}
                >
                  <Save className="w-4 h-4" />
                  <span>{saving ? 'Guardando...' : (editingFicha ? 'Actualizar' : 'Crear')}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FichasAdminModal;