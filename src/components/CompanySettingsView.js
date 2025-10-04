import React, { useState, useEffect } from "react";
import { useCompany } from "../hooks/useCompany";
import { handleThemeChange, toggleDarkMode, getThemeClasses } from "../lib/utils";
import { uploadCompanyLogo, removeCompanyLogo } from "../lib/logoService";

import { 
  Save, 
  Upload, 
  Trash2, 
  Palette, 
  Moon, 
  Sun, 
  Building2,
  Mail,
  Phone,
  MapPin,
  FileText,
  Image
} from "lucide-react";

const CompanySettingsView = ({ theme, darkMode, setTheme, setDarkMode, currentUser, userRole, canEditCompany }) => {
  const { company, updateCompany, loading } = useCompany();
  const currentTheme = getThemeClasses(theme, darkMode);

  const [editingCompany, setEditingCompany] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // Cargar datos iniciales cuando vienen de Firestore
  useEffect(() => {
    if (company) {
      setEditingCompany({ ...company });
      // Sincronizar theme desde la empresa si existe
      if (company.theme && setTheme) {
        setTheme(company.theme);
      }
      if (company.darkMode !== undefined && setDarkMode) {
        setDarkMode(company.darkMode);
      }
    } else if (!loading) {
      // Si no hay datos de empresa, inicializar con valores por defecto
      setEditingCompany({
        razonSocial: '',
        rut: '',
        direccion: '',
        telefono: '',
        email: '',
        logo: '',
        theme: theme,
        darkMode: darkMode
      });
    }
  }, [company, setTheme, setDarkMode, loading, theme, darkMode]);

  if (loading) {
    return (
      <div className={`flex-1 p-4 md:p-8 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="flex items-center justify-center py-20">
          <p className={`${darkMode ? "text-gray-400" : "text-gray-600"}`}>
            Cargando configuración de empresa...
          </p>
        </div>
      </div>
    );
  }
  
  if (!editingCompany) {
    return (
      <div className={`flex-1 p-4 md:p-8 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="flex items-center justify-center py-20">
          <p className={`${darkMode ? "text-gray-400" : "text-gray-600"}`}>
            Inicializando configuración de empresa...
          </p>
        </div>
      </div>
    );
  }

  // Manejar cambio de tema
  const handleThemeChangeLocal = (newTheme) => {
    if (setTheme) {
      handleThemeChange(newTheme, setTheme, currentUser?.uid);
    }
    setEditingCompany(prev => ({ ...prev, theme: newTheme }));
  };

  // Manejar cambio de modo oscuro
  const handleDarkModeToggle = () => {
    if (setDarkMode) {
      toggleDarkMode(darkMode, setDarkMode, currentUser?.uid);
    }
    setEditingCompany(prev => ({ ...prev, darkMode: !darkMode }));
  };

  // Guardar cambios en Firestore
  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateCompany(editingCompany);
      alert("Configuración guardada correctamente ✅");
    } catch (error) {
      console.error("Error al guardar:", error);
      alert("Error al guardar configuración ❌");
    } finally {
      setIsSaving(false);
    }
  };

  // Subir logo
  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const url = await uploadCompanyLogo(file, "main");
      setEditingCompany((prev) => ({ ...prev, logo: url }));
    } catch (error) {
      alert(error.message);
    }
  };

  // Eliminar logo
  const handleRemoveLogo = async () => {
    try {
      await removeCompanyLogo("main");
      setEditingCompany((prev) => ({ ...prev, logo: null }));
    } catch (error) {
      console.error("Error eliminando logo:", error);
      alert("No se pudo eliminar el logo");
    }
  };

  return (
    <div className={`flex-1 p-4 md:p-8 ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}>
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 md:mb-8 space-y-4 md:space-y-0">
        <div>
          <h1 className={`text-2xl md:text-3xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>
            Configuración de Empresa
          </h1>
          <p className={`mt-2 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
            Gestiona la información de tu empresa
          </p>
        </div>

        {/* BOTÓN GUARDAR - Solo para administradores */}
        {canEditCompany() && (
          <button
            onClick={handleSave}
            disabled={isSaving}
            className={`flex items-center space-x-2 px-4 md:px-6 py-2 md:py-3 text-white rounded-lg transition-colors ${currentTheme.buttonBg} ${currentTheme.buttonHover} ${
              isSaving ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <Save className="w-4 h-4 md:w-5 md:h-5" />
            <span className="text-sm md:text-base font-medium">
              {isSaving ? 'Guardando...' : 'Guardar Configuración'}
            </span>
          </button>
        )}
      </div>

      {/* CONTENIDO PRINCIPAL */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        
        {/* Sección de información de empresa - Solo administradores */}
        {canEditCompany() ? (
          <>
            {/* CARD: INFORMACIÓN BÁSICA */}
            <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl shadow-sm border p-6`}>
              <div className="flex items-center space-x-3 mb-6">
                <Building2 className={`w-6 h-6 ${currentTheme.primary}`} />
                <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Información Básica
                </h3>
              </div>

              <div className="space-y-4">
                {/* Razón Social */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Razón Social
                  </label>
                  <input
                    type="text"
                    value={editingCompany.razonSocial || ""}
                    onChange={(e) => setEditingCompany({ ...editingCompany, razonSocial: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${currentTheme.focus} ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    }`}
                    placeholder="Nombre de tu empresa"
                  />
                </div>

                {/* RUT */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    RUT
                  </label>
                  <input
                    type="text"
                    value={editingCompany.rut || ""}
                    onChange={(e) => setEditingCompany({ ...editingCompany, rut: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${currentTheme.focus} ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    }`}
                    placeholder="12.345.678-9"
                  />
                </div>
              </div>
            </div>

            {/* CARD: INFORMACIÓN DE CONTACTO */}
            <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl shadow-sm border p-6`}>
              <div className="flex items-center space-x-3 mb-6">
                <Phone className={`w-6 h-6 ${currentTheme.primary}`} />
                <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Información de Contacto
                </h3>
              </div>

              <div className="space-y-4">
                {/* Teléfono */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Teléfono
                  </label>
                  <input
                    type="text"
                    value={editingCompany.telefono || ""}
                    onChange={(e) => setEditingCompany({ ...editingCompany, telefono: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${currentTheme.focus} ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    }`}
                    placeholder="+56 9 1234 5678"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Email
                  </label>
                  <input
                    type="email"
                    value={editingCompany.email || ""}
                    onChange={(e) => setEditingCompany({ ...editingCompany, email: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${currentTheme.focus} ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    }`}
                    placeholder="contacto@empresa.com"
                  />
                </div>

                {/* Dirección */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Dirección
                  </label>
                  <input
                    type="text"
                    value={editingCompany.direccion || ""}
                    onChange={(e) => setEditingCompany({ ...editingCompany, direccion: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${currentTheme.focus} ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    }`}
                    placeholder="Dirección de la empresa"
                  />
                </div>
              </div>
            </div>

            {/* CARD: LOGO */}
            <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl shadow-sm border p-6`}>
              <div className="flex items-center space-x-3 mb-6">
                <Image className={`w-6 h-6 ${currentTheme.primary}`} />
                <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Logo de la Empresa
                </h3>
              </div>

              <div className="space-y-4">
                {/* Vista previa del logo */}
                {editingCompany.logo && (
                  <div className="flex justify-center">
                    <img
                      src={editingCompany.logo}
                      alt="Logo de la empresa"
                      className="h-20 md:h-24 object-contain rounded-lg border border-gray-200"
                    />
                  </div>
                )}

                {/* Subir logo */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Logo
                  </label>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <label className={`flex-1 flex items-center justify-center px-4 py-2 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                      darkMode 
                        ? 'border-gray-600 hover:border-gray-500 bg-gray-700 hover:bg-gray-600' 
                        : 'border-gray-300 hover:border-gray-400 bg-gray-50 hover:bg-gray-100'
                    }`}>
                      <Upload className="w-5 h-5 mr-2" />
                      <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Subir Logo
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="hidden"
                      />
                    </label>
                    
                    {editingCompany.logo && (
                      <button
                        onClick={handleRemoveLogo}
                        className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        <span className="text-sm">Eliminar</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          /* Mensaje para usuarios sin permisos */
          <div className={`col-span-full ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl shadow-sm border p-6`}>
            <div className="text-center py-8">
              <Shield className={`w-16 h-16 mx-auto mb-4 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`} />
              <h3 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Acceso Restringido
              </h3>
              <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Solo los administradores pueden editar la información de la empresa.
              </p>
              <p className={`mt-2 text-sm ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                Tu rol actual: <span className="font-medium">{userRole || 'Usuario'}</span>
              </p>
            </div>
          </div>
        )}

        {/* CARD: PERSONALIZACIÓN - Disponible para todos los usuarios */}
        <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl shadow-sm border p-6`}>
          <div className="flex items-center space-x-3 mb-6">
            <Palette className={`w-6 h-6 ${currentTheme.primary}`} />
            <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Personalización
            </h3>
          </div>

          <div className="space-y-4">
            {/* Tema */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Tema de Colores
              </label>
              <select
                value={theme}
                onChange={(e) => handleThemeChangeLocal(e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${currentTheme.focus} ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              >
                <option value="blue">Azul</option>
                <option value="green">Verde</option>
                <option value="purple">Morado</option>
                <option value="red">Rojo</option>
              </select>
            </div>

            {/* Modo Oscuro */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Modo Oscuro
              </label>
              <button
                onClick={handleDarkModeToggle}
                className={`flex items-center space-x-3 w-full px-4 py-3 rounded-lg border transition-colors ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 hover:bg-gray-600' 
                    : 'bg-gray-50 border-gray-300 hover:bg-gray-100'
                }`}
              >
                {darkMode ? (
                  <Sun className="w-5 h-5 text-yellow-500" />
                ) : (
                  <Moon className="w-5 h-5 text-blue-500" />
                )}
                <span className={`text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {darkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanySettingsView;
