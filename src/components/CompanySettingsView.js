import React, { useState, useEffect } from "react";
import { useCompany } from "../hooks/useCompany";
import { handleThemeChange, toggleDarkMode, getThemeClasses } from "../lib/utils";
import { uploadCompanyLogo, removeCompanyLogo } from "../lib/logoService";

import { Save, Upload, Trash2, Palette, Moon, Sun } from "lucide-react";

const CompanySettingsView = () => {
  const { company, updateCompany, loading } = useCompany();

  const [editingCompany, setEditingCompany] = useState(null);
  const [theme, setTheme] = useState("blue");
  const [darkMode, setDarkMode] = useState(false);
  const themeClasses = getThemeClasses(theme, darkMode);

  // Cargar datos iniciales cuando vienen de Firestore
  useEffect(() => {
    if (company) {
      setEditingCompany({ ...company });
      setTheme(company.theme || "blue");
    }
  }, [company]);

  if (loading) return <p className="text-center">Cargando configuración...</p>;
  if (!editingCompany) return <p className="text-center">No hay datos de empresa.</p>;

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
    <div className="p-6 space-y-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Configuración de Empresa</h2>

      {/* Razon Social */}
      <div>
        <label className="block mb-1 font-medium">Razón Social</label>
        <input
          type="text"
          value={editingCompany.razonSocial || ""}
          onChange={(e) =>
            setEditingCompany({ ...editingCompany, razonSocial: e.target.value })
          }
          className="w-full border rounded p-2"
        />
      </div>

      {/* RUT */}
      <div>
        <label className="block mb-1 font-medium">RUT</label>
        <input
          type="text"
          value={editingCompany.rut || ""}
          onChange={(e) =>
            setEditingCompany({ ...editingCompany, rut: e.target.value })
          }
          className="w-full border rounded p-2"
        />
      </div>

      {/* Dirección */}
      <div>
        <label className="block mb-1 font-medium">Dirección</label>
        <input
          type="text"
          value={editingCompany.direccion || ""}
          onChange={(e) =>
            setEditingCompany({ ...editingCompany, direccion: e.target.value })
          }
          className="w-full border rounded p-2"
        />
      </div>

      {/* Ciudad y Región */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block mb-1 font-medium">Ciudad</label>
          <input
            type="text"
            value={editingCompany.ciudad || ""}
            onChange={(e) =>
              setEditingCompany({ ...editingCompany, ciudad: e.target.value })
            }
            className="w-full border rounded p-2"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Región</label>
          <input
            type="text"
            value={editingCompany.region || ""}
            onChange={(e) =>
              setEditingCompany({ ...editingCompany, region: e.target.value })
            }
            className="w-full border rounded p-2"
          />
        </div>
      </div>

      {/* Teléfono y Email */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block mb-1 font-medium">Teléfono</label>
          <input
            type="text"
            value={editingCompany.telefono || ""}
            onChange={(e) =>
              setEditingCompany({ ...editingCompany, telefono: e.target.value })
            }
            className="w-full border rounded p-2"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Email</label>
          <input
            type="email"
            value={editingCompany.email || ""}
            onChange={(e) =>
              setEditingCompany({ ...editingCompany, email: e.target.value })
            }
            className="w-full border rounded p-2"
          />
        </div>
      </div>

      {/* Logo */}
      <div>
        <label className="block mb-1 font-medium">Logo de la empresa</label>
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
          <label className="block mb-1 font-medium">Tema</label>
          <select
            value={theme}
            onChange={(e) =>
              handleThemeChange(e.target.value, setTheme, setEditingCompany)
            }
            className="border rounded p-2"
          >
            <option value="blue">Azul</option>
            <option value="green">Verde</option>
            <option value="purple">Morado</option>
            <option value="red">Rojo</option>
            <option value="gray">Gris</option>
          </select>
        </div>
        <div>
          <label className="block mb-1 font-medium">Modo oscuro</label>
          <button
            onClick={() => toggleDarkMode(darkMode, setDarkMode)}
            className="flex items-center px-3 py-2 bg-gray-200 rounded"
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
  );
};

export default CompanySettingsView;
