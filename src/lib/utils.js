// FUNCIONES PARA MANEJO DE TEMAS Y MODO OSCURO
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Función para combinar clases CSS (utilizada por componentes UI)
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Función para cambiar el tema de la aplicación
export const handleThemeChange = (newTheme, setTheme) => {
  setTheme(newTheme);
  // Guardar en localStorage
  localStorage.setItem('app-theme', newTheme);
};

// Función para toggle del modo oscuro
export const toggleDarkMode = (darkMode, setDarkMode) => {
  const newDarkMode = !darkMode;
  setDarkMode(newDarkMode);
  
  // Aplicar al DOM
  if (newDarkMode) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
  
  // Guardar en localStorage
  localStorage.setItem('app-dark-mode', newDarkMode.toString());
};

// Función para obtener clases CSS basadas en el tema actual
export const getThemeClasses = (theme, darkMode = false) => {
  const themes = {
    blue: { 
      primary: 'bg-blue-600',
      primaryHover: 'hover:bg-blue-700', 
      secondary: darkMode ? 'bg-blue-900' : 'bg-blue-100', 
      accent: 'bg-blue-400',
      ring: 'ring-blue-500',
      border: 'border-blue-600',
      text: darkMode ? 'text-blue-200' : 'text-blue-900',
      buttonBg: 'bg-blue-600',
      buttonHover: 'hover:bg-blue-700',
      focus: 'focus:ring-blue-500'
    },
    green: { 
      primary: 'bg-green-600',
      primaryHover: 'hover:bg-green-700', 
      secondary: darkMode ? 'bg-green-900' : 'bg-green-100', 
      accent: 'bg-green-400',
      ring: 'ring-green-500',
      border: 'border-green-600',
      text: darkMode ? 'text-green-200' : 'text-green-900',
      buttonBg: 'bg-green-600',
      buttonHover: 'hover:bg-green-700',
      focus: 'focus:ring-green-500'
    },
    purple: { 
      primary: 'bg-purple-600',
      primaryHover: 'hover:bg-purple-700', 
      secondary: darkMode ? 'bg-purple-900' : 'bg-purple-100', 
      accent: 'bg-purple-400',
      ring: 'ring-purple-500',
      border: 'border-purple-600',
      text: darkMode ? 'text-purple-200' : 'text-purple-900',
      buttonBg: 'bg-purple-600',
      buttonHover: 'hover:bg-purple-700',
      focus: 'focus:ring-purple-500'
    },
    red: { 
      primary: 'bg-red-600',
      primaryHover: 'hover:bg-red-700', 
      secondary: darkMode ? 'bg-red-900' : 'bg-red-100', 
      accent: 'bg-red-400',
      ring: 'ring-red-500',
      border: 'border-red-600',
      text: darkMode ? 'text-red-200' : 'text-red-900',
      buttonBg: 'bg-red-600',
      buttonHover: 'hover:bg-red-700',
      focus: 'focus:ring-red-500'
    },
    gray: { 
      primary: 'bg-gray-600',
      primaryHover: 'hover:bg-gray-700', 
      secondary: darkMode ? 'bg-gray-800' : 'bg-gray-100', 
      accent: 'bg-gray-400',
      ring: 'ring-gray-500',
      border: 'border-gray-600',
      text: darkMode ? 'text-gray-200' : 'text-gray-900',
      buttonBg: 'bg-gray-600',
      buttonHover: 'hover:bg-gray-700',
      focus: 'focus:ring-gray-500'
    }
  };
  
  return themes[theme] || themes.blue;
};

// FUNCIONES SIMPLIFICADAS PARA COMPATIBILIDAD CON APP.JS

// Función para cargar configuraciones guardadas (simplificada)
export const loadSavedSettings = (setTheme, setDarkMode) => {
  // Esta función se simplifica ya que ahora usamos Firebase para la configuración
  // Solo cargamos configuraciones básicas del localStorage si están disponibles
  try {
    const savedTheme = localStorage.getItem('app-theme') || 'blue';
    const savedDarkMode = localStorage.getItem('app-dark-mode') === 'true';
    
    setTheme(savedTheme);
    setDarkMode(savedDarkMode);
    
    // Aplicar dark mode al DOM
    if (savedDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  } catch (error) {
    console.warn('Error loading saved settings:', error);
  }
};

// Función para guardar configuraciones de empresa (simplificada)
export const saveCompanySettings = (companyData, setData) => {
  // Esta función se simplifica ya que CompanySettingsView maneja su propio guardado con Firebase
  try {
    localStorage.setItem('app-theme', companyData.theme || 'blue');
    setData(prevData => ({
      ...prevData,
      company: companyData
    }));
  } catch (error) {
    console.warn('Error saving company settings:', error);
  }
};

// Función para manejar upload de logo (simplificada)
export const handleLogoUpload = async (file, setNewCompanyLogo) => {
  // Esta función se simplifica ya que logoService.js maneja el upload
  if (setNewCompanyLogo) {
    setNewCompanyLogo(file);
  }
  return file;
};

// Función para remover logo (simplificada)
export const removeLogo = (setNewCompanyLogo, setData) => {
  // Esta función se simplifica ya que logoService.js maneja la remoción
  if (setNewCompanyLogo) {
    setNewCompanyLogo(null);
  }
  if (setData) {
    setData(prevData => ({
      ...prevData,
      company: {
        ...prevData.company,
        logo: null
      }
    }));
  }
};
