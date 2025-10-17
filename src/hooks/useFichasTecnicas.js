import { useState, useEffect } from 'react';
import { 
  collection, 
  doc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot 
} from 'firebase/firestore';
import { db } from '../lib/firebase';

export const useFichasTecnicas = () => {
  const [fichas, setFichas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fichasRef = collection(db, 'fichasTecnicas');
    
    const unsubscribe = onSnapshot(fichasRef, 
      (snapshot) => {
        const fichasData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setFichas(fichasData);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error("Error al cargar fichas técnicas:", err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const addFicha = async (fichaData) => {
    try {
      const docRef = await addDoc(collection(db, 'fichasTecnicas'), {
        nombre: fichaData.nombre,
        urlPDF: fichaData.urlPDF,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      return { success: true, id: docRef.id };
    } catch (error) {
      console.error("Error al agregar ficha técnica:", error);
      return { success: false, error: error.message };
    }
  };

  const updateFicha = async (id, fichaData) => {
    try {
      const fichaRef = doc(db, 'fichasTecnicas', id);
      await updateDoc(fichaRef, {
        ...fichaData,
        updatedAt: new Date()
      });
      return { success: true };
    } catch (error) {
      console.error("Error al actualizar ficha técnica:", error);
      return { success: false, error: error.message };
    }
  };

  const deleteFicha = async (id) => {
    try {
      const fichaRef = doc(db, 'fichasTecnicas', id);
      await deleteDoc(fichaRef);
      return { success: true };
    } catch (error) {
      console.error("Error al eliminar ficha técnica:", error);
      return { success: false, error: error.message };
    }
  };

  const getFichaById = (id) => {
    return fichas.find(ficha => ficha.id === id);
  };

  const getFichaByUrl = (url) => {
    return fichas.find(ficha => ficha.urlPDF === url);
  };

  return {
    fichas,
    loading,
    error,
    addFicha,
    updateFicha,
    deleteFicha,
    getFichaById,
    getFichaByUrl
  };
};