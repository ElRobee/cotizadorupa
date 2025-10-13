import React, { useState, useEffect } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../lib/firebase";
import { X, Save, FileText, CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import { generateChecklistPDF } from '../utils/checklistPDF';

const defaultChecklistItems = [
  // sección: Sistema de luces / parte externa
  { key: "luz_delantera_alta", label: "Luz Delantera alta (NN)*", value: "B" },
  { key: "luz_delantera_baja", label: "Luz Delantera baja (NN)*", value: "B" },
  { key: "luces_emergencia", label: "Luces de emergencia (NN)*", value: "B" },
  { key: "luces_neblineros", label: "Luces neblineros", value: "B" },
  { key: "luz_direccional", label: "Luz direccional", value: "B" },
  { key: "luz_freno_posterior", label: "Luz de freno posterior", value: "B" },
  { key: "luces_farospiratas", label: "Luces de faros piratas", value: "B" },

  // parte externa
  { key: "parabrisas_delantero", label: "Parabrisas delantera", value: "B" },
  { key: "parabrisas_posterior", label: "Parabrisas posterior", value: "B" },
  { key: "limpia_parabrisas", label: "Limpia parabrisas", value: "B" },
  { key: "vidrio_parabrisas", label: "Vidrio de parabrisas", value: "B" },
  { key: "espejos_laterales", label: "Espejos laterales", value: "B" },
  { key: "espejo_retrovisor", label: "Espejo retrovisor", value: "B" },
  { key: "espejo_antideslumbrante", label: "Espejo retrovisor antideslumbrante", value: "B" },

  // parte interna / operativos
  { key: "estado_tablero", label: "Estado de Tablero / Indicadores operativos", value: "B" },
  { key: "freno_mano", label: "Freno de mano (NN)*", value: "B" },
  { key: "freno_servicio", label: "Freno de servicio (NN)*", value: "B" },
  { key: "cinturon_chofer", label: "Cinturón de seguridad Chofer (NN)*", value: "B" },
  { key: "cinturon_copiloto", label: "Cinturón de seguridad copiloto (NN)*", value: "B" },
  { key: "cinturon_asiento_posterior", label: "Cinturón de seguridad asiento posterior (NN)*", value: "B" },

  // orden y otros
  { key: "linterna_mano", label: "Linterna de mano", value: "NA" },
  { key: "orden_limpieza", label: "Orden y limpieza de cabina", value: "B" },
  { key: "direccion", label: "Dirección (NN)*", value: "B" },

  // llantas
  { key: "llanta_delantera_dcha", label: "Llanta delantera derecha", value: "B" },
  { key: "llanta_delantera_izq", label: "Llanta delantera Izquierda", value: "B" },
  { key: "llanta_posterior_dcha", label: "Llanta posterior derecha", value: "B" },
  { key: "llanta_posterior_izq", label: "Llanta posterior izquierda", value: "B" },
  { key: "llanta_repuesto", label: "Llanta de repuesto", value: "B" },

  // accesorios seguridad y tapas
  { key: "conos_seguridad", label: "Conos de Seguridad (2)", value: "NA" },
  { key: "extintor", label: "Extintor", value: "B" },
  { key: "alarma_retrocesos", label: "Alarma de Retrocesos (NN)*", value: "NA" },
  { key: "claxon", label: "Claxon (NN)*", value: "B" },
  { key: "cuñas_seguridad", label: "Cuñas de Seguridad (2)", value: "B" },
  { key: "tapa_tanque", label: "Tapa de tanque de gasolina y/o petróleo", value: "B" },
  { key: "gata_hidraulica", label: "Gata hidráulica", value: "B" },
  { key: "herramientas_palanca", label: "Herramientas y palanca de ruedas", value: "B" },
  { key: "cable_cadena", label: "Cable, cadena y/o estrobo", value: "B" },
];

export default function ChecklistModal({ isOpen, onClose, initialData = {}, theme = 'blue', darkMode = false }) {
  // Datos generales arriba
  const [tipoVehiculo, setTipoVehiculo] = useState(initialData.tipoVehiculo || "MINI BUS");
  const [modelo, setModelo] = useState(initialData.modelo || "TRANSIT");
  const [patente, setPatente] = useState(initialData.patente || "LDXS-27");
  const [empresa, setEmpresa] = useState(initialData.empresa || "VITALIA SA");
  const [conductor, setConductor] = useState(initialData.conductor || "");
  const [rut, setRut] = useState(initialData.rut || "");
  const [fecha, setFecha] = useState(initialData.fecha || new Date().toISOString().slice(0, 10));
  const [kmInicial, setKmInicial] = useState(initialData.kmInicial || "");
  const [kmFinal, setKmFinal] = useState(initialData.kmFinal || "");
  const [observaciones, setObservaciones] = useState(initialData.observaciones || "CAMION EN PERFECTAS CONDICIONES");

  const [checklist, setChecklist] = useState(defaultChecklistItems);
  const [saving, setSaving] = useState(false);
  const [printing, setPrinting] = useState(false);
  const [error, setError] = useState(null);

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

  useEffect(() => {
    // si initialData trae checklist, mapearlo
    if (initialData.checklist && Array.isArray(initialData.checklist)) {
      // initialData.checklist debe ser array de { key, value }
      const mapped = defaultChecklistItems.map(item => {
        const found = initialData.checklist.find(c => c.key === item.key);
        return found ? { ...item, value: found.value } : item;
      });
      setChecklist(mapped);
    }
  }, [initialData]);

  const handleSelectChange = (key, value) => {
    setChecklist(prev =>
      prev.map(item => (item.key === key ? { ...item, value } : item))
    );
  };

  const validate = () => {
    if (!patente) return "La patente es requerida.";
    if (!empresa) return "La empresa es requerida.";
    if (!fecha) return "La fecha es requerida.";
    return null;
  };

  const handleSave = async () => {
    setError(null);
    const v = validate();
    if (v) {
      setError(v);
      return;
    }

    setSaving(true);
    const payload = {
      tipoVehiculo,
      modelo,
      patente,
      empresa,
      conductor,
      rut,
      fecha,
      kmInicial,
      kmFinal,
      observaciones,
      checklist, // array de objetos {key,label,value}
      createdAt: serverTimestamp(),
    };

    try {
      await addDoc(collection(db, "checklist"), payload);
      setSaving(false);
      // feedback simple — puedes reemplazar por toast
      alert("Checklist guardado correctamente.");
      onClose && onClose();
    } catch (err) {
      console.error("Error guardando checklist:", err);
      setError("Error al guardar. Revisa la consola.");
      setSaving(false);
    }
  };

  const handlePrint = async () => {
    setPrinting(true);
    try {
      const checklistData = {
        tipoVehiculo,
        modelo,
        patente,
        empresa,
        conductor,
        rut,
        fecha,
        kmInicial,
        kmFinal,
        observaciones,
        checklist
      };
      await generateChecklistPDF(checklistData);
    } catch (error) {
      console.error('Error al generar PDF:', error);
      setError('Error al generar el PDF del checklist');
    } finally {
      setPrinting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} rounded-lg shadow-xl w-full max-w-6xl mx-4 max-h-[90vh] overflow-hidden`}>
        {/* Header */}
        <div className={`flex items-center justify-between p-6 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex items-center space-x-3">
            <CheckCircle className={`w-6 h-6 ${currentTheme.accent}`} />
            <h2 className="text-xl font-semibold">Checklist de Vehículo</h2>
          </div>
          <button
            onClick={() => !saving && onClose && onClose()}
            className={`p-2 rounded-lg hover:bg-gray-100 ${darkMode ? 'hover:bg-gray-700' : ''} transition-colors`}
            disabled={saving}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* Datos generales */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <div>
              <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                Tipo de Vehículo
              </label>
              <input
                type="text"
                value={tipoVehiculo}
                onChange={(e) => setTipoVehiculo(e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-transparent ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                } ${currentTheme.primary.includes('blue') ? 'focus:ring-blue-500' :
                     currentTheme.primary.includes('green') ? 'focus:ring-green-500' :
                     currentTheme.primary.includes('purple') ? 'focus:ring-purple-500' :
                     'focus:ring-red-500'}`}
              />
            </div>

            <div>
              <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                Modelo
              </label>
              <input
                type="text"
                value={modelo}
                onChange={(e) => setModelo(e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-transparent ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                } ${currentTheme.primary.includes('blue') ? 'focus:ring-blue-500' :
                     currentTheme.primary.includes('green') ? 'focus:ring-green-500' :
                     currentTheme.primary.includes('purple') ? 'focus:ring-purple-500' :
                     'focus:ring-red-500'}`}
              />
            </div>

            <div>
              <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                Patente
              </label>
              <input
                type="text"
                value={patente}
                onChange={(e) => setPatente(e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-transparent ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                } ${currentTheme.primary.includes('blue') ? 'focus:ring-blue-500' :
                     currentTheme.primary.includes('green') ? 'focus:ring-green-500' :
                     currentTheme.primary.includes('purple') ? 'focus:ring-purple-500' :
                     'focus:ring-red-500'}`}
              />
            </div>

            <div>
              <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                Empresa
              </label>
              <input
                type="text"
                value={empresa}
                onChange={(e) => setEmpresa(e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-transparent ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                } ${currentTheme.primary.includes('blue') ? 'focus:ring-blue-500' :
                     currentTheme.primary.includes('green') ? 'focus:ring-green-500' :
                     currentTheme.primary.includes('purple') ? 'focus:ring-purple-500' :
                     'focus:ring-red-500'}`}
              />
            </div>

            <div>
              <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                Conductor
              </label>
              <input
                type="text"
                value={conductor}
                onChange={(e) => setConductor(e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-transparent ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                } ${currentTheme.primary.includes('blue') ? 'focus:ring-blue-500' :
                     currentTheme.primary.includes('green') ? 'focus:ring-green-500' :
                     currentTheme.primary.includes('purple') ? 'focus:ring-purple-500' :
                     'focus:ring-red-500'}`}
              />
            </div>

            <div>
              <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                RUT
              </label>
              <input
                type="text"
                value={rut}
                onChange={(e) => setRut(e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-transparent ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                } ${currentTheme.primary.includes('blue') ? 'focus:ring-blue-500' :
                     currentTheme.primary.includes('green') ? 'focus:ring-green-500' :
                     currentTheme.primary.includes('purple') ? 'focus:ring-purple-500' :
                     'focus:ring-red-500'}`}
              />
            </div>

            <div>
              <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                Fecha
              </label>
              <input
                type="date"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-transparent ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                } ${currentTheme.primary.includes('blue') ? 'focus:ring-blue-500' :
                     currentTheme.primary.includes('green') ? 'focus:ring-green-500' :
                     currentTheme.primary.includes('purple') ? 'focus:ring-purple-500' :
                     'focus:ring-red-500'}`}
              />
            </div>

            <div>
              <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                Kilometraje Inicial
              </label>
              <input
                type="number"
                value={kmInicial}
                onChange={(e) => setKmInicial(e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-transparent ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                } ${currentTheme.primary.includes('blue') ? 'focus:ring-blue-500' :
                     currentTheme.primary.includes('green') ? 'focus:ring-green-500' :
                     currentTheme.primary.includes('purple') ? 'focus:ring-purple-500' :
                     'focus:ring-red-500'}`}
              />
            </div>

            <div>
              <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                Kilometraje Final
              </label>
              <input
                type="number"
                value={kmFinal}
                onChange={(e) => setKmFinal(e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-transparent ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                } ${currentTheme.primary.includes('blue') ? 'focus:ring-blue-500' :
                     currentTheme.primary.includes('green') ? 'focus:ring-green-500' :
                     currentTheme.primary.includes('purple') ? 'focus:ring-purple-500' :
                     'focus:ring-red-500'}`}
              />
            </div>
          </div>

          {/* Checklist table */}
          <div className="mt-6">
            <h4 className={`font-semibold text-lg ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
              Lista de Verificación
            </h4>

            <div className={`border rounded-lg overflow-hidden ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <tr>
                      <th className={`text-left py-3 px-4 font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Ítem de Verificación
                      </th>
                      <th className={`text-center py-3 px-4 font-medium w-32 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Estado
                      </th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${darkMode ? 'divide-gray-600' : 'divide-gray-200'}`}>
                    {checklist.map((item) => (
                      <tr key={item.key} className={`${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'} transition-colors`}>
                        <td className="py-3 px-4">
                          <span className={`${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                            {item.label}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <select
                            value={item.value}
                            onChange={(e) => handleSelectChange(item.key, e.target.value)}
                            className={`px-3 py-1 rounded-full text-sm font-medium border-0 focus:ring-2 focus:ring-offset-0 ${
                              item.value === 'B' 
                                ? darkMode 
                                  ? 'bg-green-900 text-green-200' 
                                  : 'bg-green-100 text-green-800'
                                : item.value === 'R' 
                                ? darkMode 
                                  ? 'bg-red-900 text-red-200' 
                                  : 'bg-red-100 text-red-800'
                                : darkMode 
                                ? 'bg-gray-700 text-gray-300' 
                                : 'bg-gray-100 text-gray-800'
                            } ${currentTheme.primary.includes('blue') ? 'focus:ring-blue-500' :
                                 currentTheme.primary.includes('green') ? 'focus:ring-green-500' :
                                 currentTheme.primary.includes('purple') ? 'focus:ring-purple-500' :
                                 'focus:ring-red-500'}`}
                          >
                            <option value="B">Bueno</option>
                            <option value="R">Regular/Malo</option>
                            <option value="NA">No Aplica</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Observaciones */}
          <div className="mt-6">
            <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
              Observaciones
            </label>
            <textarea
              rows={4}
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
              placeholder="Ingrese observaciones adicionales..."
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-transparent resize-vertical ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
              } ${currentTheme.primary.includes('blue') ? 'focus:ring-blue-500' :
                   currentTheme.primary.includes('green') ? 'focus:ring-green-500' :
                   currentTheme.primary.includes('purple') ? 'focus:ring-purple-500' :
                   'focus:ring-red-500'}`}
            />
          </div>

          {/* Error */}
          {error && (
            <div className="mt-4 p-4 rounded-lg bg-red-50 border border-red-200 flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <span className="text-sm text-red-700">{error}</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={`flex items-center justify-between p-6 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <button
            onClick={() => !saving && onClose && onClose()}
            disabled={saving || printing}
            className={`px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors ${
              darkMode 
                ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                : 'border-gray-300 text-gray-700'
            }`}
          >
            Cancelar
          </button>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={handlePrint}
              disabled={saving || printing}
              className={`px-4 py-2 rounded-lg text-white font-medium transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                darkMode ? 'bg-gray-600 hover:bg-gray-700' : 'bg-gray-600 hover:bg-gray-700'
              }`}
            >
              {printing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  <span>Generando...</span>
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4" />
                  <span>Imprimir PDF</span>
                </>
              )}
            </button>

            <button
              onClick={handleSave}
              disabled={saving || printing}
              className={`px-6 py-2 rounded-lg text-white font-medium transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                currentTheme.primary
              }`}
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  <span>Guardando...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Guardar</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
