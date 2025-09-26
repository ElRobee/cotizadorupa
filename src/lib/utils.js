// FUNCIONES PARA MANEJO DE TEMAS, MODO OSCURO Y LOGO DE EMPRESA

// Función para cambiar el tema de la aplicación
export const handleThemeChange = (newTheme, setTheme, setData) => {
  setTheme(newTheme);
  setData(prevData => ({
    ...prevData,
    company: {
      ...prevData.company,
      theme: newTheme
    }
  }));
  
  // Guardar en localStorage para persistencia
  localStorage.setItem('appTheme', newTheme);
};

// Función para toggle del modo oscuro
export const toggleDarkMode = (darkMode, setDarkMode) => {
  const newDarkMode = !darkMode;
  setDarkMode(newDarkMode);
  
  // Aplicar/remover clase dark del documento
  if (newDarkMode) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
  
  // Guardar en localStorage para persistencia
  localStorage.setItem('darkMode', newDarkMode.toString());
};

// Función para manejar la subida del logo
export const handleLogoUpload = (event, setNewCompanyLogo, setData) => {
  const file = event.target.files[0];
  
  if (!file) return;
  
  // Validar tipo de archivo
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    alert('Por favor, selecciona un archivo de imagen válido (JPEG, PNG, GIF, WebP)');
    return;
  }
  
  // Validar tamaño de archivo (máximo 5MB)
  const maxSize = 5 * 1024 * 1024; // 5MB en bytes
  if (file.size > maxSize) {
    alert('El archivo es demasiado grande. El tamaño máximo permitido es 5MB');
    return;
  }
  
  const reader = new FileReader();
  reader.onload = (e) => {
    const logoDataUrl = e.target.result;
    
    // Actualizar estado temporal del logo
    setNewCompanyLogo(logoDataUrl);
    
    // Actualizar datos de la empresa
    setData(prevData => ({
      ...prevData,
      company: {
        ...prevData.company,
        logo: logoDataUrl
      }
    }));
  };
  
  reader.readAsDataURL(file);
};

// Función para remover el logo
export const removeLogo = (setNewCompanyLogo, setData) => {
  setNewCompanyLogo(null);
  setData(prevData => ({
    ...prevData,
    company: {
      ...prevData.company,
      logo: null
    }
  }));
};

// Función para guardar configuraciones de la empresa
export const saveCompanySettings = (data, theme, darkMode) => {
  try {
    // Guardar en localStorage
    localStorage.setItem('companyData', JSON.stringify(data.company));
    localStorage.setItem('appTheme', theme);
    localStorage.setItem('darkMode', darkMode.toString());
    
    // Aquí podrías agregar llamada a API si tienes backend
    // await api.updateCompanySettings(data.company);
    
    alert('Configuraciones guardadas correctamente');
    return true;
  } catch (error) {
    console.error('Error al guardar configuraciones:', error);
    alert('Error al guardar configuraciones');
    return false;
  }
};

// Función para cargar configuraciones al iniciar la app
export const loadSavedSettings = (setTheme, setDarkMode, setData) => {
  try {
    // Cargar tema guardado
    const savedTheme = localStorage.getItem('appTheme');
    if (savedTheme) {
      setTheme(savedTheme);
    }
    
    // Cargar modo oscuro guardado
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode) {
      const isDark = savedDarkMode === 'true';
      setDarkMode(isDark);
      
      // Aplicar clase dark al documento
      if (isDark) {
        document.documentElement.classList.add('dark');
      }
    }
    
    // Cargar datos de empresa guardados
    const savedCompanyData = localStorage.getItem('companyData');
    if (savedCompanyData) {
      const companyData = JSON.parse(savedCompanyData);
      setData(prevData => ({
        ...prevData,
        company: { ...prevData.company, ...companyData }
      }));
    }
  } catch (error) {
    console.error('Error al cargar configuraciones guardadas:', error);
  }
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
