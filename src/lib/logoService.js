import { storage } from './firebase';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { updateCompany } from '../services/firestoreService';

// Subir logo y actualizar en Firestore
export const uploadCompanyLogo = async (file, companyId) => {
  if (!file) throw new Error('No se seleccionó ningún archivo');

  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    throw new Error('Formato inválido. Solo JPG, PNG, GIF o WebP.');
  }

  if (file.size > 5 * 1024 * 1024) {
    throw new Error('El archivo es demasiado grande. Máximo permitido: 5MB');
  }

  const storageRef = ref(storage, `company/${companyId}/logo.png`);
  await uploadBytes(storageRef, file);

  const url = await getDownloadURL(storageRef);
  await updateCompany(companyId, { logo: url });

  return url;
};

// Eliminar logo de Storage y Firestore
export const removeCompanyLogo = async (companyId) => {
  const storageRef = ref(storage, `company/${companyId}/logo.png`);
  try {
    await deleteObject(storageRef);
  } catch (error) {
    console.warn('El logo no existía en Storage:', error.message);
  }
  await updateCompany(companyId, { logo: null });
};
