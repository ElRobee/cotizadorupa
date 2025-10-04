import React, { useState, useEffect } from "react";
import { useCompany } from "../hooks/useCompany";
import { handleThemeChange, toggleDarkMode, getThemeClasses } from "../lib/utils";
import { uploadCompanyLogo, removeCompanyLogo } from "../lib/logoService";
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../lib/firebase';
import { doc, setDoc } from 'firebase/firestore';

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
  Image,
  Shield,
  Lock,
  User,
  UserPlus,
  Users,
  X
} from "lucide-react";

const CompanySettingsView = ({ theme, darkMode, setTheme, setDarkMode, currentUser, userRole, userProfile, updateUserProfile, canEditCompany }) => {
  const { company, updateCompany, loading } = useCompany();
  const currentTheme = getThemeClasses(theme, darkMode);

  // Helper para verificar permisos de edición
  const userCanEdit = typeof canEditCompany === 'function' ? canEditCompany() : canEditCompany;

  // Inicializar editingCompany inmediatamente para usuarios sin permisos
  const [editingCompany, setEditingCompany] = useState(() => {
    if (!userCanEdit) {
      return {
        razonSocial: '',
        rut: '',
        direccion: '',
        telefono: '',
        email: '',
        logo: '',
        theme: theme,
        darkMode: darkMode
      };
    }
    return null;
  });
  const [isSaving, setIsSaving] = useState(false);
  const [editingUsername, setEditingUsername] = useState(userProfile?.username || currentUser?.displayName || '');
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [showCreateUserModal, setShowCreateUserModal] = useState(false);
  const [newUserForm, setNewUserForm] = useState({
    email: '',
    password: '',
    role: 'user',
    username: ''
  });
  const [isCreatingUser, setIsCreatingUser] = useState(false);

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
    } else if (!loading && !editingCompany) {
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
    }, [company, theme, setTheme, darkMode, setDarkMode, loading]);

  // Sincronizar username cuando cambie userProfile
  useEffect(() => {
    if (userProfile?.username) {
      setEditingUsername(userProfile.username);
    }
  }, [userProfile]);

  // Asegurar inicialización rápida para usuarios sin permisos
  useEffect(() => {
    if (!loading && !editingCompany) {
      setEditingCompany({
        razonSocial: company?.razonSocial || '',
        rut: company?.rut || '',
        direccion: company?.direccion || '',
        telefono: company?.telefono || '',
        email: company?.email || '',
        logo: company?.logo || '',
        theme: theme,
        darkMode: darkMode
      });
    }
  }, [loading, editingCompany, company, theme, darkMode]);

  // Solo mostrar loading para usuarios admin que realmente necesitan cargar datos
  if (userCanEdit && loading && !editingCompany) {
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

  // Actualizar perfil del usuario
  const handleUpdateProfile = async () => {
    if (!updateUserProfile) {
      alert("Error: Función de actualización no disponible");
      return;
    }
    
    setIsUpdatingProfile(true);
    try {
      await updateUserProfile({ username: editingUsername });
      alert("Perfil actualizado correctamente ✅");
    } catch (error) {
      console.error("Error al actualizar perfil:", error);
      alert("Error al actualizar perfil ❌");
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  // Crear nuevo usuario (solo administradores)
  const handleCreateUser = async () => {
    if (!userCanEdit) {
      alert("Solo los administradores pueden crear usuarios");
      return;
    }

    setIsCreatingUser(true);
    try {
      // Crear usuario en Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, newUserForm.email, newUserForm.password);
      const newUser = userCredential.user;

      // Generar username a partir del email si no se proporcionó
      const username = newUserForm.username || newUserForm.email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

      // Guardar datos del usuario en Firestore
      await setDoc(doc(db, 'users', newUser.uid), {
        role: newUserForm.role,
        username: username,
        email: newUserForm.email,
        createdAt: new Date().toISOString(),
        createdBy: currentUser.uid
      });

      alert(`Usuario ${newUserForm.email} creado correctamente ✅`);
      
      // Resetear formulario
      setNewUserForm({
        email: '',
        password: '',
        role: 'user',
        username: ''
      });
      setShowCreateUserModal(false);
      
    } catch (error) {
      console.error("Error al crear usuario:", error);
      alert(`Error al crear usuario: ${error.message}`);
    } finally {
      setIsCreatingUser(false);
    }
  };

  // Asegurar que siempre tengamos editingCompany
  if (!editingCompany) {
    setEditingCompany({
      razonSocial: company?.razonSocial || '',
      rut: company?.rut || '',
      direccion: company?.direccion || '',
      telefono: company?.telefono || '',
      email: company?.email || '',
      logo: company?.logo || '',
      theme: theme,
      darkMode: darkMode
    });
  }

  // Mostrar loading si aún no tenemos datos iniciales
  if (!editingCompany && loading) {
    return (
      <div className={`flex-1 p-4 md:p-8 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="flex items-center justify-center py-20">
          <p className={`${darkMode ? "text-gray-400" : "text-gray-600"}`}>
            Cargando configuración...
          </p>
        </div>
      </div>
    );
  }

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
    <>
    <div className={`flex-1 p-4 md:p-8 ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}>
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 md:mb-8 space-y-4 md:space-y-0">
        <div>
          <h1 className={`text-2xl md:text-3xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>
            Configuración de Empresa
          </h1>
          <p className={`mt-2 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
            {userCanEdit ? 'Gestiona la información de tu empresa' : 'Visualiza la información de empresa y personaliza tu experiencia'}
          </p>
        </div>

        {/* BOTÓN GUARDAR - Solo para administradores */}
        {userCanEdit && (
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

      {/* Banner para usuarios sin permisos de edición */}
      {!userCanEdit && (
        <div className={`mb-6 p-4 rounded-lg border-l-4 ${
          darkMode 
            ? 'bg-blue-900/20 border-blue-500 text-blue-200' 
            : 'bg-blue-50 border-blue-500 text-blue-800'
        }`}>
          <div className="flex items-center">
            <Lock className="w-5 h-5 mr-3 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-medium">Modo Solo Lectura</h4>
              <p className="text-sm mt-1 opacity-90">
                Solo los administradores pueden editar la información de empresa. Puedes personalizar tu tema y modo oscuro más abajo.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* CONTENIDO PRINCIPAL */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
        
        {/* CARD: INFORMACIÓN BÁSICA */}
        <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl shadow-sm border p-6`}>
          <div className="flex items-center space-x-3 mb-6">
            <Building2 className={`w-6 h-6 ${currentTheme.primary}`} />
            <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Información Básica
            </h3>
            {!userCanEdit && (
              <Lock className={`w-4 h-4 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
            )}
          </div>

          <div className="space-y-4">
            {/* Razón Social */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Razón Social
              </label>
              <input
                type="text"
                value={editingCompany?.razonSocial || ""}
                onChange={(e) => userCanEdit && setEditingCompany({ ...editingCompany, razonSocial: e.target.value })}
                disabled={!userCanEdit}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  userCanEdit ? currentTheme.focus : 'focus:ring-gray-300'
                } ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                } ${
                  !userCanEdit ? (darkMode ? 'opacity-60 cursor-not-allowed' : 'opacity-60 cursor-not-allowed bg-gray-50') : ''
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
                value={editingCompany?.rut || ""}
                onChange={(e) => userCanEdit && setEditingCompany({ ...editingCompany, rut: e.target.value })}
                disabled={!userCanEdit}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  userCanEdit ? currentTheme.focus : 'focus:ring-gray-300'
                } ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                } ${
                  !userCanEdit ? (darkMode ? 'opacity-60 cursor-not-allowed' : 'opacity-60 cursor-not-allowed bg-gray-50') : ''
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
            {!userCanEdit && (
              <Lock className={`w-4 h-4 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
            )}
          </div>

          <div className="space-y-4">
            {/* Teléfono */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Teléfono
              </label>
              <input
                type="text"
                value={editingCompany?.telefono || ""}
                onChange={(e) => userCanEdit && setEditingCompany({ ...editingCompany, telefono: e.target.value })}
                disabled={!userCanEdit}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  userCanEdit ? currentTheme.focus : 'focus:ring-gray-300'
                } ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                } ${
                  !userCanEdit ? (darkMode ? 'opacity-60 cursor-not-allowed' : 'opacity-60 cursor-not-allowed bg-gray-50') : ''
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
                value={editingCompany?.email || ""}
                onChange={(e) => userCanEdit && setEditingCompany({ ...editingCompany, email: e.target.value })}
                disabled={!userCanEdit}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  userCanEdit ? currentTheme.focus : 'focus:ring-gray-300'
                } ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                } ${
                  !userCanEdit ? (darkMode ? 'opacity-60 cursor-not-allowed' : 'opacity-60 cursor-not-allowed bg-gray-50') : ''
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
                value={editingCompany?.direccion || ""}
                onChange={(e) => userCanEdit && setEditingCompany({ ...editingCompany, direccion: e.target.value })}
                disabled={!userCanEdit}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  userCanEdit ? currentTheme.focus : 'focus:ring-gray-300'
                } ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                } ${
                  !userCanEdit ? (darkMode ? 'opacity-60 cursor-not-allowed' : 'opacity-60 cursor-not-allowed bg-gray-50') : ''
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
            {!userCanEdit && (
              <Lock className={`w-4 h-4 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
            )}
          </div>

          <div className="space-y-4">
            {/* Vista previa del logo */}
            {editingCompany?.logo && (
              <div className="flex justify-center">
                <img
                  src={editingCompany.logo}
                  alt="Logo de la empresa"
                  className="h-20 md:h-24 object-contain rounded-lg border border-gray-200"
                />
              </div>
            )}

            {/* Subir logo - Solo para admins */}
            {userCanEdit && (
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
                  
                  {editingCompany?.logo && (
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
            )}

            {/* Mensaje para usuarios sin permisos */}
            {!userCanEdit && (
              <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <p className={`text-sm text-center ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Solo los administradores pueden cambiar el logo
                </p>
              </div>
            )}
          </div>
        </div>

        {/* CARD: GESTIÓN DE USUARIOS - Solo para administradores */}
        <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl shadow-sm border p-6`}>
          <div className="flex items-center space-x-3 mb-6">
            <Users className={`w-6 h-6 ${currentTheme.primary}`} />
            <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Gestión de Usuarios
            </h3>
            {!userCanEdit && (
              <Lock className={`w-4 h-4 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
            )}
          </div>

          {userCanEdit ? (
            <div className="space-y-4">
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Crea nuevos usuarios para acceder al sistema
              </p>
              
              <button
                onClick={() => setShowCreateUserModal(true)}
                className={`w-full flex items-center justify-center space-x-2 px-4 py-3 text-white rounded-lg transition-colors ${currentTheme.buttonBg} ${currentTheme.buttonHover}`}
              >
                <UserPlus className="w-5 h-5" />
                <span>Crear Nuevo Usuario</span>
              </button>
            </div>
          ) : (
            <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
              <p className={`text-sm text-center ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Solo los administradores pueden gestionar usuarios
              </p>
            </div>
          )}
        </div>

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

            {/* Separador */}
            <div className={`border-t ${darkMode ? 'border-gray-600' : 'border-gray-200'} my-4`}></div>

            {/* Editar Perfil */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Nombre de Usuario
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={editingUsername}
                  onChange={(e) => setEditingUsername(e.target.value)}
                  className={`flex-1 px-3 py-2 rounded-lg border-2 transition-all ${
                    darkMode
                      ? 'bg-gray-800 border-gray-600 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 hover:border-gray-500'
                      : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 hover:border-gray-400'
                  }`}
                  placeholder="Tu nombre para cotizaciones"
                />
                <button
                  onClick={handleUpdateProfile}
                  disabled={isUpdatingProfile || editingUsername === userProfile?.username}
                  className={`px-4 py-2 text-white rounded-lg transition-colors ${
                    editingUsername === userProfile?.username
                      ? 'bg-gray-400 cursor-not-allowed'
                      : `${currentTheme.buttonBg} ${currentTheme.buttonHover}`
                  } ${
                    isUpdatingProfile ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {isUpdatingProfile ? 'Guardando...' : 'Actualizar'}
                </button>
              </div>
              <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Este nombre aparecerá en las cotizaciones y emails que generes
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* MODAL: CREAR USUARIO */}
    {showCreateUserModal && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className={`w-full max-w-md mx-4 rounded-xl shadow-xl p-6 ${
          darkMode ? 'bg-gray-800' : 'bg-white'
        }`}>
          <div className="flex items-center justify-between mb-6">
            <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Crear Nuevo Usuario
            </h3>
            <button
              onClick={() => setShowCreateUserModal(false)}
              className={`p-1 rounded-lg transition-colors ${
                darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
              }`}
            >
              <X className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
            </button>
          </div>

          <div className="space-y-4">
            {/* Email */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Email
              </label>
              <input
                type="email"
                value={newUserForm.email}
                onChange={(e) => setNewUserForm({...newUserForm, email: e.target.value})}
                className={`w-full px-3 py-2 rounded-lg border-2 transition-all ${
                  darkMode
                    ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500'
                    : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                }`}
                placeholder="usuario@ejemplo.com"
                required
              />
            </div>

            {/* Contraseña */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Contraseña
              </label>
              <input
                type="password"
                value={newUserForm.password}
                onChange={(e) => setNewUserForm({...newUserForm, password: e.target.value})}
                className={`w-full px-3 py-2 rounded-lg border-2 transition-all ${
                  darkMode
                    ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500'
                    : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                }`}
                placeholder="Mínimo 6 caracteres"
                required
              />
            </div>

            {/* Nombre de usuario */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Nombre de Usuario (opcional)
              </label>
              <input
                type="text"
                value={newUserForm.username}
                onChange={(e) => setNewUserForm({...newUserForm, username: e.target.value})}
                className={`w-full px-3 py-2 rounded-lg border-2 transition-all ${
                  darkMode
                    ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500'
                    : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                }`}
                placeholder="Se generará automáticamente si no se especifica"
              />
            </div>

            {/* Rol */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Rol
              </label>
              <select
                value={newUserForm.role}
                onChange={(e) => setNewUserForm({...newUserForm, role: e.target.value})}
                className={`w-full px-3 py-2 rounded-lg border-2 transition-all ${
                  darkMode
                    ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500'
                    : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                }`}
              >
                <option value="user">Usuario</option>
                <option value="admin">Administrador</option>
              </select>
            </div>
          </div>

          {/* Botones */}
          <div className="flex space-x-3 mt-6">
            <button
              onClick={() => setShowCreateUserModal(false)}
              className={`flex-1 px-4 py-2 border rounded-lg transition-colors ${
                darkMode 
                  ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              Cancelar
            </button>
            <button
              onClick={handleCreateUser}
              disabled={isCreatingUser || !newUserForm.email || !newUserForm.password}
              className={`flex-1 px-4 py-2 text-white rounded-lg transition-colors ${
                isCreatingUser || !newUserForm.email || !newUserForm.password
                  ? 'bg-gray-400 cursor-not-allowed'
                  : `${currentTheme.buttonBg} ${currentTheme.buttonHover}`
              }`}
            >
              {isCreatingUser ? 'Creando...' : 'Crear Usuario'}
            </button>
          </div>
        </div>
      </div>
    )}
  </>
  );
};

export default CompanySettingsView;
