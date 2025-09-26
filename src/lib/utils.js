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
      primary: darkMode ? 'blue-500' : 'blue-600', 
      secondary: darkMode ? 'blue-900' : 'blue-100', 
      accent: darkMode ? 'blue-300' : 'blue-400',
      bg: darkMode ? 'bg-blue-900' : 'bg-blue-50',
      text: darkMode ? 'text-blue-200' : 'text-blue-900'
    },
    green: { 
      primary: darkMode ? 'green-500' : 'green-600', 
      secondary: darkMode ? 'green-900' : 'green-100', 
      accent: darkMode ? 'green-300' : 'green-400',
      bg: darkMode ? 'bg-green-900' : 'bg-green-50',
      text: darkMode ? 'text-green-200' : 'text-green-900'
    },
    purple: { 
      primary: darkMode ? 'purple-500' : 'purple-600', 
      secondary: darkMode ? 'purple-900' : 'purple-100', 
      accent: darkMode ? 'purple-300' : 'purple-400',
      bg: darkMode ? 'bg-purple-900' : 'bg-purple-50',
      text: darkMode ? 'text-purple-200' : 'text-purple-900'
    },
    red: { 
      primary: darkMode ? 'red-500' : 'red-600', 
      secondary: darkMode ? 'red-900' : 'red-100', 
      accent: darkMode ? 'red-300' : 'red-400',
      bg: darkMode ? 'bg-red-900' : 'bg-red-50',
      text: darkMode ? 'text-red-200' : 'text-red-900'
    },
    gray: { 
      primary: darkMode ? 'gray-400' : 'gray-600', 
      secondary: darkMode ? 'gray-800' : 'gray-100', 
      accent: darkMode ? 'gray-300' : 'gray-400',
      bg: darkMode ? 'bg-gray-800' : 'bg-gray-50',
      text: darkMode ? 'text-gray-200' : 'text-gray-900'
    }
  };
  
  return themes[theme] || themes.blue;
};
