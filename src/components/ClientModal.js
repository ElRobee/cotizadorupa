import React, { memo, useState, useEffect } from "react";
import { X, AlertCircle } from "lucide-react";
import { getThemeClasses } from "../lib/utils.js";
import { useClients } from "../hooks/useClients";

const ClientModal = memo(({ 
  isEditing, 
  clientData, 
  onCancel, 
  theme = "blue", 
  darkMode = false,
  formatRut,
  validateRut,
  validateEmail
}) => {
  const currentTheme = getThemeClasses(theme, darkMode);
  const { addClient, updateClient } = useClients();

  // Estado local para el formulario
  const [formData, setFormData] = useState(clientData || {});

  // Si cambian los datos (ej: editar), los cargamos al estado
  useEffect(() => {
    setFormData(clientData || {});
  }, [clientData]);

  // Cambiar campos
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Guardar cliente en Firebase
  const handleSave = async () => {
    try {
      if (!formData.rut || !formData.empresa) return;

      if (isEditing && formData.id) {
        await updateClient(formData.id, formData);
      } else {
        await addClient(formData);
      }
      onCancel(); // cerrar modal al terminar
    } catch (error) {
      console.error("Error al guardar cliente:", error);
      alert("Hubo un error al guardar el cliente. Inténtalo nuevamente.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div
        className={`rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto ${
          darkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        {/* HEADER */}
        <div
          className={`sticky top-0 border-b px-6 py-4 rounded-t-xl ${
            darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
          }`}
        >
          <div className="flex justify-between items-center">
            <h2
              className={`text-2xl font-bold ${
                darkMode ? "text-white" : "text-gray-800"
              }`}
            >
              {isEditing ? "Editar Cliente" : "Nuevo Cliente"}
            </h2>
            <button
              onClick={onCancel}
              className={`transition-colors ${
                darkMode
                  ? "text-gray-400 hover:text-gray-200"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* CONTENIDO */}
        <div className="p-6 space-y-6">
          {/* RUT y Empresa */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                RUT *
              </label>
              <input
                type="text"
                value={formData.rut || ""}
                onChange={(e) => handleInputChange("rut", formatRut(e.target.value))}
                placeholder="12.345.678-9"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${currentTheme.focus} ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                }`}
              />
            </div>
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                Empresa *
              </label>
              <input
                type="text"
                value={formData.empresa || ""}
                onChange={(e) => handleInputChange("empresa", e.target.value)}
                placeholder="Nombre de la empresa"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${currentTheme.focus} ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                }`}
              />
            </div>
          </div>

          {/* Encargado y Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                Encargado
              </label>
              <input
                type="text"
                value={formData.encargado || ""}
                onChange={(e) => handleInputChange("encargado", e.target.value)}
                placeholder="Nombre del encargado"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${currentTheme.focus} ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                }`}
              />
            </div>
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                Email
              </label>
              <input
                type="email"
                value={formData.email || ""}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="correo@empresa.com"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${currentTheme.focus} ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                }`}
              />
            </div>
          </div>

          {/* Teléfono y Ciudad */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                Teléfono
              </label>
              <input
                type="tel"
                value={formData.telefono || ""}
                onChange={(e) => handleInputChange("telefono", e.target.value)}
                placeholder="+56 9 1234 5678"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${currentTheme.focus} ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                }`}
              />
            </div>
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                Ciudad
              </label>
              <input
                type="text"
                value={formData.ciudad || ""}
                onChange={(e) => handleInputChange("ciudad", e.target.value)}
                placeholder="Ciudad"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${currentTheme.focus} ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                }`}
              />
            </div>
          </div>

          {/* Dirección */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
              Dirección
            </label>
            <textarea
              value={formData.direccion || ""}
              onChange={(e) => handleInputChange("direccion", e.target.value)}
              rows={2}
              placeholder="Dirección completa"
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${currentTheme.focus} ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
              }`}
            />
          </div>

          {/* Vista previa */}
          {(formData?.empresa || formData?.rut) && (
            <div className={`border rounded-lg p-4 ${
              darkMode ? "bg-gray-700 border-gray-600" : "bg-gray-50 border-gray-200"
            }`}>
              <h4 className={`text-sm font-semibold mb-2 ${darkMode ? "text-gray-200" : "text-gray-800"}`}>
                Vista Previa
              </h4>
              <div className={`text-sm space-y-1 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                {formData.empresa && <p><strong>Empresa:</strong> {formData.empresa}</p>}
                {formData.rut && <p><strong>RUT:</strong> {formData.rut}</p>}
                {formData.encargado && <p><strong>Contacto:</strong> {formData.encargado}</p>}
                {formData.email && <p><strong>Email:</strong> {formData.email}</p>}
              </div>
            </div>
          )}

          {/* Validaciones */}
          {formData.rut && !validateRut(formData.rut) && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 dark:bg-red-900 dark:border-red-800">
              <div className="flex items-center">
                <AlertCircle className="w-4 h-4 text-red-500 mr-2" />
                <span className="text-sm text-red-700 dark:text-red-400">
                  El RUT ingresado no es válido
                </span>
              </div>
            </div>
          )}

          {formData.email && !validateEmail(formData.email) && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 dark:bg-red-900 dark:border-red-800">
              <div className="flex items-center">
                <AlertCircle className="w-4 h-4 text-red-500 mr-2" />
                <span className="text-sm text-red-700 dark:text-red-400">
                  El email ingresado no es válido
                </span>
              </div>
            </div>
          )}
        </div>

        {/* BOTONES */}
        <div
          className={`sticky bottom-0 border-t px-6 py-4 flex justify-end space-x-3 ${
            darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
          }`}
        >
          <button
            onClick={onCancel}
            className={`px-6 py-2 border rounded-lg transition-colors ${
              darkMode
                ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                : "border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={!formData.rut || !formData.empresa}
            className={`px-6 py-2 text-white rounded-lg transition-colors ${
              !formData.rut || !formData.empresa
                ? "bg-gray-400 cursor-not-allowed"
                : `${currentTheme.buttonBg} ${currentTheme.buttonHover}`
            }`}
          >
            {isEditing ? "Actualizar" : "Guardar"} Cliente
          </button>
        </div>
      </div>
    </div>
  );
});

export default ClientModal;
