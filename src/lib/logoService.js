// Versión simplificada del logoService para evitar errores de build
// TODO: Implementar Firebase Storage cuando sea necesario

// Función placeholder para subir logo
export const uploadCompanyLogo = async (file, companyId) => {
  if (!file) throw new Error('No se seleccionó ningún archivo');

  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    throw new Error('Formato inválido. Solo JPG, PNG, GIF o WebP.');
  }

  if (file.size > 5 * 1024 * 1024) {
    throw new Error('El archivo es demasiado grande. Máximo permitido: 5MB');
  }

  // Por ahora, simulamos el upload y retornamos una URL placeholder
  // En el futuro, aquí se implementará Firebase Storage
  console.warn('Firebase Storage no implementado. Usando URL placeholder.');
  const placeholderUrl = `data:${file.type};base64,${await fileToBase64(file)}`;
  
  return placeholderUrl;
};

// Función placeholder para remover logo
export const removeCompanyLogo = async (companyId) => {
  console.warn('Firebase Storage no implementado. Logo removido solo localmente.');
  return null;
};

// Función auxiliar para convertir archivo a base64
const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result.split(',')[1]);
    reader.onerror = error => reject(error);
  });
};
