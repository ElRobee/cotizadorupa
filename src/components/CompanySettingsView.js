import React, { useState, useEffect } from "react";
import { useCompany } from "../hooks/useCompany";
import { handleThemeChange, toggleDarkMode, getThemeClasses } from "../lib/utils";
import { uploadCompanyLogo, removeCompanyLogo } from "../lib/logoService";

import { Save, Upload, Trash2, Palette, Moon, Sun } from "lucide-react";

const CompanySettingsView = ({ theme, darkMode, setTheme, setDarkMode }) => {
  const { company, updateCompany, loading } = useCompany();

  const [editingCompany, setEditingCompany] = useState(null);
  const themeClasses = getThemeClasses(theme, darkMode);

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
        name: '',
        address: '',
        phone: '',
        email: '',
        website: '',
        logo: '',
        theme: theme,
        darkMode: darkMode
      });
    }
  }, [company, setTheme, setDarkMode, loading, theme, darkMode]);

  if (loading) return (
    <div className={`flex-1 p-8 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <p className={`text-center ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        Cargando configuración...
      </p>
    </div>
  );
  
  if (!editingCompany) return (
    <div className={`flex-1 p-8 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <p className={`text-center ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        Inicializando configuración de empresa...
      </p>
    </div>
  );

  // Manejar cambio de tema
  const handleThemeChangeLocal = (newTheme) => {
    if (setTheme) {
      setTheme(newTheme);
    }
    setEditingCompany(prev => ({ ...prev, theme: newTheme }));
  };

  // Manejar cambio de modo oscuro
  const handleDarkModeToggle = () => {
    const newDarkMode = !darkMode;
    if (setDarkMode) {
      setDarkMode(newDarkMode);
    }
    setEditingCompany(prev => ({ ...prev, darkMode: newDarkMode }));
  };

  // Guardar cambios en Firestore
  const handleSave = async () => {
    try {
      await updateCompany(editingCompany);
      alert("Configuración guardada correctamente ✅");
    } catch (error) {
      console.error("Error al guardar:", error);
      alert("Error al guardar configuración ❌");
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
    <div className={`flex-1 p-8 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className={`p-6 space-y-6 max-w-3xl mx-auto ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl shadow-sm border`}>
        <h2 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Configuración de Empresa
        </h2>

      {/* Razon Social */}
      <div>
        <label className={`block mb-1 font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          Razón Social
        </label>
        <input
          type="text"
          value={editingCompany.razonSocial || ""}
          onChange={(e) =>
            setEditingCompany({ ...editingCompany, razonSocial: e.target.value })
          }
          className={`w-full border rounded p-2 ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white border-gray-300'}`}
        />
      </div>

      {/* RUT */}
      <div>
        <label className={`block mb-1 font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          RUT
        </label>
        <input
          type="text"
          value={editingCompany.rut || ""}
          onChange={(e) =>
            setEditingCompany({ ...editingCompany, rut: e.target.value })
          }
          className={`w-full border rounded p-2 ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white border-gray-300'}`}
        />
      </div>

      {/* Dirección */}
      <div>
        <label className={`block mb-1 font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          Dirección
        </label>
        <input
          type="text"
          value={editingCompany.direccion || ""}
          onChange={(e) =>
            setEditingCompany({ ...editingCompany, direccion: e.target.value })
          }
          className={`w-full border rounded p-2 ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white border-gray-300'}`}
        />
      </div>

      {/* Ciudad y Región */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={`block mb-1 font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Ciudad
          </label>
          <input
            type="text"
            value={editingCompany.ciudad || ""}
            onChange={(e) =>
              setEditingCompany({ ...editingCompany, ciudad: e.target.value })
            }
            className={`w-full border rounded p-2 ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white border-gray-300'}`}
          />
        </div>
        <div>
          <label className={`block mb-1 font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Región
          </label>
          <input
            type="text"
            value={editingCompany.region || ""}
            onChange={(e) =>
              setEditingCompany({ ...editingCompany, region: e.target.value })
            }
            className={`w-full border rounded p-2 ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white border-gray-300'}`}
          />
        </div>
      </div>

      {/* Teléfono y Email */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={`block mb-1 font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Teléfono
          </label>
          <input
            type="text"
            value={editingCompany.telefono || ""}
            onChange={(e) =>
              setEditingCompany({ ...editingCompany, telefono: e.target.value })
            }
            className={`w-full border rounded p-2 ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white border-gray-300'}`}
          />
        </div>
        <div>
          <label className={`block mb-1 font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Email
          </label>
          <input
            type="email"
            value={editingCompany.email || ""}
            onChange={(e) =>
              setEditingCompany({ ...editingCompany, email: e.target.value })
            }
            className={`w-full border rounded p-2 ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white border-gray-300'}`}
          />
        </div>
      </div>

      {/* Logo */}
      <div>
        <label className={`block mb-1 font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          Logo de la empresa
        </label>
        <div className="flex items-center space-x-4">
          {editingCompany.logo ? (
            <img
              src={editingCompany.logo}
              alt="Logo"
              className="w-24 h-24 object-contain border rounded"
            />
          ) : (
            <span className="text-gray-500">Sin logo</span>
          )}
          <input type="file" accept="image/*" onChange={handleLogoUpload} />
          {editingCompany.logo && (
            <button
              onClick={handleRemoveLogo}
              className="flex items-center px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              <Trash2 size={16} className="mr-1" /> Eliminar
            </button>
          )}
        </div>
      </div>

      {/* Tema y Dark Mode */}
      <div className="flex items-center justify-between">
        <div>
          <label className={`block mb-1 font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Tema
          </label>
          <select
            value={theme}
            onChange={(e) => handleThemeChangeLocal(e.target.value)}
            className={`border rounded p-2 ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white border-gray-300'}`}
          >
            <option value="blue">Azul</option>
            <option value="green">Verde</option>
            <option value="purple">Morado</option>
            <option value="red">Rojo</option>
            <option value="gray">Gris</option>
          </select>
        </div>
        <div>
          <label className={`block mb-1 font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Modo oscuro
          </label>
          <button
            onClick={handleDarkModeToggle}
            className={`flex items-center px-3 py-2 rounded ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-900'}`}
          >
            {darkMode ? <Moon size={18} /> : <Sun size={18} />}
          </button>
        </div>
      </div>

      {/* Guardar */}
      <div>
        <button
          onClick={handleSave}
          className={`${themeClasses.buttonBg} ${themeClasses.buttonHover} text-white px-4 py-2 rounded flex items-center`}
        >
          <Save size={18} className="mr-2" /> Guardar cambios
        </button>
      </div>
    </div>
    </div>
  );
};

export default CompanySettingsView;
